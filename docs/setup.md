# CivicTwinAI Setup Guide

This guide explains how to set up CivicTwinAI for local development. The project includes these main components:

- **Frontend:** Next.js, available at `http://localhost:3000`
- **Backend API:** Laravel, available at `http://localhost:8000`
- **AI Service:** Python FastAPI, available at `http://localhost:8001`
- **Database:** PostgreSQL + PostGIS
- **Cache/Queue:** Redis
- **Realtime:** Soketi WebSocket
- **Messaging/IoT:** Kafka, Zookeeper, and Mosquitto MQTT

---

## 1. System Requirements

### Required for Docker Setup

- Git
- Docker Desktop or Docker Engine
- Docker Compose V2
- At least 8 GB RAM recommended for the full stack

### Required for Non-Docker Setup

- PHP 8.2+ and Composer
- Node.js and Yarn 1.x
- Python 3.10+
- PostgreSQL 16+ with PostGIS enabled
- Redis

### Optional but Recommended

- Mapbox token for map rendering
- Kafka, Zookeeper, and an MQTT broker for the full IoT pipeline
- Soketi for full realtime WebSocket behavior

---

## 2. Clone the Repository

```bash
git clone https://github.com/ASEAN-AI-DZ/CivicTwin.git
cd CivicTwin
```

All commands below assume you are working from the repository root unless stated otherwise.

---

## 3. Environment Configuration

### 3.1. Root `.env` for Docker Compose

`docker-compose.yml` reads environment variables from the root `.env` file. If it does not exist, create one with:

```env
DB_DATABASE=civictwin
DB_USERNAME=civictwin
DB_PASSWORD=secret

MAPBOX_TOKEN=pk_your_mapbox_token

AI_SERVICE_KEY=internal-key

PUSHER_APP_KEY=civictwin-key
PUSHER_APP_SECRET=civictwin-secret
```

### 3.2. Backend `.env`

The backend template is located at `backend/.env.example`.

Linux/macOS:

```bash
cd backend
cp .env.example .env
```

Windows PowerShell:

```powershell
cd backend
Copy-Item .env.example .env
```

If you run the backend directly on your machine, configure `backend/.env` like this:

```env
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=civictwin
DB_USERNAME=postgres
DB_PASSWORD=secret

QUEUE_CONNECTION=database
CACHE_STORE=database
SESSION_DRIVER=database

REDIS_CLIENT=predis
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=null

AI_SERVICE_URL=http://127.0.0.1:8001
AI_SERVICE_KEY=internal-key

BROADCAST_CONNECTION=pusher
PUSHER_APP_ID=civictwin
PUSHER_APP_KEY=civictwin-key
PUSHER_APP_SECRET=civictwin-secret
PUSHER_HOST=127.0.0.1
PUSHER_PORT=6001
PUSHER_SCHEME=http
```

If the backend runs on your machine but PostgreSQL comes from `docker compose`, use:

```env
DB_HOST=127.0.0.1
DB_DATABASE=civictwin
DB_USERNAME=civictwin
DB_PASSWORD=secret
```

### 3.3. AI Service `.env`

The AI service template is located at `ai-service/.env.example`.

Linux/macOS:

```bash
cd ai-service
cp .env.example .env
```

Windows PowerShell:

```powershell
cd ai-service
Copy-Item .env.example .env
```

Common local configuration:

```env
PROJECT_NAME="CivicTwin AI Service"
VERSION="1.0.0"

DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=civictwin
DB_USERNAME=postgres
DB_PASSWORD=secret

AI_SERVICE_KEY=internal-key
```

You can also use a single connection string:

```env
DATABASE_URL=postgresql://postgres:secret@127.0.0.1:5432/civictwin
```

If the AI service runs on your machine but PostgreSQL comes from `docker compose`, use:

```env
DB_HOST=127.0.0.1
DB_DATABASE=civictwin
DB_USERNAME=civictwin
DB_PASSWORD=secret
```

