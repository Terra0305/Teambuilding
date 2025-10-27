const chatHistory = document.getElementById('chat-history');
const chatForm = document.getElementById('chat-form');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const voiceButton = document.getElementById('voice-button');
const voiceStatus = document.getElementById('voice-status');
const loginStatusDiv = document.getElementById('login-status');
const authButton = document.getElementById('auth-btn');
const clearButton = document.getElementById('clear-btn');
const searchTrainsBtn = document.getElementById('search-trains-btn');
const myBookingsBtn = document.getElementById('my-bookings-btn');

// 음성 인식 설정
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;
let isRecording = false;

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.lang = 'ko-KR';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
        isRecording = true;
        voiceButton.classList.add('recording');
        voiceStatus.textContent = '🎤 음성 인식 중... 말씀해주세요!';
        voiceStatus.classList.add('recording');
    };

    recognition.onend = () => {
        isRecording = false;
        voiceButton.classList.remove('recording');
        voiceStatus.textContent = '';
        voiceStatus.classList.remove('recording');
    };

    recognition.onerror = (event) => {
        isRecording = false;
        voiceButton.classList.remove('recording');
        voiceStatus.textContent = '❌ 음성 인식 오류: ' + event.error;
        voiceStatus.classList.remove('recording');
        setTimeout(() => { voiceStatus.textContent = ''; }, 3000);
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        messageInput.value = transcript;
        voiceStatus.textContent = '✅ 인식 완료! 전송 버튼을 눌러주세요.';
        voiceStatus.classList.remove('recording');
        setTimeout(() => { voiceStatus.textContent = ''; }, 3000);
        messageInput.focus();
    };

    voiceButton.addEventListener('click', () => {
        if (isRecording) {
            recognition.stop();
        } else {
            recognition.start();
        }
    });
} else {
    voiceButton.disabled = true;
    voiceButton.style.backgroundColor = '#ccc';
    voiceButton.title = '이 브라우저는 음성 인식을 지원하지 않습니다';
}

searchTrainsBtn.addEventListener('click', () => {
    document.getElementById('trains-modal').style.display = 'block';
    document.getElementById('date-input').value = new Date().toISOString().split('T')[0];
});

myBookingsBtn.addEventListener('click', async () => {
    const token = localStorage.getItem('jwt-token');
    if (!token) {
        alert('로그인이 필요합니다.');
        return;
    }
    document.getElementById('bookings-modal').style.display = 'block';
    await fetchBookings();
});

function closeTrainsModal() {
    document.getElementById('trains-modal').style.display = 'none';
}

function closeBookingsModal() {
    document.getElementById('bookings-modal').style.display = 'none';
}

window.onclick = (event) => {
    const trainsModal = document.getElementById('trains-modal');
    const bookingsModal = document.getElementById('bookings-modal');
    if (event.target === trainsModal) closeTrainsModal();
    if (event.target === bookingsModal) closeBookingsModal();
};

async function searchTrains() {
    const origin = document.getElementById('origin-input').value.trim();
    const destination = document.getElementById('destination-input').value.trim();
    const date = document.getElementById('date-input').value;

    if (!origin || !destination || !date) {
        alert('출발지, 도착지, 날짜를 모두 입력해주세요.');
        return;
    }

    const resultDiv = document.getElementById('trains-result');
    resultDiv.innerHTML = '<p class="no-data">🔍 검색 중...</p>';

    try {
        const response = await fetch(`/api/trains?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&date=${date}`);
        if (!response.ok) throw new Error('기차 조회 실패');
        const trains = await response.json();
        displayTrains(trains);
    } catch (error) {
        console.error('기차 조회 오류:', error);
        resultDiv.innerHTML = `<p class="no-data">❌ 기차 정보 조회 중 오류가 발생했습니다.</p>`;
    }
}

function displayTrains(trains) {
    const resultDiv = document.getElementById('trains-result');
    
    if (!trains || trains.length === 0) {
        resultDiv.innerHTML = '<p class="no-data">해당 조건의 기차를 찾을 수 없습니다.</p>';
        return;
    }

    const table = `<table class="data-table"><thead><tr><th>기차 번호</th><th>출발지</th><th>도착지</th><th>출발 시간</th><th>도착 시간</th><th>가격</th><th>예매</th></tr></thead><tbody>${trains.map(train => `<tr><td>${train.trainNumber}</td><td>${train.origin}</td><td>${train.destination}</td><td>${formatDateTime(train.departureTime)}</td><td>${formatDateTime(train.arrivalTime)}</td><td>${train.price.toLocaleString()}원</td><td><button class="action-btn reserve-btn" onclick="reserveTrain(${train.id}, '${train.trainNumber}')">예매하기</button></td></tr>`).join('')}</tbody></table>`;
    resultDiv.innerHTML = table;
}

