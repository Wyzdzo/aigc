# AIGC Blog 部署指南

本指南详细说明 AIGC Blog 系统的生产环境部署流程，包括环境准备、构建、启动、Nginx 配置、Docker 部署、进程管理、数据库迁移、健康检查、监控日志及安全检查清单。

## 1. 系统要求

| 组件     | 最低版本 |
| -------- | -------- |
| Node.js  | >= 20.x |
| MySQL    | >= 8.0  |
| Redis    | >= 7.0  |
| npm      | >= 11.x |

操作系统推荐使用 Ubuntu 22.04 LTS 或同等 Linux 发行版，时区设置为 `Asia/Shanghai`：

```bash
sudo timedatectl set-timezone Asia/Shanghai
```

## 2. 环境变量配置

### 2.1 后端环境变量

后端环境变量模板位于 `backend/env/.env.example`，部署前需复制并修改：

```bash
cp backend/env/.env.example backend/env/.env.production
```

**关键变量说明：**

| 变量                            | 说明                                                         | 生产环境建议                          |
| ------------------------------- | ------------------------------------------------------------ | ------------------------------------- |
| `NODE_ENV`                      | 运行环境                                                     | `production`                          |
| `APP_PORT`                      | API 服务端口                                                 | 如 `3000`                             |
| `APP_HOST`                      | API 服务监听地址                                             | `0.0.0.0`                             |
| `DB_HOST` / `DB_PORT`           | MySQL 连接地址与端口                                         | 按实际配置填写                        |
| `DB_USER` / `DB_PASS` / `DB_NAME` | MySQL 认证信息                                               | 使用专用生产账号                      |
| `REDIS_HOST` / `REDIS_PORT`     | Redis 连接地址与端口                                         | 按实际配置填写                        |
| `REDIS_PASSWORD`                | Redis 密码                                                   | **必须设置**                          |
| `JWT_SECRET`                    | JWT 签名密钥                                                 | **必须修改**，使用 32+ 位随机字符串   |
| `FIELD_ENCRYPTION_KEY`          | 字段加密密钥                                                 | **必须修改**，16 位随机字符串         |
| `FIELD_ENCRYPTION_IV`           | 字段加密初始向量                                             | **必须修改**，16 位随机字符串         |
| `GRAPHQL_SANDBOX_ENABLED`       | GraphQL Sandbox 开关                                         | `false`                               |
| `GRAPHQL_INTROSPECTION_ENABLED` | GraphQL Introspection 开关                                   | `false`                               |
| `APP_CORS_ORIGINS`              | CORS 允许的来源                                              | 设置为生产前端 URL                    |
| `DB_SYNCHRONIZE`                | TypeORM 自动同步表结构                                       | `false`                               |
| `LOG_LEVEL`                     | 日志级别                                                     | `info`                                |

生成随机密钥的快捷方式：

```bash
# JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# FIELD_ENCRYPTION_KEY / IV (16 字符)
node -e "console.log(require('crypto').randomBytes(8).toString('hex'))"
```

### 2.2 前端环境变量

前端环境变量模板位于 `frontend/env/`，根据环境创建对应文件：

| 变量                          | 说明                   | 示例                                    |
| ----------------------------- | ---------------------- | --------------------------------------- |
| `VITE_GRAPHQL_ENDPOINT`       | GraphQL API 地址       | `https://api.example.com/graphql`       |
| `VITE_API_HEALTH_ENDPOINT`    | 健康检查端点           | `https://api.example.com/health`        |
| `VITE_API_READINESS_ENDPOINT` | 就绪检查端点           | `https://api.example.com/health/readiness` |
| `BUILD_SOURCEMAP`             | 是否生成 sourcemap     | `false`                                 |

## 3. 构建步骤

### 3.1 后端构建

```bash
cd backend
npm ci
npm run build
```

构建产物输出至 `dist/` 目录，主要入口：

- API 服务：`dist/bootstraps/api/main.js`
- Worker 服务：`dist/bootstraps/worker/main.js`

### 3.2 前端构建

```bash
cd frontend
npm ci
npm run build
```

构建产物输出至 `dist/` 目录，为静态文件，可由任意 Web 服务器托管。

## 4. 启动服务

### 4.1 后端 API

```bash
NODE_ENV=production node dist/bootstraps/api/main.js
```

API 服务提供 REST 健康检查端点和 GraphQL 接口。

### 4.2 后端 Worker

```bash
NODE_ENV=production node dist/bootstraps/worker/main.js
```

