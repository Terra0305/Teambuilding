import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // 필요에 따라 index.css 파일도 생성해야 합니다.

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