async function fetchBookings() {
    const token = localStorage.getItem('jwt-token');
    const resultDiv = document.getElementById('bookings-result');
    resultDiv.innerHTML = '<p class="no-data">🔍 불러오는 중...</p>';

    try {
        const response = await fetch('/api/my-bookings', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.status === 401) {
            alert('인증이 필요합니다. 다시 로그인해주세요.');
            localStorage.removeItem('jwt-token');
            window.location.href = '/login';
            return;
        }

        if (!response.ok) throw new Error('예매 내역 조회 실패');
        const bookings = await response.json();
        displayBookings(bookings);
    } catch (error) {
        console.error('예매 내역 조회 오류:', error);
        resultDiv.innerHTML = '<p class="no-data">❌ 예매 내역 조회 중 오류가 발생했습니다.</p>';
    }
}

function displayBookings(bookings) {
    const resultDiv = document.getElementById('bookings-result');
    
    if (!bookings || bookings.length === 0) {
        resultDiv.innerHTML = '<p class="no-data">예매 내역이 없습니다.</p>';
        return;
    }

    const html = bookings.map(booking => `<div class="booking-item"><div class="booking-header"><div class="booking-id">예매 번호: ${booking.bookingId}</div><div class="booking-status" style="color: ${booking.status === 'CANCELED' ? '#f44336' : '#28a745'};">${booking.status === 'CANCELED' ? '예매 취소됨' : '예매 완료'}</div></div><div class="booking-details"><div><span>출발:</span> ${booking.origin}</div><div><span>도착:</span> ${booking.destination}</div><div><span>출발 시간:</span> ${formatDateTime(booking.departureTime)}</div><div><span>도착 시간:</span> ${formatDateTime(booking.arrivalTime)}</div><div><span>열차 번호:</span> ${booking.trainNumber}</div><div><span>가격:</span> ${booking.price.toLocaleString()}원</div></div><button class="action-btn cancel-btn" onclick="cancelBooking(${booking.bookingId})" ${booking.status === 'CANCELED' ? 'disabled' : ''}>${booking.status === 'CANCELED' ? '취소됨' : '예매 취소'}</button></div>`).join('');
    resultDiv.innerHTML = html;
}

function formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    return date.toLocaleString('ko-KR', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
}

async function reserveTrain(trainId, trainNumber) {
    const token = localStorage.getItem('jwt-token');
    if (!token) {
        alert('로그인이 필요합니다.');
        window.location.href = '/login';
        return;
    }

    if (!confirm(`${trainNumber} 기차를 예매하시겠습니까?`)) return;

    try {
        const response = await fetch('/api/bookings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ trainId: trainId })
        });

        if (response.status === 401) {
            alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
            localStorage.removeItem('jwt-token');
            window.location.href = '/login';
            return;
        }

        if (!response.ok) throw new Error('예매 실패');

        const booking = await response.json();
        alert(`예매가 완료되었습니다!\n예매번호: ${booking.id}`);
        closeTrainsModal();
        
        if (confirm('예매 내역을 확인하시겠습니까?')) {
            document.getElementById('bookings-modal').style.display = 'block';
            await fetchBookings();
        }
    } catch (error) {
        console.error('예매 오류:', error);
        alert('예매 중 오류가 발생했습니다: ' + error.message);
    }
}

