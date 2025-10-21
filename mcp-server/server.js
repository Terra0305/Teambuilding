#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

const BACKEND_URL = 'http://localhost:8080';
const JWT_TOKEN = process.env.JWT_TOKEN || '';

// MCP Server 생성
const server = new Server(
  {
    name: 'train-booking-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// 도구 목록 정의
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'search_trains',
        description: '출발지, 도착지, 날짜로 기차를 검색합니다. 날짜는 YYYY-MM-DD 형식이어야 합니다.',
        inputSchema: {
          type: 'object',
          properties: {
            origin: {
              type: 'string',
              description: '출발지 (예: 서울, 용산, 부산)',
            },
            destination: {
              type: 'string',
              description: '도착지 (예: 부산, 대전, 광주송정)',
            },
            date: {
              type: 'string',
              description: '날짜 (YYYY-MM-DD 형식)',
            },
          },
          required: ['origin', 'destination', 'date'],
        },
      },
      {
        name: 'book_train',
        description: '선택한 기차를 예매합니다. trainId가 필요합니다.',
        inputSchema: {
          type: 'object',
          properties: {
            trainId: {
              type: 'number',
              description: '예매할 기차의 ID',
            },
            userId: {
              type: 'number',
              description: '사용자 ID (자동 설정됨)',
            },
          },
          required: ['trainId'],
        },
      },
      {
        name: 'get_my_bookings',
        description: '현재 사용자의 예매 내역을 조회합니다.',
        inputSchema: {
          type: 'object',
          properties: {
            userId: {
              type: 'number',
              description: '사용자 ID (자동 설정됨)',
            },
          },
        },
      },
      {
        name: 'cancel_booking',
        description: '예매를 취소합니다.',
        inputSchema: {
          type: 'object',
          properties: {
            bookingId: {
              type: 'number',
              description: '취소할 예매의 ID',
            },
          },
          required: ['bookingId'],
        },
      },
    ],
  };
});

// 도구 실행 핸들러
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    console.error(`[MCP] 도구 실행: ${name}`);
    console.error(`[MCP] 인자:`, JSON.stringify(args, null, 2));

    let result;

    switch (name) {
      case 'search_trains':
        result = await searchTrains(args);
        break;
      case 'book_train':
        result = await bookTrain(args);
        break;
      case 'get_my_bookings':
        result = await getMyBookings(args);
        break;
      case 'cancel_booking':
        result = await cancelBooking(args);
        break;
      default:
        throw new Error(`알 수 없는 도구: ${name}`);
    }

    console.error(`[MCP] 결과:`, result);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    console.error(`[MCP] 오류:`, error.message);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({ error: error.message }),
        },
      ],
      isError: true,
    };
  }
});

// 기차 검색
async function searchTrains(args) {
  const { origin, destination, date } = args;
  
  const url = `${BACKEND_URL}/api/trains?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&date=${date}`;
  
  const response = await fetch(url, {
    headers: {
      'Authorization': JWT_TOKEN ? `Bearer ${JWT_TOKEN}` : '',
    },
  });

  if (!response.ok) {
    throw new Error(`기차 검색 실패: ${response.status}`);
  }

  const trains = await response.json();
  
  return {
    success: true,
    count: trains.length,
    trains: trains.slice(0, 10), // 최대 10개
  };
}

// 기차 예매
async function bookTrain(args) {
  const { trainId, userId = 1 } = args; // 기본 userId = 1 (테스트용)

  const response = await fetch(`${BACKEND_URL}/api/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': JWT_TOKEN ? `Bearer ${JWT_TOKEN}` : '',
    },
    body: JSON.stringify({
      userId,
      trainId,
    }),
  });

  if (!response.ok) {
    throw new Error(`예매 실패: ${response.status}`);
  }

  const result = await response.text();

  return {
    success: true,
    message: result,
  };
}

// 예매 내역 조회
async function getMyBookings(args) {
  const { userId = 1 } = args; // 기본 userId = 1

  const response = await fetch(`${BACKEND_URL}/api/my-bookings`, {
    headers: {
      'Authorization': JWT_TOKEN ? `Bearer ${JWT_TOKEN}` : '',
    },
  });

  if (!response.ok) {
    throw new Error(`예매 조회 실패: ${response.status}`);
  }

  const bookings = await response.json();

  return {
    success: true,
    count: bookings.length,
    bookings,
  };
}

// 예매 취소
async function cancelBooking(args) {
  const { bookingId } = args;

  const response = await fetch(`${BACKEND_URL}/api/bookings/${bookingId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': JWT_TOKEN ? `Bearer ${JWT_TOKEN}` : '',
    },
  });

  if (!response.ok) {
    throw new Error(`예매 취소 실패: ${response.status}`);
  }

  const result = await response.text();

  return {
    success: true,
    message: result,
  };
}

// 서버 시작
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('[MCP] Train Booking Server 시작됨');
}

main().catch((error) => {
  console.error('[MCP] 서버 오류:', error);
  process.exit(1);
});