Worker 服务基于 BullMQ 处理异步任务队列（如 AI 内容生成），必须与 API 服务同时运行。

### 4.3 前端静态文件服务

前端为纯静态文件，推荐使用 Nginx 托管 `frontend/dist/` 目录，并将 GraphQL 请求反向代理至后端 API 服务。

## 5. Nginx 配置示例

```nginx
upstream backend_api {
    server 127.0.0.1:3000;
    keepalive 32;
}

server {
    listen 80;
    server_name example.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name example.com;

    # SSL 证书
    ssl_certificate     /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;
    ssl_protocols       TLSv1.2 TLSv1.3;
    ssl_ciphers         HIGH:!aNULL:!MD5;

    # 前端静态文件
    root /home/Xww/myproject/frontend/dist;
    index index.html;

    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml
        application/rss+xml
        image/svg+xml;

    # 安全响应头
    add_header X-Frame-Options       "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff"    always;
    add_header X-XSS-Protection      "1; mode=block" always;
    add_header Referrer-Policy       "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' https://api.example.com;" always;

    # GraphQL API 代理
    location /graphql {
        proxy_pass http://backend_api;
        proxy_http_version 1.1;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # GraphQL WebSocket 订阅代理
        proxy_set_header Upgrade    $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 86400s;
        proxy_send_timeout 86400s;
    }

    # 健康检查代理
    location ~ ^/health(/readiness)?$ {
        proxy_pass http://backend_api;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 媒体文件上传代理（增大请求体限制）
    location /upload {
        client_max_body_size 50m;
        proxy_pass http://backend_api;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 前端 SPA 路由回退
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源长缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2?)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

## 6. Docker 部署（推荐）

### 6.1 后端 Dockerfile

在 `backend/` 目录下创建 `Dockerfile`：

```dockerfile
# ---- 构建阶段 ----
FROM node:20-alpine AS builder
WORKDIR /app
COPY package-lock.json package.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---- 生产阶段 ----
FROM node:20-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
COPY package-lock.json package.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/bootstraps/api/main.js"]
```

### 6.2 前端 Dockerfile

在 `frontend/` 目录下创建 `Dockerfile`：

```dockerfile
# ---- 构建阶段 ----
FROM node:20-alpine AS builder
WORKDIR /app
COPY package-lock.json package.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---- 生产阶段 ----
FROM nginx:1.27-alpine AS production
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

前端 Nginx 容器内 `nginx.conf`：

```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml image/svg+xml;

    location /graphql {
        proxy_pass http://backend-api:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade    $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host       $host;
        proxy_read_timeout 86400s;
    }

    location ~ ^/health(/readiness)?$ {
        proxy_pass http://backend-api:3000;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2?)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

### 6.3 docker-compose.yml

在项目根目录创建 `docker-compose.yml`：

```yaml
version: "3.9"

services:
  mysql:
    image: mysql:8.0
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_PASS}
      MYSQL_DATABASE: ${DB_NAME}
      MYSQL_USER: ${DB_USER}
      MYSQL_PASSWORD: ${DB_PASS}
      TZ: Asia/Shanghai
    volumes:
      - mysql_data:/var/lib/mysql
    ports:
      - "3306:3306"
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7.0-alpine
    restart: always
    command: redis-server --requirepass ${REDIS_PASSWORD} --appendonly yes
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "-a", "${REDIS_PASSWORD}", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend-api:
    build:
      context: ./backend
      dockerfile: Dockerfile
    restart: always
    env_file:
      - ./backend/env/.env.production
    depends_on:
      mysql:
        condition: service_healthy
      redis:
        condition: service_healthy
    ports:
      - "3000:3000"

  backend-worker:
    build:
      context: ./backend
      dockerfile: Dockerfile
    restart: always
    env_file:
      - ./backend/env/.env.production
    command: ["node", "dist/bootstraps/worker/main.js"]
    depends_on:
      mysql:
        condition: service_healthy
      redis:
        condition: service_healthy

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    restart: always
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - backend-api

volumes:
  mysql_data:
  redis_data:
