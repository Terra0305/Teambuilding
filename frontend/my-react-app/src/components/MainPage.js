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
    justifyContent: 'center', // 중앙 정렬 및 공간 배분
    position: 'relative',
    height: '100vh',
    overflow: 'hidden', // 스크롤 방지
    gap: '2vh', // 요소 간 기본 간격
  },
  loginButton: {
    position: 'absolute',
    top: '20px',
    right: '30px',
    padding: '1.5vh 3vh', // vh 단위로 변경
    fontSize: '2.5vh',
    fontWeight: 'bold',
    backgroundColor: '#333',
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
    transition: 'background-color 0.2s ease',
    zIndex: 10,
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginTop: '5vh', // 상단 여백 줄임
  },
  titleContainerImg: {
    width: '8vh', // 크기 축소
    height: '8vh',
  },
  h1: {
    fontSize: '8vh', // 크기 축소
    fontWeight: 900,
    color: '#333',
    margin: 0,
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '2vh',
    gap: '3vh',
  },
  button: {
    width: '25vh', // 정사각형 크기 축소
    height: '25vh',
    fontSize: '5vh',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '30px',
    cursor: 'pointer',
    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
    transition: 'transform 0.2s ease',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
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
    width: '60vh', // 너비 축소
    height: '10vh', // 높이 축소
    backgroundColor: '#FFC700',
    color: 'white',
    fontSize: '4vh',
    marginTop: '2vh',
    borderRadius: '20px',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
  },
  paymentBtn: {
    width: '60vh',
    height: '10vh',
    backgroundColor: '#FF5C33', // 주황색
    color: 'white',
    fontSize: '4vh',
    marginTop: '1vh',
    borderRadius: '20px',
    border: 'none',
    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
    cursor: 'pointer',
  },
};

function MainPage() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null); // 에러 메시지 상태
  const [loading, setLoading] = useState(true); // ✅ 로딩 상태 추가
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      Promise.all([
        fetch('http://localhost:8080/api/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:8080/api/my-bookings', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]).then(async ([userRes, bookingsRes]) => {
        if (userRes.status === 401 || bookingsRes.status === 401) {
          handleLogout();
          alert('세션이 만료되었습니다. 다시 로그인해주세요.');
          return;
        }

        // Check if responses are ok before parsing JSON
        if (!userRes.ok) {
          const errorText = await userRes.text();
          throw new Error(`사용자 정보 로딩 실패: ${userRes.status} ${errorText}`);
        }
        if (!bookingsRes.ok) {
          const errorText = await bookingsRes.text();
          throw new Error(`예매 내역 로딩 실패: ${bookingsRes.status} ${errorText}`);
        }

        const userData = await userRes.json();
        const bookingsData = await bookingsRes.json();

        if (userData) setUser(userData);
        if (bookingsData) setBookings(bookingsData);

      }).catch(err => {
        console.error("Error fetching user data:", err);
        setError(err.message); // 에러 상태에 메시지 저장
        // handleLogout(); // 더 이상 자동으로 로그아웃하지 않음
      }).finally(() => {
        setLoading(false); // ✅ 로딩 완료 (성공이든 실패든)
      });
    } else {
      setLoading(false); // ✅ 토큰이 없으면 바로 로딩 끝
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('jwtToken');
    setUser(null);
    setBookings([]);
    navigate('/login');
  };

  // 에러가 발생했을 때 보여줄 UI
  if (error) {
    return (
      <div style={styles.body}>
        <div style={styles.welcomeMessage}>
          <h2>오류가 발생했습니다</h2>
          <p style={{ color: 'red' }}>{error}</p>
          <button onClick={handleLogout}>로그인 페이지로 돌아가기</button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.body}>
      <button style={styles.loginButton} onClick={user ? handleLogout : () => navigate('/login')}>
        {user ? '로그아웃' : '로그인'}
      </button>

      <div style={styles.titleContainer}>
        <img src={logo} alt="손에딱 로고" style={styles.titleContainerImg} />
        <h1 style={styles.h1}>손에딱</h1>
      </div>

      {loading ? (
        <div style={styles.welcomeMessage}>
          <h2>데이터를 불러오는 중입니다...</h2>
        </div>
      ) : user ? (
        <div style={styles.welcomeMessage}>
          <h2>{user.name}님, 안녕하세요!</h2>
          <p>현재 {bookings.length}개의 예매 내역이 있습니다.</p>
        </div>
      ) : (
        <div style={styles.welcomeMessage}>
          <h2>로그인이 필요합니다.</h2>
          <p>서비스를 이용하시려면 로그인해주세요.</p>
        </div>
      )}

      {/* ✅ 기차예매 + 버스예매 버튼 */}
      <div style={styles.buttonGroup}>
        <button
          style={{
            ...styles.button,
            ...styles.trainBtn,
            ...(!user && styles.disabledBtn),
          }}
          onClick={() => {
            if (user) navigate('/trainbooking');
          }}
          disabled={!user}
        >
          기차 예매
        </button>

        <button
          style={{
            ...styles.button,
            ...styles.busBtn,
            ...(!user && styles.disabledBtn),
          }}
          onClick={() => {
            if (user) navigate('/busbooking');
          }}
          disabled={!user}
        >
          버스 예매
        </button>
      </div>

      {/* ✅ 승차권 확인 버튼 */}
      <button
        style={{
          ...styles.checkBtn,
          ...(!user && styles.disabledBtn),
        }}
        onClick={() => {
          if (user) navigate('/check');
        }}
        disabled={!user}
      >
        승차권 확인
      </button>

      {/* ✅ 결제 진행 버튼 */}
      <button
        style={{
          ...styles.paymentBtn,
          ...(!user && styles.disabledBtn),
        }}
        onClick={() => {
          if (user) navigate('/payment');
        }}
        disabled={!user}
      >
        결제 진행
      </button>
    </div>
  );
}

const newStyles = {
  welcomeMessage: {
    margin: '20px 0',
    padding: '20px',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: '15px',
    textAlign: 'center',
  }
};

Object.assign(styles, newStyles);

export default MainPage;