### 3.4. Frontend `.env.local`

Create or update `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_MAPBOX_TOKEN=pk_your_mapbox_token
NEXT_PUBLIC_WS_HOST=localhost
NEXT_PUBLIC_WS_PORT=6001
NEXT_PUBLIC_WS_KEY=civictwin-key
```

---

## 4. Option 1: Run Everything with Docker Compose

This is the easiest way to run the full stack.

### 4.1. Build and Start Services

```bash
docker compose up -d --build
```

The first run may take several minutes while Docker downloads images and builds containers.

### 4.2. Check Service Status

```bash
docker compose ps
```

The main containers should be in a `running` state:

| Service | Container | Port |
|---|---|---|
| Frontend | `civictwin-frontend` | `3000` |
| Backend | `civictwin-laravel` | `8000` |
| AI Service | `civictwin-ai` | `8001` |
| PostgreSQL | `civictwin-postgres` | `5432` |
| Redis | `civictwin-redis` | `6379` |
| Kafka | `civictwin-kafka` | `9092` |
| MQTT | `civictwin-mqtt` | `1883` |
| Soketi | `civictwin-soketi` | `6001` |

### 4.3. Initialize the Database

```bash
docker exec -it civictwin-laravel php artisan key:generate
docker exec -it civictwin-laravel php artisan migrate --seed
```

If the database already contains data and you only need to apply new schema changes:

```bash
docker exec -it civictwin-laravel php artisan migrate
```

### 4.4. View Logs

```bash
docker compose logs -f laravel
docker compose logs -f nextjs
docker compose logs -f python-ai
```

### 4.5. Local URLs

| Service | URL |
|---|---|
| Frontend | `http://localhost:3000` |
| Backend API | `http://localhost:8000/api` |
| AI docs | `http://localhost:8001/docs` |
| Soketi WebSocket | `ws://localhost:6001` |

---

## 5. Option 2: Hybrid Local Development

This mode runs PostgreSQL, Redis, Kafka, MQTT, and Soketi with Docker, while Backend, Frontend, and AI Service run directly on your machine for easier debugging.

### 5.1. Start Infrastructure Services

```bash
docker compose up -d postgres redis zookeeper kafka mosquitto soketi
```

### 5.2. Run the Backend

Terminal 1:

```bash
cd backend
composer install
cp .env.example .env
```

Update `backend/.env` according to section **3.2**. If you are using PostgreSQL from Docker Compose, use `DB_USERNAME=civictwin`.

Then run:

```bash
php artisan key:generate
php artisan migrate --seed
php artisan serve --host=127.0.0.1 --port=8000
```

On Windows PowerShell, replace `cp .env.example .env` with:

```powershell
Copy-Item .env.example .env
```

### 5.3. Run the Queue Worker

Terminal 2:

```bash
cd backend
php artisan queue:work --queue=high,default --sleep=3 --tries=3
```

### 5.4. Run the AI Service

Terminal 3:

```bash
cd ai-service
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Update `ai-service/.env` according to section **3.3**. If you are using PostgreSQL from Docker Compose, use `DB_USERNAME=civictwin`.

Then run:

```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8001
```

Windows PowerShell:

```powershell
cd ai-service
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
```

Update `ai-service/.env`, then run:

```powershell
uvicorn app.main:app --reload --host 127.0.0.1 --port 8001
```

### 5.5. Run the Frontend

Terminal 4:

```bash
cd frontend
yarn install
yarn dev
```

Open `http://localhost:3000` to view the app.

---

## 6. Option 3: Run Fully Without Docker

Use this option if PostgreSQL/PostGIS and Redis are already installed on your machine.

### 6.1. Create the PostgreSQL/PostGIS Database

Log in to PostgreSQL:

```bash
psql -U postgres
```

Run:

```sql
CREATE DATABASE civictwin;
\c civictwin
CREATE EXTENSION IF NOT EXISTS postgis;
```

