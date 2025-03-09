import { createApiClient } from "@/client/client";

export const api = createApiClient("http://localhost:8000");

api
  .postJobs({
    youtube_url: "https://www.youtube.com/watch?v=8Uee_mcxvrw",
  })
  .then((response) => {
    console.log(response);
    const job_id = response.job_id;
    api.getThumbnailJob_id({ job_id }).then((response) => {
      console.log(response);
    });
  });
