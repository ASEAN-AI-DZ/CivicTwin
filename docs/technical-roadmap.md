# Technical Roadmap — CivicTwin AI

> Cập nhật: 2026-05-08

---

## Current Stack

| Layer | Technology | Port |
|---|---|---|
| Frontend | Next.js | 3000 |
| Mobile | Flutter | - |
| Backend API | Laravel (PHP) | 8000 |
| AI Service | FastAPI + LSTM | 8001 |
| Database | PostgreSQL + PostGIS | 5432 |
| Cache / Queue | Redis | 6379 |
| Message Broker | Kafka + MQTT (Mosquitto) | 9092 / 1883 |
| Realtime | Soketi (Pusher protocol) | 6001 |
| Infrastructure | Docker Compose | - |

---

## Phase 1 — Foundation Hardening (Q2 2026)

### Mục tiêu
Ổn định hệ thống, đảm bảo chất lượng code và khả năng triển khai tự động.

### Tasks

| # | Task | Priority | Owner |
|---|---|---|---|
| 1.1 | Thiết lập CI/CD pipeline (GitHub Actions): lint, test, build, deploy | High | - |
| 1.2 | Unit tests cho Laravel services (TrafficAutoDetector, RecommendationGenerator) | High | - |
| 1.3 | Unit tests cho FastAPI (predict, simulate endpoints) | High | - |
| 1.4 | E2E tests với Playwright cho frontend | Medium | - |
| 1.5 | API Documentation — OpenAPI/Swagger cho Laravel + FastAPI | Medium | - |
| 1.6 | Monitoring: Prometheus + Grafana cho service metrics | Medium | - |
| 1.7 | Error tracking: Sentry integration (backend + frontend) | Medium | - |
| 1.8 | Database backup automation + migration strategy | High | - |
| 1.9 | Security audit: OWASP Top 10 review | High | - |
| 1.10 | Seed data chuẩn hóa cho development/testing | Low | - |

### Deliverables
- CI/CD pipeline chạy trên mỗi PR
- Test coverage >= 60% cho core services
- Swagger UI accessible tại `/api/docs`
- Grafana dashboard cho system health

---

## Phase 2 — AI/ML Enhancement (Q3 2026)

### Mục tiêu
Nâng cấp khả năng dự đoán và phát hiện bất thường từ heuristic sang ML-driven.

### Tasks

| # | Task | Priority | Owner |
|---|---|---|---|
| 2.1 | Upgrade traffic prediction: LSTM → Temporal Fusion Transformer (TFT) | High | - |
| 2.2 | Real-time anomaly detection pipeline qua Kafka Streams | High | - |
| 2.3 | Computer Vision: YOLO integration cho camera feed (đếm xe, phát hiện tai nạn) | Medium | - |
| 2.4 | Model versioning với MLflow — track experiments, model registry | Medium | - |
| 2.5 | Feature store: Chuẩn hóa feature engineering pipeline | Medium | - |
| 2.6 | A/B testing framework cho model comparison | Low | - |
| 2.7 | Training pipeline automation (scheduled retraining) | Medium | - |
| 2.8 | Flood prediction model (weather data + historical flooding + terrain) | High | - |

### Deliverables
- TFT model với accuracy improvement >= 15% so với LSTM hiện tại
- Anomaly detection latency < 5 giây từ sensor event → alert
- CV pipeline xử lý >= 10 camera feeds đồng thời
- MLflow dashboard tracking tất cả model versions

---

## Phase 3 — Platform Scaling (Q4 2026)

### Mục tiêu
Chuyển từ single-node Docker Compose sang hạ tầng production-grade, hỗ trợ multi-city.

### Tasks

| # | Task | Priority | Owner |
|---|---|---|---|
| 3.1 | Kubernetes migration — Helm charts cho tất cả services | High | - |
| 3.2 | API Gateway (Kong/Traefik): rate limiting, auth centralization, load balancing | High | - |
| 3.3 | Horizontal auto-scaling cho AI service (GPU node pool) | High | - |
| 3.4 | Data Lake: MinIO/S3 cho raw data + Apache Spark cho batch analytics | Medium | - |
| 3.5 | Multi-city tenant isolation: config-driven city graph loading | High | - |
| 3.6 | CDN + edge caching cho static assets và map tiles | Medium | - |
| 3.7 | Database: Read replicas + connection pooling (PgBouncer) | Medium | - |
| 3.8 | Observability upgrade: distributed tracing (OpenTelemetry) | Medium | - |
| 3.9 | Disaster recovery: multi-region backup, RTO < 4h | Low | - |

### Deliverables
- Zero-downtime deployment
- Auto-scale AI pods 1→10 based on request load
- Support >= 3 cities chạy đồng thời
- P99 API latency < 200ms

---

