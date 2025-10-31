import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import logo from '../logo.png';
import callIcon from '../images/voice.png'; // ✅ voice.png 경로

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
  imgButton: {
    width: '250px',
    height: '250px',
    backgroundColor: 'white',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
    marginTop: '60px',
  },
  callIcon: {
    width: '250px',
    height: '250px',
    objectFit: 'contain',
  },
  infoText: {
    marginTop: '100px',
    fontSize: '50px',
    color: '#333',
  },
  homeBtn: {
    width: '450px',
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

function TrainBooking_Voice() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.setItem('isLoggedIn', 'false');
    navigate('/login');
  };

  const handleBack = () => {
    navigate('/trainbooking'); // ✅ 기차 예매 화면으로 이동
  };

  const startVoiceBooking = () => {
    navigate('/train-voice-start'); // ✅ 클릭 시 이동할 경로
  };

  return (
    <div style={styles.body}>
      {/* 🔹 뒤로가기 버튼 (왼쪽 상단) */}
      <button style={styles.backButton} onClick={handleBack}>
        뒤로가기
      </button>

      {/* 🔹 로그아웃 버튼 (오른쪽 상단) */}
      <button style={styles.logoutButton} onClick={handleLogout}>
        로그아웃
      </button>

      {/* 🔹 상단 제목 (로고 + 텍스트) */}
      <div style={styles.titleContainer}>
        <img src={logo} alt="손에딱 로고" style={styles.titleImg} />
        <h1 style={styles.h1}>기차예매</h1>
      </div>

      {/* 🔹 이미지 버튼 */}
      <div style={styles.imgButton} onClick={startVoiceBooking}>
        <img src={callIcon} alt="음성 아이콘" style={styles.callIcon} />
      </div>

      {/* 🔹 안내 문구 */}
      <p style={styles.infoText}>음성 예매를 시작하려면 버튼을 눌러 주세요</p>

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

export default TrainBooking_Voice;