Verify PostGIS:

```sql
SELECT postgis_version();
```

### 6.2. Make Sure Redis Is Running

Linux/macOS:

```bash
redis-server
```

Check Redis:

```bash
redis-cli ping
```

Expected result:

```text
PONG
```

### 6.3. Run Each Application Service

After PostgreSQL/PostGIS and Redis are ready, follow sections **5.2 -> 5.5**.

Kafka, MQTT, and Soketi are not required for the basic flow, but the full realtime/IoT flow needs them. If those services are not installed locally, some realtime or sensor-ingestion features may not work.

---

## 7. Verify the Setup

### 7.1. Frontend

Open:

```text
http://localhost:3000
```

If the page loads without API or Mapbox errors, the frontend is running.

### 7.2. Backend API

Open:

```text
http://localhost:8000/api
```

Or list Laravel routes:

```bash
cd backend
php artisan route:list
```

### 7.3. AI Service

Open Swagger UI:

```text
http://localhost:8001/docs
```

The first boot may take a little time because the AI service connects to PostGIS and loads graph/model data on startup.

### 7.4. Database Migrations

```bash
cd backend
php artisan migrate:status
```

---

## 8. Demo Account

After running:

```bash
php artisan migrate --seed
```

Try logging in with:

| Role | Email | Password |
|---|---|---|
| Admin | `admin@civictwin.local` | `password` |

If this account does not exist, check the seeders in `backend/database/seeders`.

---

## 9. Common Commands

### Docker

```bash
docker compose ps
docker compose logs -f
docker compose down
docker compose down -v
docker compose up -d --build
```

`docker compose down -v` removes volumes, including local PostgreSQL and Redis data.

### Laravel

```bash
cd backend
php artisan key:generate
php artisan migrate
php artisan migrate:fresh --seed
php artisan queue:work --queue=high,default --sleep=3 --tries=3
php artisan optimize:clear
php artisan route:list
```

### Frontend

```bash
cd frontend
yarn install
yarn dev
yarn build
yarn lint
```

### AI Service

```bash
cd ai-service
uvicorn app.main:app --reload --host 127.0.0.1 --port 8001
```

---

## 10. Troubleshooting

### Port Already in Use

Check the port:

Windows PowerShell:

```powershell
netstat -ano | findstr :3000
netstat -ano | findstr :8000
netstat -ano | findstr :8001
```

Linux/macOS:

```bash
lsof -i :3000
lsof -i :8000
lsof -i :8001
```

Stop the process using the port or run the service on a different port.

### Backend Cannot Connect to the Database

Check `backend/.env`:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=civictwin
DB_USERNAME=postgres
DB_PASSWORD=secret
```

If the backend runs inside Docker, `DB_HOST` must be `postgres`. If it runs directly on your machine, `DB_HOST` is usually `127.0.0.1`.

### AI Service Cannot Load the Graph

Check that:

- PostgreSQL is running
- Database migrations and seeders have been applied
- `ai-service/.env` contains the correct database credentials
- PostGIS has been enabled with `CREATE EXTENSION postgis`

### Frontend Cannot Call the API

Check `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

After changing `.env.local`, restart `yarn dev`.

### Python Virtual Environment Activation Fails on Windows

If PowerShell blocks script activation:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

Then run:

```powershell
.\venv\Scripts\Activate.ps1
```

### Reset Docker Database State

Only run this when you are okay with deleting local data:

```bash
docker compose down -v
docker compose up -d --build
docker exec -it civictwin-laravel php artisan migrate --seed
```

---

## 11. Recommended Startup Order

For manual or hybrid mode, the most stable startup order is:

1. PostgreSQL/PostGIS
2. Redis
3. Kafka, MQTT, and Soketi if the full realtime/IoT flow is needed
4. Laravel backend
5. Queue worker
6. AI service
7. Next.js frontend

If services cannot connect to each other, restart them in this order and inspect the logs of the failing service first.
