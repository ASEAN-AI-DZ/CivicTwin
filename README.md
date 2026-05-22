# 🏙️ CivicTwin AI — Digital Twin & AI Platform cho Quản lý Đô thị Thông minh


<div align="center">
  <a href="https://civic-twin-ai-six.vercel.app/">
    <img src="https://img.shields.io/badge/🚀_Website-CivicTwin-00C853?style=for-the-badge" alt="Demo System"/>
  </a>
  <a href="https://asean-ai-dz.github.io/CivicTwinDocument/en/intro/">
    <img src="https://img.shields.io/badge/📚_Documentation-CivicTwin-1976D2?style=for-the-badge" alt="Documentation"/>
  </a>
  <br/>
  
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/License-GPL%203.0-blue.svg" alt="License: GPL-3.0"/>
  </a>
  
  <br/>
  
  <a href="CONTRIBUTING.md">🤝 Đóng Góp</a> •
  <a href="CHANGELOG.md">📜 Changelog</a>

</div>

![s](/static/banner.png)

> _"Từ phản ứng thụ động sang dự đoán chủ động — AI là cộng sự của nhà quy hoạch"_

**CivicTwin AI** là nền tảng tiên tiến tích hợp **Digital Twin (Bản sao số)** và **AI (Trí tuệ Nhân tạo)**, được thiết kế để chuyển đổi cách quản lý đô thị từ phản ứng sang dự đoán và chủ động . Hệ thống mô hình hóa toàn bộ đô thị dưới dạng đồ thị mạng động, tích hợp dữ liệu thời gian thực từ camera, cảm biến IoT, dữ liệu thời tiết và phản ánh công dân để hỗ trợ ra quyết định nhanh chóng, chính xác và bền vững.

---

## 📋 Thực trạng đô thị

### Bối cảnh

Trong bối cảnh đô thị hóa diễn ra nhanh chóng tại các thành phố lớn trên cả nước, hệ thống quản lý đô thị truyền thống đang đối mặt với nhiều thách thức nghiêm trọng.

**Thực trạng:**
- Mật độ phương tiện giao thông tăng mạnh, dẫn đến ùn tắc kéo dài trong giờ cao điểm.
- Ngập úng đô thị thường xuyên xảy ra do mưa lớn cực đoan và biến đổi khí hậu.
- Hầu hết các hệ thống hiện tại chỉ tập trung vào giám sát (monitoring) theo thời gian thực, nhưng thiếu khả năng dự đoán (prediction) và mô phỏng (simulation) các tác động của sự cố.
- Phản ứng xử lý chậm, khó điều phối giao thông tối ưu và thiếu công cụ hỗ trợ ra quyết định kịp thời cho cơ quan quản lý.

---

## 🎯 Mục tiêu Dự án

### Mục tiêu Ngắn hạn

1. **Xây dựng Digital Twin toàn diện** cho đô thị
2. **Triển khai AI dự đoán:**
   - Lưu lượng giao thông từ dữ liệu lịch sử và thời gian thực
   - Rủi ro môi trường dựa trên dữ liệu thời tiết + cảm biến IoT
3. **Hỗ trợ mô phỏng :** Cho phép chính quyền thử nghiệm các kịch bản (mở đường mới, thay đổi luồng giao thông, xây khu đô thị) trước khi triển khai thực tế
4. **Dashboard hỗ trợ ra quyết định:** Cung cấp giao diện trực quan cho chính quyền và người dân

### Mục tiêu Dài hạn

- Tích hợp sâu rộng vào hệ thống quản lý đô thị hiện có của các thành phố lớn, trở thành nền tảng cốt lõi hỗ trợ vận hành và ra quyết định thông minh theo thời gian thực.
- Mở rộng phạm vi ứng dụng sang nhiều lĩnh vực then chốt của đô thị thông minh, bao gồm: quản lý năng lượng, giám sát và bảo vệ môi trường, tối ưu hóa giao thông công cộng, quy hoạch đô thị và các dịch vụ công cộng khác.
---

