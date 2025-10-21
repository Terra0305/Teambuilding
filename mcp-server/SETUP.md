# MCP Server 설치 가이드

## 1. npm install

```bash
cd C:\Users\jpsm0\Desktop\Teambuilding\Teambuilding\mcp-server
npm install
```

## 2. Spring Boot 실행

```bash
cd backend/demo
gradlew bootRun
```

## 3. Claude Desktop 설정

파일 위치: `C:\Users\jpsm0\AppData\Roaming\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "train-booking": {
      "command": "node",
      "args": ["C:\\Users\\jpsm0\\Desktop\\Teambuilding\\Teambuilding\\mcp-server\\server.js"]
    }
  }
}
```

## 4. Claude Desktop 재시작

## 5. 테스트

"서울에서 부산 가는 기차 찾아줘"
