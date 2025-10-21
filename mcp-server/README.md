# Train Booking MCP Server

기차 예매 시스템을 위한 Model Context Protocol (MCP) 서버입니다.

## 설치 방법

```bash
cd mcp-server
npm install
```

## 실행 방법

### 1. Spring Boot 백엔드 먼저 실행
```bash
cd backend/demo
./gradlew bootRun
```

### 2. MCP Server 실행 (테스트용)
```bash
cd mcp-server
npm start
```

## Claude Desktop 연동

### Windows 설정 파일 위치
`C:\Users\jpsm0\AppData\Roaming\Claude\claude_desktop_config.json`

### 설정 내용 추가
```json
{
  "mcpServers": {
    "train-booking": {
      "command": "node",
      "args": [
        "C:\\Users\\jpsm0\\Desktop\\Teambuilding\\Teambuilding\\mcp-server\\server.js"
      ],
      "env": {
        "JWT_TOKEN": "your_jwt_token_here"
      }
    }
  }
}
```

**중요**: 경로는 절대 경로로, 백슬래시(`\`)를 이중으로(`\\`) 써야 합니다!

## Claude Desktop에서 사용하기

1. **Claude Desktop 재시작**
2. 새 대화 시작
3. 다음과 같이 질문:

```
"서울에서 부산 가는 기차 찾아줘"
"내일 오전 10시에 용산에서 광주 가는 기차 있어?"
"기차 1번으로 예매해줘"
"내 예매 내역 보여줘"
```

## 도구 목록

- **search_trains**: 기차 검색
- **book_train**: 기차 예매
- **get_my_bookings**: 예매 내역 조회
- **cancel_booking**: 예매 취소

## 문제 해결

### MCP 서버가 안 보일 때
1. Claude Desktop 완전히 종료 (작업 관리자에서 확인)
2. 설정 파일 경로 확인
3. Claude Desktop 재시작

### 백엔드 연결 오류
1. Spring Boot가 8080 포트에서 실행 중인지 확인
2. `http://localhost:8080/api/trains/search` 브라우저에서 직접 테스트

### 로그 확인
MCP Server는 stderr로 로그 출력 (Claude Desktop 로그 확인)

## 테스트용 더미 데이터

Spring Boot 시작 시 자동으로 생성됨:
- 사용자: testuser / password123
- 기차: 서울↔부산, 용산↔광주송정 등 여러 노선

## 주의사항

- JWT_TOKEN은 실제 로그인 후 발급된 토큰 사용
- 테스트용으로는 userId=1 고정 사용 중
- 실제 서비스에선 인증 강화 필요
