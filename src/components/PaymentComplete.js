// src/components/PaymentComplete.js
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../App.css';
import logo from '../logo.png';

const styles = {
  body: {
    margin: 0,
    padding: 0,
    fontFamily: 'Noto Sans KR, sans-serif',
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100vh',
    position: 'relative',
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
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginTop: '80px',
  },
  logo: {
    width: '90px',
    height: '90px',
  },
  title: {
    fontSize: '70px',
    fontWeight: 900,
    color: '#333',
  },
  message: {
    fontSize: '55px',
    fontWeight: 800,
    color: '#000',
    marginTop: '60px',
    textAlign: 'center',
  },
  infoBox: {
    backgroundColor: '#f5f5f5',
    borderRadius: '20px',
    padding: '20px 40px',
    marginTop: '30px',
    fontSize: '30px',
    textAlign: 'left',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  },
  button: {
    width: '400px',
    height: '120px',
    backgroundColor: '#FFC700',
    color: 'white',
    fontSize: '40px',
    fontWeight: 'bold',
    borderRadius: '20px',
    border: 'none',
    marginTop: '60px',
    cursor: 'pointer',
  },
  homeBtn: {
    width: '400px',
    height: '120px',
    backgroundColor: '#0A59CF',
    color: 'white',
    fontSize: '40px',
    fontWeight: 'bold',
    borderRadius: '20px',
    border: 'none',
    marginTop: '20px',
    cursor: 'pointer',
  },
};

function PaymentComplete() {
  const navigate = useNavigate();
  const location = useLocation();
  const { travelInfo, amount } = location.state || {};

  return (
    <div style={styles.body}>
      <button style={styles.logoutButton} onClick={() => navigate('/login')}>
        로그아웃
      </button>

      <div style={styles.logoContainer}>
        <img src={logo} alt="손에딱 로고" style={styles.logo} />
        <h1 style={styles.title}>결제화면</h1>
      </div>

      <div style={styles.message}>결제가 완료되었습니다!</div>

      {/* ✅ 결제 정보 표시 */}
      <div style={styles.infoBox}>
        <div>🚆 <strong>이용수단:</strong> {travelInfo?.transport || '기차 (예시)'}</div>
        <div>📍 <strong>노선:</strong> {travelInfo?.route || '서울 → 부산'}</div>
        <div>🕒 <strong>출발시간:</strong> {travelInfo?.time || '오전 10:00'}</div>
        <div>💰 <strong>결제금액:</strong> {amount || '52,000원'}</div>
      </div>
     <button  style={styles.button}onClick={() => navigate('/check', { state: { travelInfo, amount } })}>
        승차권 확인
     </button>

      
            
      <button style={styles.homeBtn} onClick={() => navigate('/')}>
        홈으로 돌아가기
      </button>
    </div>
  );
}

export default PaymentComplete;
