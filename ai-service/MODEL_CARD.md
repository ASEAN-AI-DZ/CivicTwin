# Model Card: CivicTwinAI Traffic Density Predictor

This model card details the two machine learning models used in the **CivicTwinAI** platform for short-term traffic density prediction: **TrafficLSTM** (time-series baseline) and **TrafficSTGCN** (Spatio-Temporal Graph Convolutional Network).

## Model Details

- **Developed by:** ASEAN-AI-DZ / CivicTwin team
- **Model Date:** June 2026
- **Model Type:** Deep Learning / Time-Series & Graph Neural Networks
- **Framework:** PyTorch (v2.x)
- **Task:** Short-term Traffic Density Forecasting (predicting density on all road segments/edges simultaneously)

### Architectures

#### 1. TrafficLSTM (Baseline)
- **Type:** Recurrent Neural Network (LSTM)
- **Concept:** Predicts future density for each road segment (edge) independently, relying solely on that segment's history. It does not model spatial connections or traffic propagation.
- **Layers:**
  - `LSTM` Input Layer: 1 feature (density) per timestep
  - `LSTM` Hidden Layers: 2 layers with 64 hidden units, dropout = 0.2
  - `Fully Connected (FC)` Layer 1: Linear (64 → 32) with ReLU activation and 0.2 dropout
  - `FC` Output Layer: Linear (32 → 6) with Sigmoid activation (outputs bounded in `[0.0, 1.0]`)

#### 2. TrafficSTGCN (Advanced)
- **Type:** Spatio-Temporal Graph Convolutional Network
- **Concept:** Predicts future densities across the entire road network graph simultaneously. It captures **spatial dependencies** (how congestion on one street spreads to neighboring segments) using the road network's adjacency matrix, and **temporal dependencies** (rush hours, trends) using causal 1D temporal convolutions.
- **Layers:**
  - `Linear` Input Projection: Projects 1 input feature to 64 hidden channels
  - `Spatio-Temporal Blocks (STBlocks) x3`:
    - **Spatial Convolution**: Sparse matrix multiplication `A @ H @ W` representing information passing between adjacent nodes/edges.
    - **Temporal Convolution**: 1D Causal Convolution over the time axis (kernel size = 3) per node.
    - **Residual Connection**: 1x1 convolution mapping input features to output size.
    - **Normalization & Regularization**: LayerNorm over features, Dropout (0.2).
  - `Output Block`: Conv1d (hidden → hidden) → ReLU → Dropout → Conv1d (hidden → 6) → Sigmoid activation.

## Intended Use

- **Primary Use Case:** Real-time traffic forecasting to assist urban traffic operators in detecting potential congestion propagation.
- **Integration:** The AI Service exposes `/predict` and `/simulate` endpoints. The Laravel backend calls this service upon traffic incidents to fetch predictions and push them to the WebOS/Frontend map via WebSockets.
- **Output:** Predicted vehicle density values (normalized between `0.0` and `1.0`) for 15, 30, and 60 minutes into the future.

## Training Dataset

The models are trained and benchmarked on a synthetic **30-day traffic dataset** representing a 20-node road network with 5-minute sampling intervals:
- **Total timesteps:** 8,640 steps (30 days * 288 intervals/day)
- **Total records:** 172,800 edge-level measurements (20 nodes/edges)
- **Features:** 
  - `density`: Normalized density (0 = empty, 1 = completely congested)
  - Temporal indices (hour of day, day of week) implicitly embedded via sequence history
- **Data Split:** 80% Training (first 24 days), 20% Validation (last 6 days)

## Performance & Benchmark Results

The models were evaluated using standard regression metrics:
- **Mean Absolute Error (MAE):** Average magnitude of prediction errors.
- **Root Mean Squared Error (RMSE):** Penalyzes larger errors heavily.
- **R-squared ($R^2$):** Proportion of variance in traffic density explained by the model.

Below is the comparison of evaluation metrics on the hold-out validation set:

| Model | MAE | RMSE | R² Score | Performance vs Baseline |
| :--- | :---: | :---: | :---: | :---: |
| **TrafficLSTM** (Baseline) | 0.0368 | 0.0485 | 0.8241 | Baseline |
| **TrafficSTGCN** (Proposed) | 0.0332 | 0.0438 | 0.8915 | **+9.8% MAE Reduction** |

> [!IMPORTANT]
> **ST-GCN** consistently outperforms **LSTM** because traffic is inherently network-bound. When an incident occurs on an edge, the congestion propagates along the topological adjacency of the graph. ST-GCN leverages the adjacency matrix to learn this pattern, whereas LSTM treats each road in isolation and cannot model spatial propagation.

## Limitations

- **Synthetic Data Bias:** The current model is trained on a simulated dataset that models diurnal patterns and basic incident propagation. In real-world deployment, sensors may exhibit noise, missing values, and unpredictable anomalies (e.g., weather shifts or public events).
- **Fixed Topology:** The current implementation of ST-GCN assumes a static road network layout. Changes in road topology (e.g., road closures) require rebuilding the adjacency matrix.
- **Evaluation Scope:** R-squared metrics can be sensitive to data density distributions. Performance should be continuously monitored in production.
