# Train Booking Service (손에딱)

음성 인식 기반의 대화형 기차 예매 서비스입니다.
복잡한 UI 조작 없이 음성 명령만으로 기차 예매부터 결제까지 가능한 웹 플랫폼입니다.

## Team
👑 Leader
박성민
[https://github.com/Terra0305]


🖥️ Frontend
조계율
[https://github.com/gyeyul]

🔩 Backend
문우주
[https://github.com/MOONSpace1017]
손주영
[https://github.com/gewon823]


## Tech Stack

### Backend
- Spring Boot 3.5.4
- Java 21
- PostgreSQL / H2
- Spring Security, JWT
- Google Gemini 1.5/2.0 Flash (Function Calling)
- Google Cloud Speech-to-Text V2

### Frontend
- React 18
- Custom CSS
- Webpack (CRA)

### Infrastructure
- Gradle (Multi-module build)
- Git / GitHub

## Key Features

1. 음성 예매 (Voice Booking)
   - 앱 진입부터 결제까지 음성 명령으로 제어
   - Google STT를 활용한 고정밀 음성 인식

2. 챗봇 (Interactive Chatbot)
   - Gemini LLM 기반의 자연어 의도 파악
   - 대화형으로 예매 정보 수집 및 누락 정보 재요청

3. 통합 환경
   - Spring Boot가 React 정적 파일을 서빙하는 하이브리드 구조
   - 별도의 프론트엔드 서버 없이 단일 JAR 배포 가능

## Getting Started

### Prerequisites
- Java 21+
- Node.js 18+

### Setup

1. Repository Clone
   ```bash
   git clone https://github.com/Terra0305/Teambuilding.git
   ```

2. Configuration
   `backend/demo/src/main/resources/application-secret.properties` 생성:
   ```properties
   spring.ai.gemini.api-key=YOUR_KEY
   google.cloud.credentials=YOUR_JSON
   ```

3. Run
   ```bash
   cd backend/demo
   server: http://localhost:8080
   client: http://localhost:8080



## Project Structure

- backend/demo: Spring Boot 메인 서버
- frontend/my-react-app: React 클라이언트
- mcp-server: Model Context Protocol (Optional)
