# 🏙️ CivicTwin AI — Digital Twin & AI Platform for Smart Urban Management

<div align="center">
  <a href="https://civic-twin-ai-six.vercel.app/">
    <img src="https://img.shields.io/badge/🚀_Website-CivicTwin-00C853?style=for-the-badge" alt="Demo System"/>
  </a>
  <a href="https://asean-ai-dz.github.io/CivicTwinDocument/en/intro/">
    <img src="https://img.shields.io/badge/📚_Documentation-CivicTwin-1976D2?style=for-the-badge" alt="Documentation"/>
  </a>
  <a href="https://www.youtube.com/watch?v=iQEpdDFsiYw">
    <img src="https://img.shields.io/badge/🎥_Demo-CivicTwin-EB907C?style=for-the-badge" alt="Demo"/>
  </a>
  <br/>
  
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/License-GPL%203.0-blue.svg" alt="License: GPL-3.0"/>
  </a>
  
  <br/>
  
  <a href="CONTRIBUTING.md">🤝 Contributing</a> •
  <a href="CHANGELOG.md">📜 Changelog</a>

</div>

![s](/static/banner.png)

> _"From passive response to active prediction — AI is the urban planner's co-pilot"_

**CivicTwin AI** is an advanced platform integrating **Digital Twin** and **AI (Artificial Intelligence)**, designed to transform urban management from reactive to predictive and proactive. The system models the entire city as a dynamic network graph, integrating real-time data from cameras, IoT sensors, weather data, and citizen reports to support fast, accurate, and sustainable decision-making.

---

## 📋 Urban Status Quo

### Context

With rapid urbanization in major cities across the country, traditional urban management systems are facing several critical challenges.

**Current Reality:**
- Traffic vehicle density is growing rapidly, leading to prolonged congestion during peak hours.
- Urban flooding occurs frequently due to extreme heavy rainfall and climate change.
- Most existing systems focus solely on real-time monitoring, lacking predictive and simulation capabilities for incident impacts.
- Slow response times, difficult optimal traffic routing, and a lack of timely decision-support tools for management authorities.

---

## 🎯 Project Goals

### Short-term Goals

1. **Build a comprehensive Digital Twin** for the city.
2. **Deploy predictive AI for:**
   - Traffic flow from historical and real-time data.
   - Environmental risks based on weather data + IoT sensors.
3. **Support simulation:** Allow authorities to test what-if scenarios (opening new roads, changing traffic flows, constructing urban zones) before actual implementation.
4. **Decision-support dashboard:** Provide an intuitive interface for both authorities and citizens.

### Long-term Goals

- Deeply integrate into the existing urban management systems of major cities, becoming the core platform for real-time operation and smart decision-making.
- Expand the application scope to several key areas of smart cities, including: energy management, environmental monitoring and protection, public transit optimization, urban planning, and other public services.

---

## 🌐 What is CivicTwin AI?

### Concept

Imagine playing a simulation game like **SimCity**, but **not a fantasy game** – rather a **highly accurate "virtual copy"** of the actual traffic and urban infrastructure system.

With CivicTwin AI, the entire traffic network is modeled as a **graph network** (Node = intersection, Edge = road segment), continuously updated from cameras, IoT sensors, and weather data.

When an incident occurs, the system not only displays the current situation but also **immediately simulates and predicts** the impact over the next **15–30 minutes**:

- Which roads will the congestion spread to, and at what severity level?
- Which priority route should ambulances or fire engines take for the fastest access?
- Which areas are about to be affected and require early warnings?
- What is the optimal traffic coordination solution?

---

## 📊 Target Audience

![s](/static/img/doituong.png)

### 👨‍💼 1. Urban Planners & Government Officials

- Forecast the impact of infrastructure projects before deployment.
- Simulate scenarios to optimize decisions.
- Data dashboards for fast, accurate decision-making.

### 👷 2. Engineers & Urban Traffic Specialists

- Detailed analysis of traffic flow and risks.
- Simulate the effectiveness of corresponding measures.
- Optimize traffic infrastructure.

### 🏛️ 3. Community Organizations & NGOs

- All citizens can use the tool to propose projects.
- Transparent representation of socio-economic-environmental impacts.

### 📚 4. Researchers & Students

- Access open data for research.
- Model complex urban issues.

---

## 🚀 Key Features of CivicTwin AI

![s](/static/img/chucnang.png)

### 1. **Real-time Digital Twin**

- Models the entire city as a network graph.
- Continuous updates from traffic cameras, IoT sensors, and weather data.
- Displays the real-time status of each area on an interactive map.

### 2. **Predictive AI**

- **Predict future traffic flow** in the short term.
- **Flooding warning** based on weather data + water level sensors.

### 3. **Decision-Support Dashboard**

- **Impact Score:** Consolidated impact score (0–100).
- **Radar Chart:** Visualization of 5 metrics (Economic, Environmental, Accessibility, Equity, Safety).

### 4. **Emergency Priority Support**

- When an accident/flooding occurs, the AI identifies the **fastest route** for ambulances/fire engines.
- **Congestion cascading warning:** Forecast which areas the traffic congestion will propagate to.
- **Evacuation guidance:** Recommend safe routes for citizens.