## 🌐 CivicTwin AI là gì?

### Khái niệm

Hãy tưởng tượng bạn đang chơi một trò chơi mô phỏng như **SimCity**, nhưng **không phải trò chơi giả tưởng** – mà là một **"bản sao ảo" cực kỳ chính xác** của hệ thống giao thông và hạ tầng đô thị thực tế.

Với CivicTwin AI, toàn bộ mạng lưới giao thông được mô hình hóa dưới dạng **graph network** (Node = giao lộ, Edge = tuyến đường), được cập nhật liên tục từ camera, cảm biến IoT và dữ liệu thời tiết.

Khi một sự cố xảy ra, hệ thống không chỉ hiển thị tình hình hiện tại mà còn **ngay lập tức mô phỏng và dự đoán** tác động trong **15–30 phút tới**:

- Tắc nghẽn sẽ lan rộng đến những tuyến đường nào và với mức độ nghiêm trọng ra sao?
- Xe cứu thương, cứu hỏa nên đi tuyến đường ưu tiên nào để tiếp cận nhanh nhất?
- Những khu vực nào sắp bị ảnh hưởng và cần cảnh báo sớm?
- Giải pháp điều phối giao thông tối ưu là gì?

---

<!-- ## 🏗️ Kiến trúc & Công nghệ -->

## 📊 Các Đối tượng hướng đến
![s](/static/img/doituong.png)


### 👨‍💼 1. Nhà quy hoạch & Quan chức chính quyền

- Dự báo tác động của các dự án hạ tầng trước khi triển khai
- Mô phỏng kịch bản để tối ưu hóa quyết định
- Dashboard dữ liệu để ra quyết định nhanh, chính xác

### 👷 2. Kỹ sư & Chuyên gia Giao thông đô thị

- Phân tích chi tiết lưu lượng giao thông và rủi ro
- Mô phỏng hiệu quả của các biện pháp tương ứng
- Tối ưu hóa hạ tầng giao thông

### 🏛️ 3. Tổ chức cộng đồng & NGO

- Tất cả công dân có thể sử dụng công cụ để đề xuất dự án
- Minh bạch hóa tác động kinh tế-xã hội-môi trường

### 📚 4. Nhà nghiên cứu & Sinh viên

- Truy cập dữ liệu mở để nghiên cứu
- Mô hình hóa các vấn đề đô thị phức tạp

---

## 🚀 Chức năng Chính của CivicTwin AI

![s](/static/img/chucnang.png)


### 1. **Real-time Digital Twin**

- Mô hình hóa toàn bộ đô thị dưới dạng đồ thị mạng
- Cập nhật liên tục từ camera giao thông, cảm biến IoT, dữ liệu thời tiết
- Hiển thị trạng thái thực tế của từng khu vực trên bản đồ tương tác

### 2. **AI Dự đoán**

- **Dự báo lưu lượng giao thông** trong tương lai gần
- **Cảnh báo ngập úng** dựa trên dữ liệu thời tiết + cảm biến mực nước

### 3. **Dashboard Hỗ trợ Ra quyết định**

- **Impact Score:** Điểm tác động tổng hợp (0–100)
- **Radar Chart:** Trực quan 5 chỉ số (Economic, Environmental, Accessibility, Equity, Safety)

### 4. **Hỗ trợ Ưu tiên Khẩn cấp**

- Khi tai nạn/ngập lụt xảy ra, AI xác định **tuyến đường nhanh nhất** cho xe cứu thương/cứu hỏa
- **Cảnh báo lan truyền:** Dự báo ùn tắc sẽ lan sang những khu vực nào
- **Hướng dẫn sơ tán:** Khuyến nghị tuyến đường an toàn cho người dân

---

## 📚 Công nghệ Sử dụng

