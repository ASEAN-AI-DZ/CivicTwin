# AI Service — Python FastAPI

> Prediction (LSTM/GNN) + Simulation Engine

## Setup

```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
```

## API Endpoints

| Method | Path | Mô tả |
|--------|------|-------|
| GET | `/health` | Health check |
| POST | `/predict` | Dự đoán tác động sự cố |
| POST | `/simulate` | Mô phỏng kịch bản |

## Cấu trúc

```
ai-service/
├── app/
│   ├── main.py
│   ├── api/
│   │   ├── prediction.py
│   │   ├── simulation.py
│   │   └── health.py
│   ├── models/
│   │   ├── lstm_predictor.py
│   │   └── gnn_predictor.py
│   ├── services/
│   ├── schemas/
│   └── core/
├── ml/
│   ├── training/
│   ├── data/
│   └── saved_models/
├── requirements.txt
├── Dockerfile
└── docker-compose.yml
```

## Reproducing AI Metrics

To evaluate and reproduce the benchmark results comparing the **TrafficLSTM** baseline against the advanced spatial-aware **TrafficSTGCN** model:

1. **Ensure the virtual environment is activated:**
   ```bash
   # Windows (PowerShell)
   .\venv\Scripts\activate
   # Linux/macOS
   source venv/bin/activate
   ```

2. **Generate the synthetic dataset (if not already present):**
   ```bash
   python -m notebooks.generate_dataset
   ```
   *Note: This will automatically generate a 30-day traffic density dataset simulating peak/off-peak patterns across a 20-node road network.*

3. **Run the benchmarking script:**
   ```bash
   python -m notebooks.benchmark
   ```
   *This trains both models (default: 20 epochs) and evaluates them on a hold-out validation set. Model weights, configurations, and validation metrics are then saved as PyTorch checkpoints to `models/traffic_lstm.pt` and `models/traffic_stgcn.pt`.*

4. **Explore the results interactively:**
   Install Jupyter and run the benchmark notebook:
   ```bash
   pip install jupyter
   jupyter notebook notebooks/CivicTwinAI_Model_Benchmark.ipynb
   ```
   Open `CivicTwinAI_Model_Benchmark.ipynb` to visualize dataset distributions, print checkpoints configurations, run validation evaluations, and plot predicted traffic densities against ground truth.