## Phase 4 — Advanced Features (Q1 2027)

### Mục tiêu
Nâng cao trải nghiệm người dùng với AI assistant, 3D visualization, và citizen engagement.

### Tasks

| # | Task | Priority | Owner |
|---|---|---|---|
| 4.1 | LLM-powered operator assistant (Claude API): natural language queries về traffic/incidents | High | - |
| 4.2 | 3D Digital Twin visualization với CesiumJS — render thành phố realtime | High | - |
| 4.3 | Citizen feedback NLP pipeline: auto-classify phản ánh → route to department | Medium | - |
| 4.4 | Simulation marketplace: tạo/chia sẻ scenario templates | Medium | - |
| 4.5 | Predictive maintenance alerts cho infrastructure (đèn giao thông, cảm biến) | Medium | - |
| 4.6 | Advanced routing: multi-modal (xe, bus, đi bộ) với real-time conditions | High | - |
| 4.7 | Report generation: auto tạo báo cáo tuần/tháng cho leadership | Low | - |
| 4.8 | Mobile: offline-first architecture với background sync | Medium | - |

### Deliverables
- Chat interface: operator hỏi bằng tiếng Việt, trả lời trong < 3 giây
- 3D city view với realtime traffic overlay
- >= 85% accuracy phân loại phản ánh công dân
- Mobile hoạt động offline với data sync khi có mạng

---

## Phase 5 — Enterprise & Ecosystem (Q2–Q3 2027)

### Mục tiêu
Mở rộng hệ sinh thái, đáp ứng yêu cầu enterprise và compliance.

### Tasks

| # | Task | Priority | Owner |
|---|---|---|---|
| 5.1 | Open Data API: public REST/GraphQL cho researchers & third-party devs | Medium | - |
| 5.2 | Integration hub: SCADA, hệ thống đèn giao thông, cảm biến môi trường | High | - |
| 5.3 | SSO/RBAC enterprise: SAML, LDAP integration | High | - |
| 5.4 | Compliance: ISO 27001 preparation, data residency, audit logging | High | - |
| 5.5 | SDK/Plugin system: cho phép extend platform features | Medium | - |
| 5.6 | White-label support: customizable branding per tenant | Low | - |
| 5.7 | Performance SLA monitoring + alerting | Medium | - |
| 5.8 | Documentation portal: developer docs, API reference, tutorials | Medium | - |

### Deliverables
- Public API với rate-limited access + API key management
- Kết nối >= 5 hệ thống bên ngoài (SCADA, traffic lights, weather stations)
- ISO 27001 audit-ready
- Developer portal live với SDK cho Python/JS

---

## Key Technical Decisions

| Decision | Options | Recommendation | Reason |
|---|---|---|---|
| Orchestration | Kubernetes vs Docker Swarm | **Kubernetes** | Ecosystem lớn, auto-scaling, community support |
| AI Model Serving | FastAPI vs Triton Inference Server | **Triton** (Phase 3+) | GPU optimization, model versioning, batching |
| 3D Rendering | CesiumJS vs Mapbox GL vs Unity | **CesiumJS** | Open-source, web-native, geospatial focus |
| LLM Integration | Self-host vs Claude API | **Claude API** | Giảm ops burden, multilingual (Vietnamese), chất lượng cao |
| Search/Analytics | Elasticsearch vs ClickHouse | **ClickHouse** | Time-series optimized, fast aggregation cho IoT data |
| API Style | REST vs GraphQL | **REST + GraphQL hybrid** | REST cho internal services, GraphQL cho public API |

---

## Risk & Mitigation

| Risk | Impact | Mitigation |
|---|---|---|
| GPU cost cho AI inference tăng | Budget overrun | Start with CPU inference, migrate to GPU khi cần; spot instances |
| Data privacy regulation thay đổi | Compliance violation | Design for data residency từ đầu; anonymization pipeline |
| Camera feed bandwidth | Network bottleneck | Edge computing: process tại camera, gửi metadata only |
| Single point of failure (Kafka/Postgres) | System downtime | Multi-broker Kafka cluster; Postgres HA với Patroni |
| Team scaling challenges | Delivery delays | Modular architecture; clear API contracts giữa teams |

---

## Success Metrics

| Phase | KPI | Target |
|---|---|---|
| Phase 1 | CI/CD pipeline reliability | >= 95% green builds |
| Phase 2 | Prediction accuracy (traffic density) | MAE < 0.1 |
| Phase 2 | Anomaly detection latency | < 5 seconds |
| Phase 3 | API P99 latency | < 200ms |
| Phase 3 | System uptime | >= 99.5% |
| Phase 4 | LLM response time | < 3 seconds |
| Phase 4 | Citizen report classification accuracy | >= 85% |
| Phase 5 | External integrations | >= 5 systems |
