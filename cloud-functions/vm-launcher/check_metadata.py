
import os
import unittest
from unittest.mock import MagicMock, patch
import yaml

# Mock environment variables before importing main
os.environ["PROJECT_ID"] = "test-project"
os.environ["ZONE"] = "test-zone"
os.environ["DATASET_ID"] = "test-dataset"
os.environ["BUCKET_NAME"] = "test-bucket"

# Import the module to test
import main

class TestLaunchVM(unittest.TestCase):
    @patch('main.compute_v1.InstancesClient')
    def test_launch_vm_metadata(self, mock_client_class):
        # Setup mock
        mock_client = mock_client_class.return_value
        mock_operation = MagicMock()
        mock_client.insert.return_value = mock_operation
        
        # Execute function
        main.launch_vm(
            project_id="test-project",
            zone="test-zone",
            image="test-image",
            sa_email="test-sa",
            dataset_id="test-dataset",
            bucket_name="test-bucket"
        )
        
        # Verify call args
        call_args = mock_client.insert.call_args
        self.assertIsNotNone(call_args)
        
        # Extract config
        config = call_args[1]['instance_resource']
        metadata_items = config['metadata']['items']
        
        # Find gce-container-declaration
        container_decl = None
        for item in metadata_items:
            if item['key'] == 'gce-container-declaration':
                container_decl = item['value']
                break
        
        self.assertIsNotNone(container_decl)
        
        # Parse YAML to verify structure
        manifest = yaml.safe_load(container_decl)
        env_vars = manifest['spec']['containers'][0]['env']
        
        # Convert list of dicts to dict for easier assertion
        env_dict = {item['name']: item['value'] for item in env_vars}
        
        self.assertEqual(env_dict.get("GOOGLE_CLOUD_PROJECT"), "test-project")
        self.assertEqual(env_dict.get("DATASET_ID"), "test-dataset")
        self.assertEqual(env_dict.get("BUCKET_NAME"), "test-bucket")
        self.assertEqual(env_dict.get("MAX_WORKERS"), "2")
        print("Verification Successful: Environment variables correctly injected into container manifest.")

if __name__ == '__main__':
    unittest.main()
