import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

function MainPage() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null); // 에러 메시지 상태
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
      });
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
                <p style={{color: 'red'}}>{error}</p>
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

      {user ? (
        <div style={styles.welcomeMessage}>
            <h2>{user.name}님, 안녕하세요!</h2>
            <p>현재 {bookings.length}개의 예매 내역이 있습니다.</p>
        </div>
      ) : (
        <div style={styles.welcomeMessage}>
            <h2>데이터를 불러오는 중입니다...</h2>
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
