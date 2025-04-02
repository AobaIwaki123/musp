```sh
% sudo docker compose --env-file ./api/prod.env -f compose.k8s.yml build 
% sudo docker compose --env-file ./api/prod.env -f compose.k8s.yml run --rm -it k8s-cron bash
```
