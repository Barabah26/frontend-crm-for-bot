import React from 'react';
import { useNavigate } from 'react-router-dom';

const HeaderComponent = ({ adminIN }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Будь-яка додаткова логіка при виході, якщо потрібно
    // Наприклад, очищення токенів, сесій тощо

    navigate('/'); // Перенаправлення на сторінку входу
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
