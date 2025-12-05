import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import logo from '../logo.png';
import voiceIcon from '../images/voice.png';

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
        backgroundColor: '#f8f8f8',
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
    chatBox: {
        flex: 1,
        width: '90%',
        maxWidth: '900px',
        backgroundColor: 'white',
        borderRadius: '20px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
        padding: '20px',
        overflowY: 'auto',
        marginBottom: '20px',
    },
    messageContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    userMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#4caf50', // 버스 예매는 초록색 계열
        color: 'white',
        padding: '14px 20px',
        borderRadius: '20px',
        maxWidth: '70%',
        wordWrap: 'break-word',
    },
    botMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#e0e0e0',
        color: '#333',
        padding: '14px 20px',
        borderRadius: '20px',
        maxWidth: '70%',
        wordWrap: 'break-word',
    },
    inputArea: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '90%',
        maxWidth: '900px',
        marginBottom: '30px',
        gap: '20px',
    },
    smallButton: {
        padding: '16px 30px',
        fontSize: '20px',
        fontWeight: 'bold',
        borderRadius: '20px',
        border: 'none',
        cursor: 'pointer',
        color: 'white',
        height: '80px',
        whiteSpace: 'nowrap',
    },
    homeButton: {
        backgroundColor: '#FFC700',
        color: 'white',
    },
    micButton: {
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        backgroundColor: '#ff4444',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
    },
    micIcon: {
        width: '40px',
        height: '40px',
        filter: 'invert(1)', // 흰색 아이콘으로 만들기
    },
    statusText: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#555',
    }
};

function BusBooking_Voice() {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([
        { from: 'bot', text: '안녕하세요! 음성으로 버스 예매를 도와드릴게요. 마이크 버튼을 누르고 말씀해주세요. 🎤' },
    ]);
    const [isListening, setIsListening] = useState(false);

    const handleLogout = () => {
        localStorage.setItem('isLoggedIn', 'false');
        navigate('/login');
    };

    const handleMicClick = () => {
        if (isListening) {
            setIsListening(false);
            window.speechSynthesis.cancel();
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert('이 브라우저는 음성 인식을 지원하지 않습니다. 크롬 브라우저를 사용해주세요.');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'ko-KR';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            setIsListening(true);
            setMessages(prev => [...prev, { from: 'bot', text: '듣고 있어요... 말씀해주세요!' }]);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            console.log('음성 인식 결과:', transcript);

            setMessages(prev => [...prev, { from: 'user', text: transcript }]);

            setTimeout(() => {
                setMessages(prev => [...prev, { from: 'bot', text: `"${transcript}"라고 말씀하셨군요. 예매를 진행해드릴까요?` }]);
            }, 1000);
        };

        recognition.onerror = (event) => {
            console.error('음성 인식 에러:', event.error);
            setIsListening(false);
            setMessages(prev => [...prev, { from: 'bot', text: '죄송해요, 잘 못 들었어요. 다시 말씀해 주시겠어요?' }]);
        };

        recognition.start();
    };

    return (
        <div style={styles.body}>
            <button style={styles.logoutButton} onClick={handleLogout}>
                로그아웃
            </button>

            <div style={styles.titleContainer}>
                <img src={logo} alt="손에딱 로고" style={styles.titleImg} />
                <h1 style={styles.h1}>버스예매(음성)</h1>
            </div>

            <div style={styles.chatBox}>
                <div style={styles.messageContainer}>
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            style={msg.from === 'user' ? styles.userMessage : styles.botMessage}
                        >
                            {msg.text}
                        </div>
                    ))}
                </div>
            </div>

            <div style={styles.inputArea}>
                <button
                    style={{ ...styles.smallButton, ...styles.homeButton }}
                    onClick={() => navigate('/')}
                >
                    홈
                </button>

                <button
                    style={{
                        ...styles.micButton,
                        backgroundColor: isListening ? '#ff0000' : '#ff4444',
                        transform: isListening ? 'scale(1.1)' : 'scale(1)'
                    }}
                    onClick={handleMicClick}
                >
                    <img src={voiceIcon} alt="마이크" style={styles.micIcon} />
                </button>

                <span style={styles.statusText}>
                    {isListening ? "듣는 중..." : "터치하여 말하기"}
                </span>
            </div>
        </div>
    );
}

export default BusBooking_Voice;
