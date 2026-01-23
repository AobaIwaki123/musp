# デプロイガイド

このドキュメントでは、APIおよびViewコンポーネントのDockerイメージをビルドしてプッシュする手順について説明します。

## 前提条件

- **Docker**: Dockerがインストールされ、実行されていること。
- **Google Cloud SDK (`gcloud`)**: インストールされ、認証済みであること。
- **プロジェクトID**: KubernetesマニフェストではプロジェクトID `my-docker-471807` を使用しています。
- **GCR認証**: DockerがGoogle Container Registryで認証できるように設定します。

```bash
gcloud auth configure-docker
```

## APIコンポーネント

### 1. イメージのビルド

プロジェクトルートに移動して実行します：

```bash
# 必要に応じて 'latest' を特定のタグに置き換えてください
docker build \
  --platform linux/amd64 \
  -t gcr.io/my-docker-471807/musp-api:latest \
  api/
```

> **注**: GKEクラスタ（標準的なAMD64ノードを想定）との互換性を確保するため、`--platform linux/amd64` を指定しています。

### 2. イメージのプッシュ

```bash
docker push gcr.io/my-docker-471807/musp-api:latest
```

### 3. K8sへのデプロイ

デプロイを更新する必要がある場合：

```bash
kubectl rollout restart deployment musp-api -n musp
```

---

## Viewコンポーネント

### 1. イメージのビルド

Viewコンポーネント（Next.js）には、ビルド引数 `NEXT_PUBLIC_API_URL` が必要です。これは、APIがアクセス可能なパブリックURL（LoadBalancer IPやドメインなど）である必要があります。

```bash
# 'YOUR_API_PUBLIC_URL' を実際のURL（例: http://34.x.x.x:8000）に置き換えてください
docker build \
  --platform linux/amd64 \
  --build-arg NEXT_PUBLIC_API_URL=http://musp-api.musp.svc.cluster.local \
  -t gcr.io/my-docker-471807/musp-view:latest \
  view/
```

### 2. イメージのプッシュ

```bash
docker push gcr.io/my-docker-471807/musp-view:latest
```

### 3. K8sへのデプロイ

デプロイを更新する必要がある場合：

```bash
kubectl rollout restart deployment musp-view -n musp
```
