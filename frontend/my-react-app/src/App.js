import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// 기존 컴포넌트들
import MainPage from './components/MainPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import TrainBooking from './components/TrainBooking';
import TrainBookingVoice from './components/TrainBookingVoice';
import TrainBookingChat from './components/TrainBookingChat';
import BusBooking from './components/BusBooking';
import BusBookingVoice from './components/BusBookingVoice';
import BusBookingChat from './components/BusBookingChat';
import TicketCheck from './components/TicketCheck';

// ✅ 새로 추가한 결제 관련 컴포넌트
import PaymentScreen from './components/PaymentScreen';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 메인 페이지 */}
        <Route path="/" element={<MainPage />} />

        {/* 로그인 및 회원가입 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* 기차 예매 관련 */}
        <Route path="/trainbooking" element={<TrainBooking />} />
        <Route path="/trainbooking-voice" element={<TrainBookingVoice />} />
        <Route path="/trainbooking-chat" element={<TrainBookingChat />} />

        {/* 버스 예매 관련 */}
        <Route path="/busbooking" element={<BusBooking />} />
        <Route path="/busbooking-voice" element={<BusBookingVoice />} />
        <Route path="/busbooking-chat" element={<BusBookingChat />} />

        {/* 승차권 확인 */}
        <Route path="/check" element={<TicketCheck />} />

        {/* 결제 관련 */}
        <Route path="/payment" element={<PaymentScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;