import cv2
import time
import requests
import json
from ultralytics import YOLO

# 1. Cấu hình
VIDEO_PATH = "traffic_video.mp4"  # Thay bằng đường dẫn video của bạn
MODEL_PATH = "best.pt"         # YOLOv8 Nano pre-trained trên tập dữ liệu COCO
API_URL = "http://127.0.0.1:8000/api/sensor-data"  # Endpoint nhận dữ liệu cảm biến
EDGE_ID = 3  # ID đoạn đường (Cầu Rồng trong seeder)
BEARER_TOKEN = "your_access_token_here"  # Token xác thực (nếu API yêu cầu auth)

def send_traffic_data(vehicle_count, avg_speed):
    """
    Gửi dữ liệu nhận diện được lên Laravel Backend API.
    """
    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": f"Bearer {BEARER_TOKEN}"
    }
    payload = {
        "edge_id": EDGE_ID,
        "vehicle_count": vehicle_count,
        "avg_speed_kmh": avg_speed,
        "occupancy_pct": min(100.0, vehicle_count * 4.5)  # Giả lập % chiếm dụng đường
    }
    
    try:
        response = requests.post(API_URL, json=payload, headers=headers, timeout=5)
        if response.status_code == 200:
            print(f"✅ Gửi API thành công: {payload}")
        else:
            print(f"❌ Gửi API thất bại ({response.status_code}): {response.text}")
    except Exception as e:
        print(f"⚠️ Không thể kết nối tới Backend API: {e}")

def main():
    # 2. Khởi tạo mô hình YOLO và luồng video
    print("Loading YOLOv8 model...")
    model = YOLO(MODEL_PATH)
    
    cap = cv2.VideoCapture(VIDEO_PATH)
    if not cap.isOpened():
        print(f"❌ Không thể mở video: {VIDEO_PATH}")
        return
    
    print(f"🎬 Bắt đầu xử lý video: {VIDEO_PATH}")
    
    # Mã lớp COCO cho phương tiện giao thông
    # 2: car, 3: motorcycle, 5: bus, 7: truck
    vehicle_classes = [2, 3, 5, 7]
    
    last_api_send = time.time()
    send_interval = 5.0  # Gửi dữ liệu lên API mỗi 5 giây
    
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            print("🏁 Kết thúc video.")
            break
            
        # 3. Chạy suy diễn YOLO
        # conf=0.35 lọc bớt vật thể có độ tự tin thấp
        results = model(frame, conf=0.35, verbose=False)
        
        vehicle_count = 0
        
        # Lấy kết quả bounding boxes
        for result in results:
            boxes = result.boxes
            for box in boxes:
                cls_id = int(box.cls[0])
                if cls_id in vehicle_classes:
                    vehicle_count += 1
                    
                    # Vẽ bounding box lên frame
                    x1, y1, x2, y2 = map(int, box.xyxy[0])
                    conf = float(box.conf[0])
                    
                    label = f"{model.names[cls_id]} {conf:.2f}"
                    color = (0, 255, 255) if cls_id == 2 else (0, 255, 0) # Vàng cho Car, Xanh lá cho xe khác
                    
                    cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
                    cv2.putText(frame, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)
        
        # Hiển thị số lượng xe hiện tại lên góc video
        cv2.putText(frame, f"Vehicles Count: {vehicle_count}", (20, 40), 
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
        
        # 4. Gửi dữ liệu định kỳ mỗi N giây
        current_time = time.time()
        if current_time - last_api_send >= send_interval:
            # Ước lượng tốc độ trung bình giả lập dựa trên mật độ xe (xe đông thì đi chậm)
            estimated_speed = max(15.0, 50.0 - vehicle_count * 2.0)
            send_traffic_data(vehicle_count, round(estimated_speed, 2))
            last_api_send = current_time
            
        # 5. Render video lên cửa sổ
        cv2.imshow("CivicTwinAI - Live Traffic Detection", frame)
        
        # Nhấn 'q' để thoát sớm
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
            
    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()
