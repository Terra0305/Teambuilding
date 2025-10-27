import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import logo from '../logo.png';

const styles = {
  body: {
    margin: 0,
    padding: 0,
    fontFamily: 'Noto Sans KR, sans-serif',
    backgroundSize: 'cover',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    height: '100vh',
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
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
    transition: 'background-color 0.2s ease',
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginTop: '60px',
  },
  titleContainerImg: {
    width: '100px',
    height: '100px',
  },
  h1: {
    fontSize: '80px',
    fontWeight: 900,
    color: '#333',
    margin: 0,
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '80px',
    gap: '40px',
  },
  button: {
    width: '330px',
    height: '330px',
    fontSize: '70px',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '30px',
    cursor: 'pointer',
    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
    transition: 'transform 0.2s ease',
  },
  chatBtn: {
    backgroundColor: '#0A59CF', // 파란색
    color: 'white',
  },
  voiceBtn: {
    backgroundColor: '#18B7FB', // 하늘색
    color: 'white',
  },
  homeBtn: {
    width: '700px',
    height: '150px',
    backgroundColor: '#FFC700',
    color: 'white',
    fontSize: '50px',
    marginTop: '60px',
    borderRadius: '20px',
    border: 'none',
    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
    cursor: 'pointer',
  },
};

function TrainBooking() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.setItem('isLoggedIn', 'false');
    navigate('/login');
  };

  return (
    <div style={styles.body}>
      {/* 🔹 로그아웃 버튼 */}
      <button style={styles.logoutButton} onClick={handleLogout}>
        로그아웃
      </button>

      {/* 🔹 상단 제목 (로고 + 텍스트) */}
      <div style={styles.titleContainer}>
        <img src={logo} alt="손에딱 로고" style={styles.titleContainerImg} />
        <h1 style={styles.h1}>기차 예매</h1>
      </div>

      {/* 🔹 음성 예매 + 채팅 예매 (위치 교체됨) */}
      <div style={styles.buttonGroup}>
        <button
          style={{ ...styles.button, ...styles.voiceBtn }}
          onClick={() => navigate('/trainbooking_voice')}
        >
          음성 예매
        </button>

        <button
          style={{ ...styles.button, ...styles.chatBtn }}
          onClick={() => navigate('/trainbooking_chat')}
        >
          채팅 예매
        </button>
      </div>

      {/* 🔹 홈으로 돌아가기 버튼 */}
      <button
        style={styles.homeBtn}
        onClick={() => navigate('/')}
      >
        홈으로 돌아가기
      </button>
    </div>
  );
}

export default TrainBooking;
