```sh
% sudo docker build -t cron-test -f cron.Dockerfile .
% sudo docker compose --env-file ./api/prod.env -f compose.k8s.yml build 
% sudo docker compose --env-file ./api/prod.env -f compose.k8s.yml run --rm -it k8s-cron bash
```

```sh
% sudo docker tag cron-test:latest harbor.shaoba.tech/library/cron-test:latest
% sudo docker push --disable-content-trust harbor.shaoba.tech/k8s-test/cron-test:latest
```
