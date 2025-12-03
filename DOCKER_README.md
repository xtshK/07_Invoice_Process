# Docker 設置說明

## 快速開始

### 開發環境
```bash
# 使用 docker-compose (推薦)
docker-compose --profile dev up app-dev

# 或使用 make
make dev
```
應用程式會在 http://localhost:5173 啟動，並支援熱重載

### 生產環境
```bash
# 構建映像檔
make build

# 啟動容器
make run
```
應用程式會在 http://localhost:3000 啟動

## 常用指令

```bash
make help    # 顯示所有可用指令
make build   # 構建 Docker 映像檔
make run     # 執行生產容器
make dev     # 執行開發容器
make stop    # 停止所有容器
make clean   # 清理容器和映像檔
make logs    # 查看容器日誌
make test    # 在 Docker 中執行測試
make shell   # 開啟容器的 shell
```

## CI/CD 設置

### GitHub Actions
- 設定檔位於 `.github/workflows/ci-cd.yml`
- 自動觸發：
  - Push 到 main/develop 分支
  - Pull Request 到 main 分支
- 執行步驟：
  1. 測試 (lint, build)
  2. 構建並推送 Docker 映像檔
  3. 部署（需要額外配置）

### GitLab CI
- 設定檔位於 `.gitlab-ci.yml`
- 包含測試、構建和部署階段
- 自動部署到 staging (develop 分支)
- 手動部署到 production (main 分支)

## 環境變數設置

如需設置環境變數，建立 `.env` 檔案：
```env
# API 設定
VITE_API_URL=https://api.example.com

# 其他設定
VITE_APP_NAME=Invoice System
```

## 部署選項

### 1. Docker Hub
```bash
# 登入 Docker Hub
docker login

# 標記映像檔
docker tag invoice-system:latest yourusername/invoice-system:latest

# 推送映像檔
docker push yourusername/invoice-system:latest
```

### 2. GitHub Container Registry
```bash
# 登入 ghcr.io
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin

# 標記並推送
docker tag invoice-system:latest ghcr.io/USERNAME/invoice-system:latest
docker push ghcr.io/USERNAME/invoice-system:latest
```

### 3. 部署到雲端平台

#### Google Cloud Run
```bash
gcloud run deploy invoice-system \
  --image gcr.io/PROJECT_ID/invoice-system \
  --platform managed \
  --region asia-east1 \
  --allow-unauthenticated
```

#### AWS ECS
```bash
# 使用 AWS CLI 部署到 ECS/Fargate
aws ecs update-service \
  --cluster production \
  --service invoice-system \
  --force-new-deployment
```

#### Azure Container Instances
```bash
az container create \
  --resource-group myResourceGroup \
  --name invoice-system \
  --image yourusername/invoice-system:latest \
  --dns-name-label invoice-system \
  --ports 80
```

## 故障排除

### 容器無法啟動
```bash
# 檢查日誌
docker-compose logs app

# 檢查容器狀態
docker ps -a
```

### 權限問題
```bash
# 修復檔案權限
sudo chown -R $(whoami):$(whoami) .
```

### 清理 Docker 空間
```bash
# 清理未使用的資源
docker system prune -a
```