import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// 기존 컴포넌트들
import MainPage from './components/MainPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import TrainBooking from './components/TrainBooking';
import TrainBooking_Voice from './components/TrainBooking_Voice';
import TrainBooking_Chat from './components/TrainBooking_Chat';
import BusBooking from './components/BusBooking';
import BusBooking_Voice from './components/BusBooking_Voice';
import BusBooking_Chat from './components/BusBooking_Chat';
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
        <Route path="/trainbooking_voice" element={<TrainBooking_Voice />} />
        <Route path="/trainbooking_chat" element={<TrainBooking_Chat />} />

        {/* 버스 예매 관련 */}
        <Route path="/busbooking" element={<BusBooking />} />
        <Route path="/busbooking_voice" element={<BusBooking_Voice />} />
        <Route path="/busbooking_chat" element={<BusBooking_Chat />} />

        {/* 승차권 확인 */}
        <Route path="/check" element={<TicketCheck />} />

        {/* 결제 관련 */}
        <Route path="/payment" element={<PaymentScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;