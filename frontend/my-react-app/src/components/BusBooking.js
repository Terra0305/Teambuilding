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
    backgroundColor: '#0ACF83', // 파란색
    color: 'white',
  },
  voiceBtn: {
    backgroundColor: '#21CF0A', // 하늘색
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

function BusBooking() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('jwtToken');
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
        <h1 style={styles.h1}>버스 예매</h1>
      </div>

      {/* 🔹 기능 준비 중 메시지 */}
      <div style={styles.preparationMessage}>
        <p>🚌</p>
        <p>버스 예매 기능은 현재 준비 중입니다!</p>
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

// 새 스타일에 메시지 스타일 추가
const newStyles = {
    preparationMessage: {
        marginTop: '80px',
        fontSize: '32px',
        color: '#555',
        textAlign: 'center',
        padding: '40px',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: '20px',
    }
};

Object.assign(styles, newStyles);

export default BusBooking;