async function cancelBooking(bookingId) {
    if (!confirm('정말로 예매를 취소하시겠습니까?')) return;

    const token = localStorage.getItem('jwt-token');
    if (!token) {
        alert('로그인이 필요합니다.');
        window.location.href = '/login';
        return;
    }

    try {
        const response = await fetch(`/api/bookings/${bookingId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.status === 401) {
            alert('인증이 필요합니다. 다시 로그인해주세요.');
            localStorage.removeItem('jwt-token');
            window.location.href = '/login';
            return;
        }

        if (!response.ok) throw new Error('예매 취소 실패');

        alert('예매가 성공적으로 취소되었습니다.');
        await fetchBookings();
    } catch (error) {
        console.error('예매 취소 오류:', error);
        alert('예매 취소 중 오류가 발생했습니다: ' + error.message);
    }
}

window.addEventListener('load', async () => {
    const token = localStorage.getItem('jwt-token');

    if (token) {
        authButton.textContent = '로그아웃';
        authButton.addEventListener('click', () => {
            localStorage.removeItem('jwt-token');
            alert('로그아웃 되었습니다.');
            window.location.href = '/';
        });
        // 대화 내역 불러오기
        await loadChatHistory();
    } else {
        authButton.textContent = '로그인';
        authButton.addEventListener('click', () => {
            window.location.href = '/login';
        });
    }

    if (!token) {
        loginStatusDiv.style.display = 'block';
        loginStatusDiv.innerHTML = '채팅을 이용하려면 로그인이 필요합니다. <a href="/login">로그인</a>';
        messageInput.disabled = true;
        sendButton.disabled = true;
        clearButton.disabled = true;
        voiceButton.disabled = true;
        searchTrainsBtn.disabled = true;
        myBookingsBtn.disabled = true;
        return;
    }
});

async function loadChatHistory() {
    const token = localStorage.getItem('jwt-token');
    if (!token) return;

    try {
        const response = await fetch('/api/chatbot/history', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error('대화 내역을 불러오는데 실패했습니다.');
        }

        const result = await response.json();
        if (result.success && result.history) {
            chatHistory.innerHTML = ''; // 기존 내역 초기화
            result.history.forEach(msg => {
                // 백엔드에서 이미 텍스트를 가공했으므로 바로 사용
                addMessageToHistory(msg.role, msg.content);
            });
        }
    } catch (error) {
        console.error('History loading error:', error);
        addMessageToHistory('bot', `오류: ${error.message}`);
    }
}

clearButton.addEventListener('click', async () => {
    const token = localStorage.getItem('jwt-token');
    if (!token) {
        alert('로그인이 필요합니다.');
        return;
    }

    if (confirm('대화 히스토리를 초기화하시겠습니까?')) {
        try {
            const response = await fetch('/api/chatbot/clear', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const result = await response.json();
            
            if (result.success) {
                chatHistory.innerHTML = '';
                alert(result.message);
            } else {
                alert('초기화 실패: ' + result.message);
            }
        } catch (error) {
            console.error('초기화 오류:', error);
            alert('오류가 발생했습니다.');
        }
    }
});

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const content = messageInput.value.trim();
    if (!content) return;
    
    const token = localStorage.getItem('jwt-token');
    if (!token) {
        alert('로그인이 필요합니다.');
        window.location.href = '/login';
        return;
    }

    addMessageToHistory('user', content);
    messageInput.value = '';
    
    sendButton.disabled = true;
    sendButton.textContent = '전송 중...';
    voiceButton.disabled = true;

    const loadingMsg = addMessageToHistory('bot', '답변 생성 중...');
    loadingMsg.classList.add('loading');

    try {
        const response = await fetch('/api/chatbot/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ message: content })
        });

        try {
            if (loadingMsg && loadingMsg.parentNode === chatHistory) {
                chatHistory.removeChild(loadingMsg);
            }
        } catch (e) {
            console.log('로딩 메시지 제거 실패 (무시 가능):', e);
        }

        if (!response.ok) {
            if (response.status === 401) {
                alert('세션이 만료되었습니다. 다시 로그인해주세요.');
                localStorage.removeItem('jwt-token');
                window.location.href = '/login';
                return;
            }
            throw new Error('메시지 전송 실패');
        }

        const result = await response.json();
        
        if (result.success) {
            addMessageToHistory('bot', result.message);
        } else {
            addMessageToHistory('bot', '오류: ' + result.message);
        }
    } catch (error) {
        console.error('전송 오류:', error);
        
        try {
            if (loadingMsg && loadingMsg.parentNode === chatHistory) {
                chatHistory.removeChild(loadingMsg);
            }
        } catch (e) {
            console.log('로딩 메시지 제거 실패 (무시 가능):', e);
        }
        
        addMessageToHistory('bot', `오류: ${error.message}`);
    } finally {
        sendButton.disabled = false;
        sendButton.textContent = '전송';
        const token = localStorage.getItem('jwt-token');
        if (token) {
            voiceButton.disabled = false;
        }
    }
});

function addMessageToHistory(sender, content) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(sender === 'user' ? 'user-message' : 'bot-message');
    messageDiv.textContent = content;
    chatHistory.appendChild(messageDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;
    return messageDiv;
}
