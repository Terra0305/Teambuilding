import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import logo from '../logo.png';

const styles = {
  body: {
    fontFamily: "'Noto Sans KR', sans-serif",
    backgroundColor: '#f9f9f9',
    padding: '40px',
    minHeight: '100vh',
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
    marginBottom: '40px',
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
  ticketList: {
    width: '90%',
    maxWidth: '900px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  ticketBox: {
    backgroundColor: 'white',
    borderRadius: '20px',
    padding: '30px',
    boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
    textAlign: 'left',
  },
  ticketTitle: {
    fontSize: '30px',
    fontWeight: 800,
    marginBottom: '20px',
    paddingBottom: '10px',
    borderBottom: '2px solid #FFC700',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '22px',
    padding: '10px 0',
  },
  label: {
    color: '#666',
    fontWeight: 'bold',
  },
  value: {
    color: '#000',
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#d9534f',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '18px',
    marginTop: '20px',
    float: 'right',
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
  message: {
    fontSize: '24px',
    color: '#555',
  },
};

function TicketCheck() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState('예매 내역을 불러오는 중...');

  const fetchBookings = () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    fetch('http://localhost:8080/api/my-bookings', {
      headers: { 'Authorization': `Bearer ${token}` },
    })
    .then(response => {
      if (response.status === 401) {
        alert('세션이 만료되었습니다. 다시 로그인해주세요.');
        navigate('/login');
        return null;
      }
      return response.json();
    })
    .then(data => {
      if (data) {
        setBookings(data);
        setMessage(data.length === 0 ? '예매 내역이 없습니다.' : '');
      }
    })
    .catch(error => {
      console.error("Error fetching bookings:", error);
      setMessage('예매 내역을 불러오는 중 오류가 발생했습니다.');
    });
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = (bookingId) => {
    if (!window.confirm('정말로 이 예매를 취소하시겠습니까?')) return;

    const token = localStorage.getItem('jwtToken');
    fetch(`http://localhost:8080/api/bookings/${bookingId}`,
     {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    })
    .then(response => {
        if (response.ok) {
            alert('예매가 취소되었습니다.');
            fetchBookings(); // 목록 새로고침
        } else {
            alert('예매 취소에 실패했습니다.');
        }
    })
    .catch(error => {
        console.error("Error canceling booking:", error);
        alert('예매 취소 중 오류가 발생했습니다.');
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('jwtToken');
    navigate('/login');
  };

  return (
    <div style={styles.body}>
      <button style={styles.logoutButton} onClick={handleLogout}>로그아웃</button>

      <div style={styles.titleContainer}>
        <img src={logo} alt="손에딱 로고" style={styles.logo} />
        <h1 style={styles.title}>승차권 확인</h1>
      </div>

      <div style={styles.ticketList}>
        {bookings.length > 0 ? (
          bookings.map(booking => (
            <div key={booking.bookingId} style={styles.ticketBox}>
              <div style={styles.ticketTitle}>예매 번호: {booking.bookingId}</div>
              <div style={styles.infoRow}>
                <span style={styles.label}>기차번호</span>
                <span style={styles.value}>{booking.trainNumber}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.label}>구간</span>
                <span style={styles.value}>{booking.origin} → {booking.destination}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.label}>출발시간</span>
                <span style={styles.value}>{new Date(booking.departureTime).toLocaleString()}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.label}>도착시간</span>
                <span style={styles.value}>{new Date(booking.arrivalTime).toLocaleString()}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.label}>가격</span>
                <span style={styles.value}>{booking.price.toLocaleString()}원</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.label}>상태</span>
                <span style={styles.value}>{booking.status}</span>
              </div>
              {booking.status === 'CONFIRMED' && (
                <button style={styles.cancelButton} onClick={() => handleCancelBooking(booking.bookingId)}>
                  예매 취소
                </button>
              )}
            </div>
          ))
        ) : (
          <p style={styles.message}>{message}</p>
        )}
      </div>

      <button style={styles.homeBtn} onClick={() => navigate('/')}>
        홈으로 돌아가기
      </button>
    </div>
  );
}

export default TicketCheck;