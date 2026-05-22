# Hướng Dẫn Cài Đặt (Setup Guide) - CivicTwinAI

Tài liệu này cung cấp các bước từ cơ bản đến chi tiết để thiết lập, cài đặt và chạy hệ thống CivicTwinAI trên môi trường máy tính của bạn (Local Development).

---

## 📌 1. Yêu cầu Hệ thống (Prerequisites)

Để chạy được dự án, máy của bạn nên cài đặt các phần mềm sau:

- **Git**: Để clone repository.
- **Docker & Docker Compose**: (Khuyên dùng nhất) Để đóng gói và chạy tất cả dịch vụ qua container.
- **Node.js (v18+) & Yarn**: Nếu muốn chạy hoặc build Frontend (Next.js).
- **PHP 8.2+ & Composer**: Nếu bạn muốn đóng góp code cho Backend (Laravel).
- **Python 3.9+ & pip**: Dành cho AI Service và Simulator.
- **Mapbox Token**: Một khóa API hợp lệ lấy tại [mapbox.com](https://www.mapbox.com) dành cho hiển thị bản đồ ở Frontend.

---

## 📥 2. Mã nguồn và Biến môi trường

Đầu tiên, tải mã nguồn về máy:

```bash
git clone https://github.com/ASEAN-AI-DZ/CivicTwin.git
cd CivicTwin
```

Bạn cần tạo file `.env` tại root folder dự án dựa trên file mẫu:

```bash
cp .env.example .env
```

Mở tệp `.env` vừa được tạo và điền Mapbox Token của bạn vào:

```env
MAPBOX_TOKEN=pk.diendien_token_cua_ban_vao_day
```

---

## 🐳 3. Cài đặt bằng Docker Compose (Khuyên dùng nhất)

Đây là cách dễ dàng và đồng bộ hóa nhất để khởi chạy Frontend, Backend API, WebSocket, AI Services và các loại Database.

### 3.1. Build và Start tất cả các dịch vụ:
```bash
docker compose up -d --build
```
> **Lưu ý:** Lần đầu tiên chạy có thể mất từ 5-10 phút để tải xuống các images và build NextJS/Laravel containers.

### 3.2. Cấu trúc Database (Migrate & Seed):
Dữ liệu Postgres là trống trong lần đầu tiên, tiến hành tạo bảng và dump dữ liệu mẫu:
```bash
docker exec -it civictwin-laravel php artisan migrate --seed
```

### 3.3. Các cổng dịch vụ được mở lộ ra ngoài
Sau khi Docker khởi chạy xong, bạn có thể truy cập hệ thống theo các địa chỉ dưới đây:

| Tên Dịch Vụ | URL Localhost | Chức Năng |
| :--- | :--- | :--- |
| **Frontend Dashboard** | `http://localhost:3000` | Trang web dành cho công dân và chính quyền. |
| **Backend API (Laravel)** | `http://localhost:8000/api` | Các endpoints quản lý dữ liệu toàn hệ thống. |
| **AI Service (FastAPI)** | `http://localhost:8001/docs` | Engine trí tuệ nhân tạo và dự đoán. |
| **WebSocket** | `ws://localhost:6001` | Socket engine Soketi cho trao đổi dữ liệu Real-time. |

---

## 💻 4. Môi trường phát triển Local (Manual Dev Mode)

Nếu bạn không muốn chạy tất cả bằng Docker mà muốn chạy trực tiếp để dễ dàng phát triển hay debug, hãy làm theo các bước sau.

**(Bắt buộc)** Chạy hạ tầng nền bao gồm PostgreSQL, Redis, Kafka bằng docker trước:
```bash
docker compose up -d postgres redis kafka zookeeper mosquitto soketi
```

### Cách tự động với Script điều phối (`dev.sh`)
CivicTwinAI hỗ trợ script tự khởi tạo tất cả các môi trường trong các tab terminal khác nhau trên macOS/Linux.
```bash
chmod +x dev.sh
./dev.sh
```

### Cách chạy thủ công từng module 
Nếu không dùng script `dev.sh`, bạn cần vào cấu hình từng module một bằng 3 cửa sổ terminal riêng biệt:

**Terminal 1: Cài đặt Backend (Laravel)**
```bash
cd backend
composer install
cp .env.example .env 
php artisan key:generate
php artisan migrate --seed
php artisan serve 
```
*(Tiến trình backend sẽ lắng nghe ở port `8000`)*

**Terminal 2: Cài đặt Frontend (Next.js)**
```bash
cd frontend
yarn install
# Đảm bảo bạn khai báo Next env trong .env.local nếu cần
# NEXT_PUBLIC_API_URL=http://localhost:8000/api
# NEXT_PUBLIC_MAPBOX_TOKEN=pk.token_mapbox
yarn dev 
```
*(Tiến trình Next.js sẽ lắng nghe ở port `3000`)*

**Terminal 3: Cài đặt AI Service (Python)**
```bash
cd ai-service
python -m venv venv
# Tuỳ HĐH, Windows: venv\Scripts\activate, Linux/Mac: source venv/bin/activate
source venv/bin/activate 
pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
```
*(Tiến trình FastAPI sẽ lắng nghe ở port `8001`)*

---

## 🔐 5. Tài khoản Đăng nhập Demo

Sau khi ứng dụng chạy xong và đã thực thi `php artisan migrate --seed`, bạn có thể đăng nhập vào hệ thống dưới quyền Admin với thông tin sau:

- **Tài khoản**: `admin@civictwin.local`
- **Mật khẩu**: `password`

---

## 🧹 Xử lý Sự cố & Dọn dẹp

Nếu bạn gặp phải bất cứ lỗi xung đột hay muốn reset toàn bộ trạng thái database của hệ thống về ban đầu:

```bash
# Tắt hết tất cả Docker container và xoá volumes (Dữ liệu database cũng sẽ bị clear)
docker compose down -v

# Rồi chạy lên và seed lại dữ liệu
docker compose up -d
docker exec -it civictwin-laravel php artisan migrate --seed
```
