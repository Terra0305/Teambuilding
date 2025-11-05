import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import logo from '../logo.png';
import callIcon from '../images/voice.png';

// Web Speech API 인스턴스 초기화
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;
if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.continuous = true; // 지속적으로 음성을 인식
  recognition.lang = 'ko-KR';
  recognition.interimResults = true; // 중간 결과도 받음
} else {
  console.log('Browser does not support SpeechRecognition.');
}

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
    marginTop: '20px',
    marginBottom: '10px',
  },
  titleImg: {
    width: '70px',
    height: '70px',
  },
  h1: {
    fontSize: '60px',
    fontWeight: 900,
    color: '#333',
    textAlign: 'center',
    margin: 0,
  },
  conversationBox: {
    flex: 1,
    width: '90%',
    maxWidth: '800px',
    backgroundColor: 'white',
    borderRadius: '20px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
    padding: '20px',
    overflowY: 'auto',
    marginBottom: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#0ACF83',
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
  micButton: {
    width: '150px',
    height: '150px',
    backgroundColor: 'white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, background-color 0.3s',
    marginTop: '20px',
    border: '5px solid #ccc',
  },
  micIcon: {
    width: '90px',
    height: '90px',
    objectFit: 'contain',
  },
  infoText: {
    marginTop: '10px',
    fontSize: '24px',
    color: '#555',
    height: '30px',
  },
  homeBtn: {
    width: '300px',
    height: '80px',
    backgroundColor: '#FFC700',
    color: 'white',
    fontSize: '30px',
    marginTop: '20px',
    marginBottom: '20px',
    borderRadius: '20px',
    border: 'none',
    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
    cursor: 'pointer',
  },
};

function BusBookingVoice() {
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [isSending, setIsSending] = useState(false); // 챗봇 응답 대기 중 상태
  const [messages, setMessages] = useState([]);
  const [interimTranscript, setInterimTranscript] = useState('');
  const finalTranscript = useRef('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(scrollToBottom, [messages]);

  // 음성 합성 (TTS) 함수
  const speak = (text) => {
    window.speechSynthesis.cancel(); // 이전 음성 출력을 중지합니다.
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    window.speechSynthesis.speak(utterance);
  };

  // 백엔드 챗봇 API 호출
  const sendToBot = useCallback((text) => {
    setIsSending(true);
    setInterimTranscript('');
    const token = localStorage.getItem('jwtToken');

    // 메시지 파싱 로직 추가
    const handleBotResponse = (data) => {
      try {
        const response = JSON.parse(data.message);
        if (response.action === 'INITIATE_PAYMENT') {
          const potentialBookingId = response.trainId; // trainId가 실제로는 bookingId일 것으로 가정

          // 내 예매 목록에서 해당 예매 찾기
          fetch(`${process.env.REACT_APP_API_URL}/api/my-bookings`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
          .then(res => res.json())
          .then(bookings => {
            const bookingToPay = bookings.find(b => b.bookingId === potentialBookingId);
            if (bookingToPay) {
              navigate('/payment', { state: { booking: bookingToPay } });
            } else {
              const errorMsg = { from: 'bot', text: '결제할 예매 정보를 찾지 못했습니다.' };
              setMessages(prev => [...prev, errorMsg]);
              speak(errorMsg.text);
            }
          })
          .catch(err => {
            console.error("Error fetching bookings:", err);
            const errorMsg = { from: 'bot', text: '예매 정보를 가져오는 중 오류가 발생했습니다.' };
            setMessages(prev => [...prev, errorMsg]);
            speak(errorMsg.text);
          });

        } else {
          // action이 다르거나 없는 경우, 그냥 메시지 표시
          const botMessage = { from: 'bot', text: data.message };
          setMessages(prev => [...prev, botMessage]);
          speak(data.message);
        }
      } catch (e) {
        // JSON 파싱 실패 시, 일반 텍스트 메시지로 처리
        const botMessage = { from: 'bot', text: data.message };
        setMessages(prev => [...prev, botMessage]);
        speak(data.message);
      }
    };

    fetch(`${process.env.REACT_APP_API_URL}/api/chatbot/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ message: text }),
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        handleBotResponse(data);
      } else {
        let errorMessageText = `오류: ${data.message}`;
        if (data.message && data.message.includes('429')) {
            errorMessageText = '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.';
        }
        const errorMessage = { from: 'bot', text: errorMessageText };
        setMessages(prev => [...prev, errorMessage]);
        speak(errorMessageText);
      }
    })
    .catch(error => {
      console.error("Chat API error:", error);
      const errorMessage = { from: 'bot', text: '챗봇 서버와 통신에 실패했습니다.' };
      setMessages(prev => [...prev, errorMessage]);
      speak('챗봇 서버와 통신에 실패했습니다.');
    })
    .finally(() => {
        setIsSending(false);
    });
  }, [navigate]);

  // 음성 인식 시작/중지 토글
  const toggleListening = () => {
    if (!recognition || isSending) return; // 처리 중에는 새 음성 입력 방지

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  useEffect(() => {
    if (!recognition) return;

    recognition.onstart = () => {
      finalTranscript.current = '';
      setInterimTranscript('');
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
      const transcript = finalTranscript.current.trim();
      if (transcript) {
        const userMessage = { from: 'user', text: transcript };
        setMessages(prev => [...prev, userMessage]);
        sendToBot(transcript);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };

    recognition.onresult = (event) => {
      let interim = '';
      let final = '';
      for (let i = 0; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript;
        } else {
          interim += transcript;
        }
      }
      finalTranscript.current = final;
      setInterimTranscript(interim);
    };

    // 초기 메시지 설정
    const initialBotMessage = { from: 'bot', text: '안녕하세요! 음성으로 버스 예매를 도와드릴게요. 아래 버튼을 누르고 말씀해주세요. 🚌' };
    setMessages([initialBotMessage]);
    speak(initialBotMessage.text);

    return () => {
      recognition.abort();
    }
  }, [sendToBot]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('jwtToken');
    navigate('/login');
  };

  const handleBack = () => {
    window.speechSynthesis.cancel(); // 페이지 나갈 때 음성 중지
    navigate('/busbooking');
  };

  return (
    <div style={styles.body}>
      <button style={styles.backButton} onClick={handleBack}>뒤로가기</button>
      <button style={styles.logoutButton} onClick={handleLogout}>로그아웃</button>

      <div style={styles.titleContainer}>
        <img src={logo} alt="손에딱 로고" style={styles.titleImg} />
        <h1 style={styles.h1}>버스 음성 예매</h1>
      </div>

      {/* 대화 내용 */}
      <div style={styles.conversationBox}>
        {messages.map((msg, idx) => (
          <div key={idx} style={msg.from === 'user' ? styles.userMessage : styles.botMessage}>
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 안내 문구 */}
      <p style={styles.infoText}>
        {isSending ? '처리 중...' : isListening ? (interimTranscript || '듣고 있어요...') : '버튼을 누르고 말씀해주세요'}
      </p>

      {/* 마이크 버튼 */}
      <div style={{...styles.micButton, backgroundColor: isListening ? '#ff4444' : 'white', cursor: isSending ? 'not-allowed' : 'pointer'}} onClick={toggleListening}>
        <img src={callIcon} alt="음성 아이콘" style={styles.micIcon} />
      </div>

      <button style={styles.homeBtn} onClick={() => { window.speechSynthesis.cancel(); navigate('/'); }}>
        홈으로 돌아가기
      </button>
    </div>
  );
}

export default BusBookingVoice;
