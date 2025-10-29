import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const styles = {
  body: {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f4f4f4',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    margin: 0,
  },
  loginContainer: {
    backgroundColor: '#fff',
    padding: '20px 40px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    width: '300px',
    textAlign: 'center',
  },
  brandTitle: {
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  brandLink: {
    textDecoration: 'none',
    color: '#333',
    fontSize: 'inherit',
  },
  formGroup: {
    marginBottom: '15px',
    textAlign: 'left',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#555',
    fontSize: '13px',
  },
  input: {
    width: 'calc(100% - 22px)',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
  },
  submitInput: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '10px 15px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    width: '100%',
    transition: 'background-color 0.3s ease',
  },
  homeButton: {
    backgroundColor: '#00d5ffff',  // 파란색 (회원가입 버튼과 구분)
    color: 'white',
    padding: '10px 15px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    width: '100%',
    transition: 'background-color 0.3s ease',
    marginTop: '10px', // 로그인 버튼 아래 간격
  },
  registerLink: {
    marginTop: '20px',
    fontSize: '14px',
    color: '#555',
  },
  registerLinkA: {
    color: '#21CF0A',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  messageDiv: {
    marginTop: '15px',
    fontWeight: 'bold',
  },
};

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    setMessage('로그인 중...');

    // 가상의 로그인 API 호출
    fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then(response => {
        if (response.ok) return response.json();
        throw new Error('서버 응답에 실패했습니다.');
      })
      .then(data => {
        console.log('서버로부터 받은 데이터:', data);
        setMessage(`'${username}'님, 로그인에 성공했습니다!`);
        localStorage.setItem('isLoggedIn', 'true');
        navigate('/');
      })
      .catch(error => {
        console.error('로그인 요청 에러:', error);
        setMessage('로그인에 실패했습니다. 아이디나 비밀번호를 확인해주세요.');
      });
  };

  return (
    <div style={styles.body}>
      <div style={styles.loginContainer}>
        <h1 style={styles.brandTitle}>
          <a href="/" style={styles.brandLink}>손에딱</a>
        </h1>

        <form id="login-form" onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="username">아이디:</label>
            <input
              style={styles.input}
              type="text"
              id="username"
              name="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="password">비밀번호:</label>
            <input
              style={styles.input}
              type="password"
              id="password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div style={styles.formGroup}>
            <input
              style={styles.submitInput}
              type="submit"
              value="로그인"
            />
          </div>
        </form>

        {/* ✅ 홈으로 돌아가기 버튼 추가 */}
        <button
          style={styles.homeButton}
          onClick={() => navigate('/')}
        >
          홈으로 돌아가기
        </button>

        <div id="login-message" style={styles.messageDiv}>{message}</div>

        <div style={styles.registerLink}>
          <p>계정이 없으신가요? <a href="/register" style={styles.registerLinkA}>회원가입</a></p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