| Thành phần | Công nghệ cụ thể | Vai trò trong hệ thống |
|------------|-----------------|------------------------|
| **Giao diện (Frontend)** | `Leaflet.js` | Hiển thị bản đồ tương tác, vẽ các lớp phủ dữ liệu như vùng ngập, luồng giao thông và các thực thể Digital Twin. |
| **Xử lý Logic (Backend)** | `Node.js (Express)` | Đóng vai trò trung tâm điều phối API, quản lý phiên làm việc của người dùng và thực hiện các kết nối tới cơ sở dữ liệu. |
| **Trí tuệ nhân tạo (AI)** | `Amazon Bedrock` | Cung cấp hạ tầng để chạy các mô hình ngôn ngữ lớn  và mô hình dự báo, hỗ trợ phân tích kịch bản và tối ưu hóa tài nguyên đô thị. |
| **Dữ liệu nền (Database)** | `PostgreSQL + PostGIS` | Lưu trữ và xử lý các dữ liệu không gian phức tạp, thực hiện các phép toán hình học như kiểm tra giao cắt , tạo vùng đệm và tính khoảng cách. |
| **Kết nối (Real-time)** | `WebSockets` | Duy trì kết nối hai chiều liên tục, đảm bảo dữ liệu từ cảm biến IoT được cập nhật lên bản đồ theo thời gian thực. |

---

## ⚙️ Hướng dẫn Cài đặt Cơ bản

1. **Clone repository:**
   ```bash
   git clone https://github.com/ASEAN-AI-DZ/CivicTwin.git
   cd CivicTwin
   ```

2. **Khởi chạy nền tảng bằng Docker Compose:**
   ```bash
   docker compose up -d --build
   ```

> Xem thêm mục [Hướng dẫn Thiết lập Chi tiết](docs/setup.md) nếu bạn muốn chạy ở môi trường Local Development hoặc cấu hình chuyên sâu.

---

## 🎯 Kết Luận

CivicTwin AI là giải pháp **Digital Twin + AI** toàn diện cho quản lý giao thông đô thị thông minh. Hệ thống không chỉ giám sát realtime mà còn có khả năng dự đoán tác động dây chuyền của sự cố, đề xuất giải pháp tối ưu và hỗ trợ mô phỏng quy hoạch hạ tầng.

Với công nghệ hiện đại và kiến trúc scalable, CivicTwin AI mang lại giá trị thực tiễn rõ rệt: giảm ùn tắc, tăng tốc độ phản ứng khẩn cấp và hỗ trợ ra quyết định dựa trên dữ liệu.

Dự án không chỉ giải quyết vấn đề giao thông hôm nay mà còn góp phần xây dựng nền tảng cho **thành phố thông minh bền vững** tại Đà Nẵng và các đô thị Việt Nam trong tương lai.

**CivicTwin AI – Dự báo thông minh, đô thị an toàn hơn.**

---

## 📞 Liên hệ & Đóng góp

### Liên hệ Dự án

- **Lead Researcher:** [Contact Information]
- **GitHub Repository:** https://github.com/ASEAN-AI-DZ/CivicTwin
- **Documentation:** [[Documentation](https://asean-ai-dz.github.io/CivicTwinDocument/en/intro/)]

### Cách Đóng góp

- Fork repository → tạo feature branch → mở Pull Request
- Báo lỗi: Tạo GitHub Issue với mô tả chi tiết, steps to reproduce
- Đề xuất tính năng mới: Tham gia discussions

---

## 📄 Giấy phép

Dự án này được phân phối dưới **GNU General Public License v3.0**. Xem file [LICENSE](LICENSE) để biết thêm chi tiết.

---

_**Được phát triển với ❤️ để hướng tới thành phố thông minh, bền vững**_

_"Công nghệ phục vụ con người, giảm thiểu rủi ro khí hậu, và nâng cao chất lượng sống."_
