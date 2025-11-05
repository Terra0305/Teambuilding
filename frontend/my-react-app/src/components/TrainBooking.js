import React, { useState } from 'react';
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
  const [origin, setOrigin] = useState('용산');
  const [destination, setDestination] = useState('광주송정');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [trains, setTrains] = useState([]);
  const [message, setMessage] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('jwtToken');
    navigate('/login');
  };

  const handleSearch = () => {
    setMessage('기차편을 검색 중입니다...');
    setTrains([]);

    const url = `${process.env.REACT_APP_API_URL}/api/trains?origin=${origin}&destination=${destination}&date=${date}`;

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('검색 중 오류가 발생했습니다.');
        }
        return response.json();
      })
      .then(data => {
        if (data.length > 0) {
          setTrains(data);
          setMessage('');
        } else {
          setMessage('해당 조건의 기차편이 없습니다.');
        }
      })
      .catch(error => {
        console.error("Train search error:", error);
        setMessage(error.message);
      });
  };

  const handleBooking = (train) => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    fetch(`${process.env.REACT_APP_API_URL}/api/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ trainId: train.id }),
    })
    .then(res => {
      if (!res.ok) {
        throw new Error('예매 생성에 실패했습니다.');
      }
      return res.json();
    })
    .then(bookingData => {
      // 예매 생성 성공 시 결제 화면으로 이동
      navigate('/payment', { state: { booking: bookingData } });
    })
    .catch(error => {
      console.error("Booking creation error:", error);
      setMessage(error.message);
    });
  };

  return (
    <div style={styles.body}>
      <button style={styles.logoutButton} onClick={handleLogout}>
        로그아웃
      </button>

      <div style={styles.titleContainer}>
        <img src={logo} alt="손에딱 로고" style={styles.titleContainerImg} />
        <h1 style={styles.h1}>기차 예매</h1>
      </div>

      {/* 다른 예매 방식 선택 */}
      <div style={styles.modeSelectGroup}>
        <button onClick={() => navigate('/trainbooking_chat')} style={styles.modeButton}>채팅으로 예매</button>
        <button onClick={() => navigate('/trainbooking_voice')} style={styles.modeButton}>음성으로 예매</button>
      </div>

      {/* 검색 폼 */}
      <div style={styles.searchForm}>
        <input type="text" value={origin} onChange={e => setOrigin(e.target.value)} placeholder="출발지" style={styles.input} />
        <input type="text" value={destination} onChange={e => setDestination(e.target.value)} placeholder="도착지" style={styles.input} />
        <input type="date" value={date} onChange={e => setDate(e.target.value)} style={styles.input} />
        <button onClick={handleSearch} style={styles.searchButton}>검색</button>
      </div>

      {/* 검색 결과 */}
      <div style={styles.resultsContainer}>
        {message && <p style={styles.message}>{message}</p>}
        {trains.map(train => (
          <div key={train.id} style={styles.trainItem}>
            <span>{train.trainNumber}</span>
            <span>{train.origin} ({train.departureTime})</span>
            <span>-&gt;</span>
            <span>{train.destination} ({train.arrivalTime})</span>
            <span>{train.price}원</span>
            <button onClick={() => handleBooking(train)} style={styles.bookButton}>예매</button>
          </div>
        ))}
      </div>

      <button style={styles.homeBtn} onClick={() => navigate('/')}>
        홈으로 돌아가기
      </button>
    </div>
  );
}

// Add new styles for the search form and results
const newStyles = {
  modeSelectGroup: {
    display: 'flex',
    gap: '20px',
    marginBottom: '20px',
  },
  modeButton: {
    padding: '10px 20px',
    fontSize: '18px',
    fontWeight: 'bold',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  searchForm: {
    display: 'flex',
    gap: '10px',
    margin: '20px 0',
    padding: '20px',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: '15px',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '1px solid #ccc',
  },
  searchButton: {
    padding: '10px 20px',
    fontSize: '16px',
    fontWeight: 'bold',
    backgroundColor: '#0A59CF',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  resultsContainer: {
    width: '90%',
    maxWidth: '800px',
    marginTop: '20px',
  },
  message: {
    textAlign: 'center',
    fontSize: '18px',
    color: '#d9534f',
  },
  trainItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px',
    margin: '10px 0',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  bookButton: {
    padding: '8px 15px',
    fontSize: '14px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

// Merge styles
Object.assign(styles, newStyles);

export default TrainBooking;
