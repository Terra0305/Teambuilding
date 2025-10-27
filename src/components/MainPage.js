// src/components/Main.js
import React, { useEffect, useState } from 'react';
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
  loginButton: {
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
    fontSize: '90px',
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
  disabledBtn: {
    backgroundColor: '#ccc',
    cursor: 'not-allowed',
    transform: 'none',
    boxShadow: 'none',
  },
  trainBtn: {
    backgroundColor: '#3f51b5',
    color: 'white',
  },
  busBtn: {
    backgroundColor: '#4caf50',
    color: 'white',
  },
  checkBtn: {
    width: '700px',
    height: '150px',
    backgroundColor: '#FFC700',
    color: 'white',
    fontSize: '50px',
    marginTop: '60px',
    borderRadius: '20px',
    border: 'none',
  },
  paymentBtn: {
    width: '700px',
    height: '150px',
    backgroundColor: '#FF5C33', // 주황색
    color: 'white',
    fontSize: '50px',
    marginTop: '30px',
    borderRadius: '20px',
    border: 'none',
    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
    cursor: 'pointer',
  },
};

function Main() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedInStatus);
  }, []);

  const handleAuth = () => {
    if (isLoggedIn) {
      localStorage.setItem('isLoggedIn', 'false');
      setIsLoggedIn(false);
    } else {
      navigate('/login');
    }
  };

  return (
    <div style={styles.body}>
      <button style={styles.loginButton} onClick={handleAuth}>
        {isLoggedIn ? '로그아웃' : '로그인'}
      </button>

      <div style={styles.titleContainer}>
        <img src={logo} alt="손에딱 로고" style={styles.titleContainerImg} />
        <h1 style={styles.h1}>손에딱</h1>
      </div>

      {/* ✅ 기차예매 + 버스예매 버튼 */}
      <div style={styles.buttonGroup}>
        <button
          style={{
            ...styles.button,
            ...styles.trainBtn,
            ...(!isLoggedIn && styles.disabledBtn),
          }}
          onClick={() => {
            if (isLoggedIn) navigate('/trainbooking');
          }}
          disabled={!isLoggedIn}
        >
          기차 예매
        </button>

        <button
          style={{
            ...styles.button,
            ...styles.busBtn,
            ...(!isLoggedIn && styles.disabledBtn),
          }}
          onClick={() => {
            if (isLoggedIn) navigate('/busbooking');
          }}
          disabled={!isLoggedIn}
        >
          버스 예매
        </button>
      </div>

      {/* ✅ 승차권 확인 버튼 */}
      <button
        style={{
          ...styles.checkBtn,
          ...(!isLoggedIn && styles.disabledBtn),
        }}
        onClick={() => {
          if (isLoggedIn) navigate('/check');
        }}
        disabled={!isLoggedIn}
      >
        승차권 확인
      </button>

      {/* ✅ 결제 진행 버튼 */}
      <button
        style={{
          ...styles.paymentBtn,
          ...(!isLoggedIn && styles.disabledBtn),
        }}
        onClick={() => {
          if (isLoggedIn) navigate('/payment');
        }}
        disabled={!isLoggedIn}
      >
        결제 진행
      </button>
    </div>
  );
}

export default Main;
