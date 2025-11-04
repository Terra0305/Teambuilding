import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../App.css';
import logo from '../logo.png';

const styles = {
  body: {
    fontFamily: "'Noto Sans KR', sans-serif",
    backgroundColor: '#f9f9f9',
    padding: '40px',
    textAlign: 'center',
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
  paymentBox: {
    backgroundColor: 'white',
    borderRadius: '20px',
    padding: '40px',
    boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
    width: '90%',
    maxWidth: '600px',
    textAlign: 'center',
    marginTop: '40px',
  },
  sectionTitle: {
    fontSize: '36px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  infoText: {
    fontSize: '24px',
    color: '#333',
    margin: '10px 0',
  },
  priceText: {
    fontSize: '40px',
    fontWeight: 'bold',
    color: '#FF5733',
    margin: '20px 0',
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
    cursor: 'pointer',
  },
  errorMessage: {
      fontSize: '20px',
      color: 'red',
      marginTop: '20px',
  }
};

function PaymentScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { booking } = location.state || {};

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('jwtToken');
    navigate('/login');
  };

  const handlePayment = () => {
    if (!booking) {
        setError('결제할 예매 정보가 없습니다.');
        return;
    }

    setIsProcessing(true);
    setError(null);
    const token = localStorage.getItem('jwtToken');

    fetch('http://localhost:8080/api/payment/process', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ bookingId: booking.bookingId })
    })
    .then(res => {
        if (!res.ok) {
            return res.json().then(err => { throw new Error(err.message || '결제 처리 중 오류가 발생했습니다.') });
        }
        return res.json();
    })
    .then(confirmedBooking => {
        navigate('/check'); // 결제 완료 후 바로 예매 내역 페이지로 이동
    })
    .catch(err => {
        console.error("Payment error:", err);
        setError(err.message);
    })
    .finally(() => {
        setIsProcessing(false);
    });
  };

  if (!booking) {
    return (
        <div style={styles.body}>
            <h1 style={styles.title}>잘못된 접근입니다.</h1>
            <p>예매 정보가 없습니다. 예매 페이지로 돌아가세요.</p>
            <button onClick={() => navigate('/trainbooking')}>기차 예매로 돌아가기</button>
        </div>
    );
  }

  return (
    <div style={styles.body}>
      <button style={styles.logoutButton} onClick={handleLogout}>로그아웃</button>

      <div style={styles.titleContainer}>
        <img src={logo} alt="손에딱 로고" style={styles.logo} />
        <h1 style={styles.title}>결제 화면</h1>
      </div>

      <div style={styles.paymentBox}>
        <div style={styles.sectionTitle}>결제 정보 확인</div>
        <p style={styles.infoText}>구간: {booking.origin} → {booking.destination}</p>
        <p style={styles.infoText}>열차: {booking.trainNumber}</p>
        <p style={styles.infoText}>출발: {new Date(booking.departureTime).toLocaleString()}</p>
        <p style={styles.priceText}>결제할 금액: {booking.price.toLocaleString()}원</p>
        
        <div style={styles.buttonGroup}>
            <button style={styles.payBtn} onClick={handlePayment} disabled={isProcessing}>
            {isProcessing ? '결제 처리 중...' : '결제하기'}
            </button>
            <button style={styles.cancelBtn} onClick={() => navigate('/trainbooking')} disabled={isProcessing}>
            취소
            </button>
        </div>

        {error && <p style={styles.errorMessage}>{error}</p>}
      </div>
    </div>
  );
}

const newStyles = {
    buttonGroup: {
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
        marginTop: '30px',
        alignItems: 'center', // ✅ 버튼 높이 정렬
    },
    cancelBtn: {
        width: '350px',
        height: '100px',
        backgroundColor: '#6c757d',
        color: 'white',
        fontSize: '36px',
        fontWeight: 'bold',
        borderRadius: '20px',
        border: 'none',
        cursor: 'pointer',
    },
};

Object.assign(styles, newStyles);

export default PaymentScreen;
