// src/components/PaymentScreen.js
import React from 'react';
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
    backgroundColor: 'white',
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
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginTop: '60px',
    marginBottom: '30px',
  },
  logo: {
    width: '90px',
    height: '90px',
  },
  title: {
    fontSize: '70px',
    fontWeight: 900,
    color: '#333',
    textAlign: 'center',
    margin: 0,
  },
  sectionTitle: {
    fontSize: '36px',
    fontWeight: 'bold',
    marginTop: '10px',
    textAlign: 'center',
    borderBottom: '2px solid #000',
    paddingBottom: '8px',
  },
  subText: {
    fontSize: '24px',
    color: '#666',
    marginTop: '10px',
    marginBottom: '30px',
  },
  box: {
    width: '400px',
    height: '150px',
    border: '2px solid #000',
    borderRadius: '20px',
    textAlign: 'center',
    fontSize: '30px',
    fontWeight: 'bold',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    marginBottom: '40px',
  },
  balanceBtn: {
    backgroundColor: '#ccc',
    border: 'none',
    borderRadius: '20px',
    padding: '14px',
    fontSize: '30px',
    marginBottom: '10px',
  },
  balanceText: {
    fontSize: '32px',
    fontWeight: 'bold',
  },
  addBtn: {
    width: '350px',
    height: '100px',
    backgroundColor: '#A66BFF',
    color: 'white',
    fontSize: '36px',
    fontWeight: 'bold',
    borderRadius: '20px',
    border: 'none',
    marginTop: '20px',
    cursor: 'pointer',
  },
  payBtn: {
    width: '350px',
    height: '100px',
    backgroundColor: '#FF5733',
    color: 'white',
    fontSize: '36px',
    fontWeight: 'bold',
    borderRadius: '20px',
    border: 'none',
    marginTop: '20px',
    cursor: 'pointer',
  },
};

function PaymentScreen() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.setItem('isLoggedIn', 'false');
    navigate('/login');
  };

  const handleMileagePay = () => {
    // ✅ 예시 데이터 — 실제론 선택한 정보로 바꿔도 됨
    const travelInfo = {
      transport: '기차 (KTX)',
      route: '서울 → 부산',
      time: '오전 10:00 출발',
    };
    const amount = '52,000원';

    navigate('/payment_complete', { state: { travelInfo, amount } });
  };

  return (
    <div style={styles.body}>
      <button style={styles.logoutButton} onClick={handleLogout}>로그아웃</button>

      <div style={styles.titleContainer}>
        <img src={logo} alt="손에딱 로고" style={styles.logo} />
        <h1 style={styles.title}>결제화면</h1>
      </div>

      <div style={styles.sectionTitle}>선택내역</div>
      <div style={styles.subText}>시간 | 장소 | 이동수단</div>

      <button style={styles.balanceBtn}>마일리지 잔액</button>
      <div style={styles.box}>xxx,xxx원</div>

      <button style={styles.addBtn}>마일리지 추가하기</button>
      <button style={styles.payBtn} onClick={handleMileagePay}>
        마일리지 결제하기
      </button>
    </div>
  );
}

export default PaymentScreen;
