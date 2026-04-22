# CivicTwinAI - Tong Hop Services

Tai lieu nay tong hop cac service dang co trong du an, bao gom service runtime (Docker), service backend/AI, va cac service module o client.

## 1. Runtime Services (docker-compose.yml)

| Service | Container | Port | Vai tro chinh | Phu thuoc |
|---|---|---|---|---|
| `laravel` | `civictwin-laravel` | `8000` | API chinh (REST, auth, incident, map, notification), broadcast event | `postgres`, `redis`, `kafka`, `python-ai`, `soketi` |
| `laravel-worker` | `civictwin-worker` | - | Xu ly queue (`php artisan queue:work`) cho cac job nen | `laravel` |
| `python-ai` | `civictwin-ai` | `8001` | AI prediction/simulation (FastAPI) | `postgres` |
| `nextjs` | `civictwin-frontend` | `3000` | Giao dien web operator/admin/citizen | `laravel`, `soketi` |
| `postgres` | `civictwin-postgres` | `5432` | CSDL chinh (PostgreSQL + PostGIS) | - |
| `redis` | `civictwin-redis` | `6379` | Cache + queue backend | - |
| `zookeeper` | `civictwin-zookeeper` | `2181` (internal) | Dieu phoi broker Kafka | - |
| `kafka` | `civictwin-kafka` | `9092` | Message broker ingest du lieu IoT/telemetry | `zookeeper` |
| `mosquitto` | `civictwin-mqtt` | `1883` | MQTT broker nhan du lieu sensor | - |
| `soketi` | `civictwin-soketi` | `6001` | WebSocket server theo Pusher protocol (realtime) | - |

## 2. Backend Domain Services (Laravel)

Thu muc: `backend/app/Services`

| Service | File | Chuc nang |
|---|---|---|
| `TrafficAutoDetector` | `backend/app/Services/TrafficAutoDetector.php` | Xu ly cap nhat traffic edge tu sensor, tinh density/flow/congestion, auto tao incident khi bat thuong va dispatch event/job AI |
| `RecommendationGenerator` | `backend/app/Services/RecommendationGenerator.php` | Sinh recommendation tu ket qua prediction theo muc do su co (`reroute`, `priority_route`, `alert`) |
| `FcmPushService` | `backend/app/Services/FcmPushService.php` | Gui push notification qua Firebase FCM, log trang thai gui/that bai |

## 3. AI Services (FastAPI)

Thu muc: `ai-service/app/services`

| Service | File | Chuc nang |
|---|---|---|
| `ModelService` | `ai-service/app/services/model_service.py` | Singleton load mo hinh LSTM (neu co), cung cap `predict_density`, fallback khi model chua san sang |
| `GraphService` | `ai-service/app/services/graph_service.py` | Load do thi giao thong tu DB, du doan cascading impact bang BFS heuristic, mo phong what-if scenario |

API AI lien quan:
- `POST /predict` (`ai-service/app/routers/predict.py`): du doan lan truyen anh huong su co va tra recommendations co ban.
- `POST /simulate` (`ai-service/app/routers/simulate.py`): mo phong kich ban tac dong den mat do giao thong.
- `GET /model-info`: thong tin model dang su dung.

## 4. Client Service Modules

### 4.1 Web (Next.js)

| Module | File | Vai tro |
|---|---|---|
| API client | `frontend/src/lib/api.ts` | Axios instance, gan auth token, locale header, xu ly response/error tap trung |
| Realtime client | `frontend/src/lib/echo.ts` | Khoi tao Laravel Echo + Pusher protocol de nhan event realtime |
| Auth context service | `frontend/src/lib/auth.tsx` | Quan ly dang nhap/dang xuat va nguoi dung hien tai phia web |

### 4.2 Mobile (React Native)

Thu muc: `mobile/src/services`

| Service | Chuc nang chinh |
|---|---|
| `authService.ts` | Dang nhap, dang ky, logout, profile, doi/reset password, refresh token, dong bo FCM token |
| `reportService.ts` | CRUD report, danh gia/binh chon, comment, thong ke report |
| `incidentService.ts` | Lay danh sach/chi tiet incident, tao incident, cap nhat trang thai incident |
| `mapService.ts` | Lay map reports/heatmap/clusters/routes, reverse geocode (backend -> Mapbox -> Nominatim) |
| `mediaService.ts` | Upload media multipart, lay/xoa media |
| `notificationService.ts` | Lay notification, unread count, mark read, xoa, cap nhat settings |
| `NotificationTokenService.ts` | Quan ly FCM token local va dong bo token voi backend sau login |
| `websocket.ts` | Quan ly ket noi Echo/Reverb, subscribe/listen channel realtime |
| `aiService.ts` | Goi AI endpoints backend (`/ai/parse-report`, `/ai/analyze-image`) |
| `AlertService.tsx` | Service UI cho custom alert (khong phai API service) |

## 5. Luong Ket Noi Chinh Giua Cac Service

1. Sensor/IoT -> `mosquitto` (MQTT) -> `kafka` -> `laravel`.
2. `laravel` cap nhat DB (`postgres`), cache/queue (`redis`), broadcast realtime qua `soketi`.
3. Khi co incident: `laravel`/`laravel-worker` goi `python-ai` de prediction/simulation.
4. `nextjs` va mobile nhan du lieu qua REST API (`laravel`) + WebSocket (`soketi`).
5. Notification push duoc gui qua `FcmPushService` -> Firebase FCM.