```

启动：

```bash
docker compose up -d
```

## 7. 进程管理

生产环境推荐使用 PM2 管理后端进程。

### 7.1 安装 PM2

```bash
npm install -g pm2
```

### 7.2 ecosystem.config.js

在项目根目录创建 `ecosystem.config.js`：

```javascript
module.exports = {
  apps: [
    {
      name: 'aigc-blog-api',
      script: 'dist/bootstraps/api/main.js',
      cwd: '/home/Xww/myproject/backend',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
      },
      max_memory_restart: '512M',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: '/var/log/aigc-blog/api-error.log',
      out_file: '/var/log/aigc-blog/api-out.log',
      merge_logs: true,
    },
    {
      name: 'aigc-blog-worker',
      script: 'dist/bootstraps/worker/main.js',
      cwd: '/home/Xww/myproject/backend',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
      },
      max_memory_restart: '512M',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: '/var/log/aigc-blog/worker-error.log',
      out_file: '/var/log/aigc-blog/worker-out.log',
      merge_logs: true,
    },
  ],
};
```

### 7.3 常用命令

```bash
# 启动所有进程
pm2 start ecosystem.config.js

# 查看状态
pm2 status

# 查看日志
pm2 logs

# 重启
pm2 restart all

# 停止
pm2 stop all

# 设置开机自启
pm2 startup
pm2 save
```

## 8. 数据库迁移

> ⚠️ **重要：** 生产环境必须设置 `DB_SYNCHRONIZE=false`，禁止 TypeORM 自动同步表结构。

### 8.1 迁移文件位置

迁移文件位于 `backend/src/infrastructure/database/migrations/`。

### 8.2 运行迁移

在部署新版本前，先执行数据库迁移：

```bash
cd backend
NODE_ENV=production npm run migration:run
```

### 8.3 回滚迁移

如需回滚：

```bash
NODE_ENV=production npm run migration:revert
```

### 8.4 生成新迁移

开发环境中，修改 Entity 后生成迁移文件：

```bash
npm run migration:generate -- -n MigrationName
```

## 9. 健康检查

后端 API 提供两个健康检查端点：

| 端点                  | 用途     | 检查内容             |
| --------------------- | -------- | -------------------- |
| `GET /health`         | 存活检查 | 进程是否在运行       |
| `GET /health/readiness` | 就绪检查 | 数据库连接 + Redis 连接 |

### Kubernetes 示例

```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 3000
  initialDelaySeconds: 15
  periodSeconds: 20

readinessProbe:
  httpGet:
    path: /health/readiness
    port: 3000
  initialDelaySeconds: 10
  periodSeconds: 10
```

## 10. 监控与日志

### 10.1 后端日志

后端使用 Pino 结构化日志，生产环境建议：

- `LOG_LEVEL=info`：记录常规请求和错误，避免 `debug` 级别产生过多日志
- 日志输出为 JSON 格式，方便 ELK / Loki 等日志系统采集

### 10.2 前端构建

- 生产构建禁用 sourcemap（`BUILD_SOURCEMAP=false`），避免源码泄露
- 构建产物已压缩和 tree-shaking，体积最小化

### 10.3 推荐监控方案

| 层级     | 方案                                |
| -------- | ----------------------------------- |
| 进程     | PM2 Plus / `pm2 monit`              |
| 系统     | Prometheus + Grafana + Node Exporter |
| 日志     | Pino → Filebeat → Elasticsearch → Kibana (ELK) |
| APM      | OpenTelemetry + Jaeger              |

## 11. 安全检查清单

部署上线前，逐项确认以下安全配置：

- [ ] **JWT_SECRET** — 已从开发默认值更改为强随机密钥
- [ ] **FIELD_ENCRYPTION_KEY / FIELD_ENCRYPTION_IV** — 已更改为 16 位随机字符串
- [ ] **GraphQL Sandbox** — `GRAPHQL_SANDBOX_ENABLED=false`
- [ ] **GraphQL Introspection** — `GRAPHQL_INTROSPECTION_ENABLED=false`
- [ ] **CORS 来源** — `APP_CORS_ORIGINS` 仅允许生产前端域名
- [ ] **数据库自动同步** — `DB_SYNCHRONIZE=false`
- [ ] **Redis 密码** — `REDIS_PASSWORD` 已设置且强度足够
- [ ] **Nginx 安全头** — X-Frame-Options、X-Content-Type-Options、CSP 等已配置
- [ ] **速率限制** — 已配置请求频率限制（Nginx `limit_req` 或应用层）
- [ ] **SSL/TLS** — 已启用 HTTPS，使用有效证书，禁用旧协议
- [ ] **敏感文件** — `.env` 文件未纳入版本控制，服务器文件权限正确（600）
- [ ] **依赖安全** — 已运行 `npm audit` 修复已知漏洞
