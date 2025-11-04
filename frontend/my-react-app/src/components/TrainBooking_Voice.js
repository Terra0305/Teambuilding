import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import logo from '../logo.png';
import callIcon from '../images/voice.png';

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

function TrainBooking_Voice() {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState([]);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(scrollToBottom, [messages]);

  const speak = (text) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    window.speechSynthesis.speak(utterance);
  };

  const sendToBot = (text) => {
    const userMessage = { from: 'user', text };
    setMessages(prev => [...prev, userMessage]);
    setIsSending(true);
    const token = localStorage.getItem('jwtToken');

    const handleBotResponse = (data) => {
      const botText = data.message;

      const botMessage = { from: 'bot', text: botText };
      setMessages(prev => [...prev, botMessage]);
      speak(botText);

      if (botText && botText.trim() === '예매가 완료되었습니다. 결제를 진행합니다.') {
        const token = localStorage.getItem('jwtToken');
        
        fetch('http://localhost:8080/api/my-bookings', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(bookings => {
          const sortedBookings = bookings.sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate));
          const mostRecentBooking = sortedBookings.length > 0 ? sortedBookings[0] : null;

          if (mostRecentBooking) {
            navigate('/payment', { state: { booking: mostRecentBooking } });
          } else {
            const errorMsg = { from: 'bot', text: '최근 예매 정보를 찾지 못했습니다. 마이페이지에서 확인해주세요.' };
            setMessages(prev => [...prev, errorMsg]);
            speak(errorMsg.text);
          }
        })
        .catch(err => {
          console.error("Error fetching bookings for payment:", err);
          const errorMsg = { from: 'bot', text: '예매 정보를 가져오는 중 오류가 발생했습니다.' };
          setMessages(prev => [...prev, errorMsg]);
          speak(errorMsg.text);
        });
      }
    };

    fetch('http://localhost:8080/api/chatbot/chat', {
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
  };

  const handleStartRecording = () => {
    if (isRecording || isSending) return;

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const options = { mimeType: 'audio/webm;codecs=opus' };
        mediaRecorder.current = new MediaRecorder(stream, options);
        mediaRecorder.current.start();
        audioChunks.current = [];

        mediaRecorder.current.ondataavailable = event => {
          audioChunks.current.push(event.data);
        };

        mediaRecorder.current.onstop = () => {
          const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
          console.log("Created audio blob:", audioBlob); // DEBUG LOG
          sendAudioToBackend(audioBlob);
        };

        setIsRecording(true);
      })
      .catch(err => console.error("Error getting media stream:", err));
  };

  const handleStopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };

  const sendAudioToBackend = (audioBlob) => {
    setIsSending(true);
    const formData = new FormData();
    formData.append("audio", audioBlob);

    const token = localStorage.getItem('jwtToken');

    fetch("http://localhost:8080/api/speech-to-text", {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    })
    .then(response => response.json())
    .then(data => {
      if (data.text) {
        sendToBot(data.text);
      } else {
        throw new Error(data.error || "Transcription failed");
      }
    })
    .catch(error => {
      console.error("Speech-to-text error:", error);
      const errorMessage = { from: 'bot', text: '음성 인식에 실패했습니다. 다시 시도해주세요.' };
      setMessages(prev => [...prev, errorMessage]);
      speak(errorMessage.text);
    })
    .finally(() => {
      setIsSending(false);
    });
  };

  useEffect(() => {
    const initialBotMessage = { from: 'bot', text: '안녕하세요! 음성으로 기차 예매를 도와드릴게요. 아래 버튼을 누르고 녹음을 시작해주세요. 🚆' };
    setMessages([initialBotMessage]);
    speak(initialBotMessage.text);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('jwtToken');
    navigate('/login');
  };

  const handleBack = () => {
    window.speechSynthesis.cancel();
    navigate('/trainbooking');
  };

  return (
    <div style={styles.body}>
      <button style={styles.backButton} onClick={handleBack}>뒤로가기</button>
      <button style={styles.logoutButton} onClick={handleLogout}>로그아웃</button>

      <div style={styles.titleContainer}>
        <img src={logo} alt="손에딱 로고" style={styles.titleImg} />
        <h1 style={styles.h1}>기차 음성 예매</h1>
      </div>

      <div style={styles.conversationBox}>
        {messages.map((msg, idx) => (
          <div key={idx} style={msg.from === 'user' ? styles.userMessage : styles.botMessage}>
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <p style={styles.infoText}>
        {isSending ? '처리 중...' : isRecording ? '녹음 중... 다시 누르면 중지됩니다.' : '버튼을 누르고 녹음을 시작하세요'}
      </p>

      <div 
        style={{...styles.micButton, backgroundColor: isRecording ? '#ff4444' : 'white', cursor: isSending ? 'not-allowed' : 'pointer'}} 
        onClick={isRecording ? handleStopRecording : handleStartRecording}
      >
        <img src={callIcon} alt="음성 아이콘" style={styles.micIcon} />
      </div>

      <button style={styles.homeBtn} onClick={() => { window.speechSynthesis.cancel(); navigate('/'); }}>
        홈으로 돌아가기
      </button>
    </div>
  );
}

export default TrainBooking_Voice;
