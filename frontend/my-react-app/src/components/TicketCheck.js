// src/components/TicketCheck.js
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../App.css';
import logo from '../logo.png';

const styles = {
  body: {
    fontFamily: "'Noto Sans KR', sans-serif",
    backgroundColor: '#f9f9f9',
    padding: '40px',
    textAlign: 'center',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
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
    marginBottom: '20px',
  },
  logo: {
    width: '90px',
    height: '90px',
  },
  title: {
    fontSize: '70px',
    fontWeight: 900,
    color: '#333',
    margin: 0,
  },
  ticketBox: {
    backgroundColor: 'white',
    borderRadius: '20px',
    padding: '40px',
    boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
    width: '90%',
    maxWidth: '800px',
    textAlign: 'left',
    marginTop: '40px',
  },
  ticketTitle: {
    fontSize: '40px',
    fontWeight: 800,
    textAlign: 'center',
    marginBottom: '30px',
    borderBottom: '3px solid #FFC700',
    paddingBottom: '10px',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '26px',
    padding: '14px 0',
    borderBottom: '1px solid #ddd',
  },
  label: {
    color: '#666',
    fontWeight: 'bold',
  },
  value: {
    color: '#000',
    fontWeight: '600',
  },
  homeBtn: {
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
};

function TicketCheck() {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ 결제 완료 화면에서 넘겨받은 데이터
  const { travelInfo, amount } = location.state || {
    travelInfo: {
      transport: '기차 (KTX)',
      route: '서울 → 부산',
      time: '오전 10:00 출발',
    },
    amount: '52,000원',
  };

  return (
    <div style={styles.body}>
      {/* 로그아웃 */}
      <button style={styles.logoutButton} onClick={() => navigate('/login')}>
        로그아웃
      </button>

      {/* 상단 제목 */}
      <div style={styles.titleContainer}>
        <img src={logo} alt="손에딱 로고" style={styles.logo} />
        <h1 style={styles.title}>승차권 확인</h1>
      </div>

      {/* 승차권 정보 카드 */}
      <div style={styles.ticketBox}>
        <div style={styles.ticketTitle}>결제 완료 정보</div>

        <div style={styles.infoRow}>
          <span style={styles.label}>이용수단</span>
          <span style={styles.value}>{travelInfo.transport}</span>
        </div>

        <div style={styles.infoRow}>
          <span style={styles.label}>노선</span>
          <span style={styles.value}>{travelInfo.route}</span>
        </div>

        <div style={styles.infoRow}>
          <span style={styles.label}>출발시간</span>
          <span style={styles.value}>{travelInfo.time}</span>
        </div>

        <div style={styles.infoRow}>
          <span style={styles.label}>결제금액</span>
          <span style={styles.value}>{amount}</span>
        </div>
      </div>

      {/* 홈으로 돌아가기 버튼 */}
      <button style={styles.homeBtn} onClick={() => navigate('/')}>
        홈으로 돌아가기
      </button>
    </div>
  );
}

export default TicketCheck;
