import uuid

from google.cloud import bigquery


class UserManager:
    def __init__(
        self, project_id: str, dataset_id: str, table_id: str
    ):
        self.client = bigquery.Client(project=project_id)
        self.dataset_id = dataset_id
        self.table_id = table_id
        self.table_ref = self.client.dataset(dataset_id).table(
            table_id
        )

    def check_and_create_user(
        self, google_id: str, nickname: str, icon_url: str
    ) -> str:
        # Check if google_id exists in the table
        query = f"""
            SELECT user_id
            FROM `{self.dataset_id}.{self.table_id}`
            WHERE google_id = @google_id
        """
        job_config = bigquery.QueryJobConfig(
            query_parameters=[
                bigquery.ScalarQueryParameter(
                    "google_id", "STRING", google_id
                )
            ]
        )
        query_job = self.client.query(query, job_config=job_config)

        results = query_job.result()

        # If a result exists, return the existing user_id
        if results.total_rows > 0:
            # The first result should contain the user_id
            for row in results:
                return row.user_id
            
        # If no result exists, create a new user_id and insert the new entry
        new_user_id = str(
            uuid.uuid4()
        )  # Generating a new user_id
        self.create_user(
            google_id, nickname, icon_url, new_user_id
        )
        return new_user_id

    def create_user(
        self,
        google_id: str,
        nickname: str,
        icon_url: str,
        user_id: str,
    ):
        # Insert the new user entry into the BigQuery table
        rows_to_insert = [
            {
                "google_id": google_id,
                "nickname": nickname,
                "icon_url": icon_url,
                "user_id": user_id,
            }
        ]
        errors = self.client.insert_rows_json(
            self.table_ref, rows_to_insert
        )
        if errors:
            print("Errors occurred while inserting rows:", errors)
        else:
            print(f"User with ID {user_id} successfully added.")


# Usage Example
if __name__ == "__main__":
    project_id = "your_project_id"
    dataset_id = "your_dataset_id"
    table_id = "your_table_id"

    user_manager = UserManager(project_id, dataset_id, table_id)

    google_id = "google_id_123"
    nickname = "nickname_example"
    icon_url = "http://example.com/icon.jpg"

    user_id = user_manager.check_and_create_user(
        google_id, nickname, icon_url
    )
    print(f"User ID: {user_id}")
