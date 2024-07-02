import React from 'react';
import { useNavigate } from 'react-router-dom';

const HeaderComponent = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/');
  };

  return (
    <header className="header">
      <div className="user-info">
        <span>Львівський державний університет безпеки життєдіяльності</span>
        <button id="logout-button" onClick={handleLogout}>Вихід</button>
      </div>
    </header>
  );
};

export default HeaderComponent;
