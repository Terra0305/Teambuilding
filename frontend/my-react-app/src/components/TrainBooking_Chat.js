// src/components/TrainBooking_Chat.js
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import logo from '../logo.png';

const styles = {
  body: {
    margin: 0,
    padding: 0,
    fontFamily: 'Noto Sans KR, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: '100vh',
    position: 'relative',
    backgroundColor: '#f8f8f8',
  },
  logoutButton: {
    position: 'absolute',
    top: '20px',
    right: '30px',
    padding: '16px 32px',
    fontSize: '28px',
    fontWeight: 'bold',
    backgroundColor: '#333',
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginTop: '60px',
    marginBottom: '20px',
  },
  titleImg: {
    width: '90px',
    height: '90px',
  },
  h1: {
    fontSize: '70px',
    fontWeight: 900,
    color: '#333',
    textAlign: 'center',
    margin: 0,
  },
  chatBox: {
    flex: 1,
    width: '90%',
    maxWidth: '900px',
    backgroundColor: 'white',
    borderRadius: '20px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
    padding: '20px',
    overflowY: 'auto',
    marginBottom: '20px',
  },
  messageContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#0ACF83',
    color: 'white',
    padding: '14px 20px',
    borderRadius: '20px',
    maxWidth: '70%',
    wordWrap: 'break-word',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#e0e0e0',
    color: '#333',
    padding: '14px 20px',
    borderRadius: '20px',
    maxWidth: '70%',
    wordWrap: 'break-word',
  },
  inputArea: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    maxWidth: '900px',
    marginBottom: '30px',
    gap: '10px',
  },
  smallButton: {
    padding: '16px 30px',
    fontSize: '20px',
    fontWeight: 'bold',
    borderRadius: '20px',
    border: 'none',
    cursor: 'pointer',
    color: 'white',
    height: '100%',
    whiteSpace: 'nowrap',
  },
  callButton: {
    backgroundColor: '#2E7D32', // 상담원 통화 (녹색)
  },
  homeButton: {
    backgroundColor: '#FFC700', // 홈 (노란색)
    color: 'white',
  },
  input: {
    flex: 1,
    padding: '16px',
    border: '2px solid #ccc',
    borderRadius: '20px',
    fontSize: '20px',
    outline: 'none',
  },
  sendButton: {
    padding: '16px 30px',
    fontSize: '20px',
    fontWeight: 'bold',
    backgroundColor: '#0A59CF',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
    color: 'white',
    whiteSpace: 'nowrap',
  },
};

function TrainBooking_Chat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { from: 'bot', text: '안녕하세요! 기차 예매를 도와드릴게요 🚆' },
  ]);
  const [input, setInput] = useState('');

  // IME 입력 상태 관리 (한글 이중 입력 방지용)
  const isComposing = useRef(false);

  const handleLogout = () => {
    localStorage.setItem('isLoggedIn', 'false');
    navigate('/login');
  };

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage = input;
    setMessages(prev => [...prev, { from: 'user', text: userMessage }]);
    setInput('');

    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        alert('로그인이 필요합니다.');
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:8080/api/chatbot/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: userMessage })
      });

      if (response.status === 401) {
        alert('세션이 만료되었습니다. 다시 로그인해주세요.');
        handleLogout();
        return;
      }

      if (!response.ok) {
        throw new Error('API 요청 실패');
      }

      const data = await response.json();
      if (data.success) {
        setMessages(prev => [...prev, { from: 'bot', text: data.message }]);
      } else {
        setMessages(prev => [...prev, { from: 'bot', text: '오류가 발생했습니다: ' + data.message }]);
      }

    } catch (error) {
      console.error('API Error:', error);
      setMessages(prev => [...prev, { from: 'bot', text: '죄송해요, 서버와 연결할 수 없어요.' }]);
    }
  };

  const handleKeyPress = (e) => {
    // 한글 조합 중일 때는 전송 막음
    if (isComposing.current) return;

    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  // 상담원 전화 연결 (음성 채팅 페이지로 이동)
  const handleCall = () => {
    navigate('/trainbooking_voice');
  };

  return (
    <div style={styles.body}>
      {/* 상단 오른쪽 로그아웃만 유지 */}
      <button style={styles.logoutButton} onClick={handleLogout}>
        로그아웃
      </button>

      {/* 타이틀 영역 */}
      <div style={styles.titleContainer}>
        <img src={logo} alt="손에딱 로고" style={styles.titleImg} />
        <h1 style={styles.h1}>기차예매</h1>
      </div>

      {/* 채팅 영역 */}
      <div style={styles.chatBox}>
        <div style={styles.messageContainer}>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={msg.from === 'user' ? styles.userMessage : styles.botMessage}
            >
              {msg.text}
            </div>
          ))}
        </div>
      </div>

      {/* 하단 입력 + 버튼들 한 줄 */}
      <div style={styles.inputArea}>
        {/* 통화 버튼 */}
        <button
          style={{ ...styles.smallButton, ...styles.callButton }}
          onClick={handleCall}
        >
          통화
        </button>

        {/* 홈 버튼 */}
        <button
          style={{ ...styles.smallButton, ...styles.homeButton }}
          onClick={() => navigate('/')}
        >
          홈
        </button>

        {/* 입력창 */}
        <input
          type="text"
          style={styles.input}
          placeholder="메시지를 입력하세요..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onCompositionStart={() => isComposing.current = true}
          onCompositionEnd={() => isComposing.current = false}
          onKeyDown={handleKeyPress}
        />

        {/* 전송 버튼 */}
        <button style={styles.sendButton} onClick={handleSend}>
          전송
        </button>
      </div>
    </div>
  );
}

export default TrainBooking_Chat;