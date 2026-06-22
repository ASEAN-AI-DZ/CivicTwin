import os
import sys

def check_dependencies():
    """
    Check if ultralytics is installed. If not, install it.
    This is extremely helpful for running directly on Google Colab.
    """
    try:
        import ultralytics
        print(f"✅ Ultralytics version {ultralytics.__version__} is already installed.")
    except ImportError:
        print("📦 Installing ultralytics library...")
        import subprocess
        subprocess.check_call([sys.executable, "-m", "pip", "install", "ultralytics"])
        print("✅ Ultralytics installed successfully!")

def main():
    # 1. Ensure we are in a Colab environment and dependencies are satisfied
    check_dependencies()
    from ultralytics import YOLO

    # 2. Select execution device (use GPU if available in Colab, otherwise CPU)
    import torch
    device = "0" if torch.cuda.is_available() else "cpu"
    print(f"💻 Using device: {'GPU (CUDA)' if device == '0' else 'CPU'}")

    # 3. Choose dataset configuration
    # By default, we use 'coco8.yaml' which contains sample traffic images (cars, motorcycles, buses, trucks)
    # to test the training pipeline quickly without manual setup.
    # To train on your custom dataset, change this path to your custom dataset.yaml file.
    dataset_path = "coco8.yaml" 
    
    print(f"📝 Dataset config selected: {dataset_path}")
    print("🚀 Loading pre-trained YOLOv8 Nano model weights...")
    # Loading pre-trained weights ensures faster convergence
    model = YOLO("yolov8n.pt")

    # 4. Start the training process
    epochs = 10  # Low number for a quick test run. Increase to 50-100 for actual training.
    batch_size = 16
    img_size = 640

    print(f"🏋️ Starting YOLOv8 training on {dataset_path} for {epochs} epochs...")
    results = model.train(
        data=dataset_path,
        epochs=epochs,
        imgsz=img_size,
        batch=batch_size,
        device=device,
        project="civictwin_yolo_colab",
        name="traffic_detector",
        save=True
    )

    print("\n🎉 Training completed successfully!")
    
    # 5. Locate best weights
    best_weights_path = os.path.abspath(os.path.join("civictwin_yolo_colab", "traffic_detector", "weights", "best.pt"))
    if os.path.exists(best_weights_path):
        print(f"👉 Best weights saved at: {best_weights_path}")
        print("\n📥 NEXT STEPS FOR GOOGLE COLAB USER:")
        print("1. Download the file 'best.pt' from the file explorer on the left of Colab.")
        print("2. Put it in your local 'ai-service/' folder.")
        print("3. Update your 'yolo_traffic_detector.py' to use 'best.pt' instead of 'yolov8n.pt'.")
    else:
        print("⚠️ Warning: Best weights file could not be located in standard directory.")

if __name__ == "__main__":
    main()
