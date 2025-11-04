
// src/components/TrainBooking_Chat.js
import React, { useState, useEffect, useRef } from 'react';
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
  // backButton 스타일은 이제 안 써서 굳이 지워도 되지만
  // 남겨놔도 에러는 아님. 일단 깔끔하게 유지하려고 지움.
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
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false); // 전송 중 상태 추가
  const messagesEndRef = useRef(null); // 스크롤을 위한 ref

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 채팅 기록 불러오기
  const fetchHistory = () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    fetch('http://localhost:8080/api/chatbot/history', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => {
      if (res.status === 401) {
        alert('세션이 만료되었거나 유효하지 않습니다. 다시 로그인해주세요.');
        navigate('/login');
        return null;
      }
      return res.json();
    })
    .then(data => {
      if (data && data.success) {
        const history = data.history.map(item => ({
          from: item.role === 'user' ? 'user' : 'bot',
          text: item.content
        }));
        setMessages([
          { from: 'bot', text: '안녕하세요! 기차 예매를 도와드릴게요 🚆' },
          ...history
        ]);
      }
    });
  };

  // 컴포넌트 마운트 시 채팅 기록 불러오기
  useEffect(() => {
    fetchHistory();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('jwtToken'); // 토큰 삭제
    navigate('/login');
  };

  const handleSend = () => {
    if (input.trim() === '' || isSending) return;

    setIsSending(true);
    const userMessage = { from: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    const token = localStorage.getItem('jwtToken');

    fetch('http://localhost:8080/api/chatbot/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ message: input })
    })
    .then(res => {
      if (res.status === 401) {
        alert('세션이 만료되었거나 유효하지 않습니다. 다시 로그인해주세요.');
        navigate('/login');
        return null;
      }
      return res.json();
    })
    .then(data => {
      if (data && data.success) {
        try {
          // Check for special action from bot
          const actionData = JSON.parse(data.message);
          if (actionData.action === 'INITIATE_PAYMENT' && actionData.trainId) {
            handleBooking(actionData.trainId);
            return;
          }
        } catch (e) {
          // Not a JSON action, treat as regular message
        }

        const botMessage = { from: 'bot', text: data.message };
        setMessages(prev => [...prev, botMessage]);
      } else if (data) {
        const errorMessage = { from: 'bot', text: `오류: ${data.message}` };
        setMessages(prev => [...prev, errorMessage]);
      }
    })
    .catch(error => {
      console.error("Chat API error:", error);
      let errorMessageText = '챗봇 서버와 통신에 실패했습니다.';
      if (error.message.includes('429')) {
        errorMessageText = '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.';
      }
      const errorMessage = { from: 'bot', text: errorMessageText };
      setMessages(prev => [...prev, errorMessage]);
    })
    .finally(() => {
        setIsSending(false);
    });
  };

  const handleBooking = (trainId) => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    fetch('http://localhost:8080/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ trainId: trainId }),
    })
    .then(res => {
      if (!res.ok) {
        throw new Error('예매 생성에 실패했습니다.');
      }
      return res.json();
    })
    .then(bookingData => {
      // 예매 생성 성공 시 결제 화면으로 이동
      navigate('/payment', { state: { booking: bookingData } });
    })
    .catch(error => {
      console.error("Booking creation error:", error);
      const errorMessage = { from: 'bot', text: `예매 생성 중 오류가 발생했습니다: ${error.message}` };
      setMessages(prev => [...prev, errorMessage]);
    });
  };
  
  const handleClearHistory = () => {
    const token = localStorage.getItem('jwtToken');
    if (!window.confirm('대화 내용을 모두 삭제하시겠습니까?')) return;

    fetch('http://localhost:8080/api/chatbot/clear', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
            setMessages([{ from: 'bot', text: '안녕하세요! 기차 예매를 도와드릴게요 🚆' }]);
        } else {
            alert(`오류: ${data.message}`);
        }
    })
    .catch(error => {
        console.error("Clear history error:", error);
        alert('대화 내용 삭제에 실패했습니다.');
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  // 상담원 전화 연결
  const handleCall = () => {
    window.location.href = 'tel:1544-1234'; // 번호는 원하는 번호로 교체 가능
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
          <div ref={messagesEndRef} />
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

        {/* 대화 초기화 버튼 */}
        <button
          style={{ ...styles.smallButton, backgroundColor: '#f44336' }}
          onClick={handleClearHistory}
        >
          초기화
        </button>

        {/* 입력창 */}
        <input
          type="text"
          style={styles.input}
          placeholder={isSending ? '응답을 기다리는 중...' : '메시지를 입력하세요...'}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={isSending} // 전송 중 비활성화
        />

        {/* 전송 버튼 */}
        <button style={{...styles.sendButton, ...(isSending && { backgroundColor: '#ccc' })}} onClick={handleSend} disabled={isSending}>
          {isSending ? '전송중' : '전송'}
        </button>
      </div>
    </div>
  );
}

export default TrainBooking_Chat;
