// src/components/TrainBooking_Chat.js
import React, { useState } from 'react';
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
  backButton: {
    position: 'absolute',
    top: '20px',
    left: '30px',
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
    width: '90%',
    maxWidth: '900px',
    marginBottom: '30px',
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
    marginLeft: '10px',
    padding: '16px 30px',
    fontSize: '20px',
    fontWeight: 'bold',
    backgroundColor: '#0A59CF',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
    color: 'white',
  },
  homeBtn: {
    width: '450px',
    height: '150px',
    backgroundColor: '#FFC700',
    color: 'white',
    fontSize: '50px',
    marginTop: '10px',
    borderRadius: '20px',
    border: 'none',
    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
    cursor: 'pointer',
  },
};

function TrainBooking_Chat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { from: 'bot', text: '안녕하세요! 기차 예매를 도와드릴게요 🚆' },
  ]);
  const [input, setInput] = useState('');

  const handleLogout = () => {
    localStorage.setItem('isLoggedIn', 'false');
    navigate('/login');
  };

  const handleBack = () => {
    navigate('/trainbooking');
  };

  const handleSend = () => {
    if (input.trim() === '') return;
    setMessages(prev => [...prev, { from: 'user', text: input }]);
    setInput('');

    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { from: 'bot', text: '예매를 진행하시겠어요?' },
      ]);
    }, 600);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={styles.body}>
      <button style={styles.backButton} onClick={handleBack}>뒤로가기</button>
      <button style={styles.logoutButton} onClick={handleLogout}>로그아웃</button>

      <div style={styles.titleContainer}>
        <img src={logo} alt="손에딱 로고" style={styles.titleImg} />
        <h1 style={styles.h1}>기차예매</h1>
      </div>

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

      <div style={styles.inputArea}>
        <input
          type="text"
          style={styles.input}
          placeholder="메시지를 입력하세요..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button style={styles.sendButton} onClick={handleSend}>전송</button>
      </div>

      <button style={styles.homeBtn} onClick={() => navigate('/')}>
        홈으로 돌아가기
      </button>
    </div>
  );
}

export default TrainBooking_Chat;
