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
  registerContainer: {
    backgroundColor: '#fff',
    padding: '20px 40px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    width: '350px',
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
    backgroundColor: '#28a745',
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
    marginTop: '10px',  // 회원가입 버튼 아래 간격
  },
  messageDiv: {
    marginTop: '15px',
    fontWeight: 'bold',
    color: '#d9534f',
  },
  loginLink: {
    marginTop: '20px',
    fontSize: '14px',
    color: '#555',
  },
  loginLinkA: {
    color: '#007bff',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
};

function RegisterPage() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState(''); // 아이디
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setMessage('비밀번호가 일치하지 않습니다.');
      return;
    }

    setMessage('회원가입 중...');

    fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name,
        username: username,
        password: password,
        passwordConfirm: confirmPassword,
      }),
    })
      .then(response => {
        return response.json().then(data => {
          if (!response.ok) {
            throw new Error(data.message || '서버 응답에 실패했습니다.');
          }
          return data;
        });
      })
      .then(data => {
        console.log('서버로부터 받은 데이터:', data);
        setMessage(`'${name}'님, 회원가입에 성공했습니다!`);
        // 성공 후 로그인 페이지로 이동
        navigate('/login');
      })
      .catch(error => {
        console.error('회원가입 요청 에러:', error);
        setMessage(error.message || '회원가입에 실패했습니다. 다시 시도해주세요.');
      });
  };

  return (
    <div style={styles.body}>
      <div style={styles.registerContainer}>
        <h1 style={styles.brandTitle}>
          <a href="/" style={styles.brandLink}>손에딱</a>
        </h1>

        <form id="register-form" onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="name">사용자 이름:</label>
            <input
              style={styles.input}
              type="text"
              id="name"
              name="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
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
            <label style={styles.label} htmlFor="confirmPassword">비밀번호 확인:</label>
            <input
              style={styles.input}
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div style={styles.formGroup}>
            <input
              style={styles.submitInput}
              type="submit"
              value="회원가입"
            />
          </div>
        </form>

        {/* 홈으로 돌아가기 버튼 */}
        <button
          style={styles.homeButton}
          onClick={() => navigate('/')}
        >
          홈으로 돌아가기
        </button>

        <div id="register-message" style={styles.messageDiv}>{message}</div>

        <div style={styles.loginLink}>
          <p>이미 계정이 있으신가요? <a href="/login" style={styles.loginLinkA}>로그인</a></p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;