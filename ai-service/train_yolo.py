from ultralytics import YOLO
import os

def main():
    # 1. Định nghĩa đường dẫn file cấu hình tập dữ liệu
    # Hãy đảm bảo bạn đã tạo file data.yaml và cấu hình đúng đường dẫn thư mục train/val
    dataset_config = os.path.abspath("dataset_template.yaml")
    
    if not os.path.exists(dataset_config):
        print(f"⚠️ Không tìm thấy file cấu hình: {dataset_config}")
        print("Vui lòng tạo file cấu hình dataset trước khi chạy train.")
        return

    print("🚀 Bắt đầu tải mô hình YOLOv8 Nano làm nền tảng (pre-trained)...")
    # Chúng ta bắt đầu từ mô hình pre-trained yolov8n.pt để hội tụ nhanh hơn
    model = YOLO("yolov8n.pt")

    print(f"🏋️ Bắt đầu huấn luyện mô hình với cấu hình từ: {dataset_config}")
    # Tiến hành training
    model.train(
        data=dataset_config,   # File cấu hình dataset (.yaml)
        epochs=100,            # Số lượt train (tăng lên 150-200 nếu tập dữ liệu lớn)
        imgsz=640,             # Kích thước ảnh đầu vào của mạng neural
        batch=16,              # Kích thước lô xử lý (giảm xuống 8 hoặc 4 nếu gặp lỗi Out of Memory GPU)
        device="cpu",          # Sử dụng "cpu" mặc định. Nếu máy có card đồ họa NVIDIA + CUDA, hãy đổi thành: 0
        workers=4,             # Số tiến trình nạp dữ liệu song song
        save=True,             # Lưu các điểm kiểm soát (checkpoints) và kết quả
        project="civictwin_yolo", # Thư mục dự án lưu kết quả train
        name="traffic_detector"   # Tên phiên bản huấn luyện
    )

    print("\n✅ Quá trình huấn luyện đã hoàn tất!")
    print("Trọng số tốt nhất (best weights) của bạn đã được lưu tại:")
    print("👉 civictwin_yolo/traffic_detector/weights/best.pt")
    print("\nBạn có thể cập nhật file yolo_traffic_detector.py để chạy inference bằng file weights này.")

if __name__ == "__main__":
    main()