---

## 📚 Technologies Used

| Component | Technology | Role in System |
|------------|-----------------|------------------------|
| **User Interface (Frontend)** | `Leaflet.js` | Displays interactive maps, overlays data layers such as flooded zones, traffic flows, and Digital Twin entities. |
| **Logic Processing (Backend)** | `Node.js (Express)` | Serves as the central API coordinator, manages user sessions, and establishes connections to the databases. |
| **Artificial Intelligence (AI)** | `Amazon Bedrock` | Provides infrastructure to run large language models and prediction models, supporting scenario analysis and urban resource optimization. |
| **Core Database (Database)** | `PostgreSQL + PostGIS` | Stores and processes complex spatial data, performing geometric operations such as intersection tests, buffering, and distance calculations. |
| **Connection (Real-time)** | `WebSockets` | Maintains constant two-way connection, ensuring IoT sensor data is updated on the map in real-time. |

---

## 🏗️ System Architecture

![System Architecture](/static/img/Architecture.png)

CivicTwin AI is organized as a modular, service-oriented platform where data ingestion, urban intelligence, realtime delivery, and user-facing applications can evolve independently while sharing the same city Digital Twin foundation.

### Core Layers

| Layer | Main Components | Responsibility |
|-------|-----------------|----------------|
| **Client Layer** | `Next.js Web App`, `React Native Mobile App` | Provides dashboards, interactive maps, citizen reporting, emergency views, and realtime alerts. |
| **API & Orchestration Layer** | `Laravel Backend API`, `Queue Worker` | Handles authentication, role-based workflows, map/incident APIs, notifications, event dispatching, and coordination between services. |
| **AI & Simulation Layer** | `Python FastAPI AI Service`, `LSTM/ST-GCN/YOLO models` | Runs traffic prediction, cascading impact analysis, what-if simulation, and traffic detection from video or sensor streams. |
| **Data Layer** | `PostgreSQL + PostGIS`, `Redis` | Stores users, incidents, spatial road-network data, sensor readings, cached states, and queue workloads. |
| **Messaging & Realtime Layer** | `MQTT`, `Kafka`, `Soketi WebSocket` | Ingests IoT telemetry, streams events between services, and pushes realtime updates to web/mobile clients. |
| **External Services** | `Mapbox`, `Firebase FCM`, weather/IoT providers | Supplies base maps, geocoding/routing context, push notifications, and environmental data inputs. |

### Main Data Flow

1. **Sensors, cameras, weather sources, and citizen reports** send raw urban signals into the platform through MQTT/Kafka, REST APIs, or mobile submissions.
2. **Laravel Backend** validates and normalizes the data, updates PostgreSQL/PostGIS, triggers background jobs, and broadcasts important state changes.
3. **Python AI Service** receives incident, traffic, and graph data to predict congestion spread, simulate planning scenarios, and generate decision-support outputs.
4. **Redis and queue workers** keep heavy processing asynchronous so realtime monitoring remains responsive.
5. **Soketi WebSocket** delivers live map updates, incident changes, alerts, and recommendations to the web dashboard and mobile clients.
6. **Operators, citizens, and emergency teams** interact with the same Digital Twin through role-specific interfaces, enabling coordinated monitoring, response, and planning.

---

## ⚙️ Basic Setup Guide

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ASEAN-AI-DZ/CivicTwin.git
   cd CivicTwin
   ```

2. **Launch the platform using Docker Compose:**
   ```bash
   docker compose up -d --build
   ```

> Refer to the [Detailed Setup Guide](docs/setup.md) for local development or advanced configuration.

---

## 🎯 Conclusion

CivicTwin AI is a comprehensive **Digital Twin + AI** solution for smart urban traffic management. The system not only monitors in real-time but is also capable of predicting the cascading impact of incidents, proposing optimal solutions, and supporting infrastructure planning simulation.

With modern technology and a scalable architecture, CivicTwin AI delivers clear practical value: reducing congestion, speeding up emergency response, and enabling data-driven decision-making.

The project not only addresses today's traffic problems but also contributes to building a foundation for **sustainable smart cities** in Da Nang and other Vietnamese urban centers in the future.

**CivicTwin AI – Smart prediction, safer cities.**

---

## 📞 Contact & Contributing

### Project Contact

- **Lead Researcher:** [Contact Information]
- **GitHub Repository:** https://github.com/ASEAN-AI-DZ/CivicTwin
- **Documentation:** [[Documentation](https://asean-ai-dz.github.io/CivicTwinDocument/en/intro/)]

### How to Contribute

- Fork repository → create feature branch → open Pull Request.
- Report bugs: Create a GitHub Issue with a detailed description and steps to reproduce.
- Suggest new features: Participate in discussions.

---

## 📄 License

This project is distributed under the **GNU General Public License v3.0**. See the [LICENSE](LICENSE) file for more details.

---

_**Developed with ❤️ for smart, sustainable cities**_

_"Technology serving people, mitigating climate risks, and improving the quality of life."_
