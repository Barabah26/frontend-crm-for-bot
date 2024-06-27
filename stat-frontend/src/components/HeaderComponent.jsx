import React from 'react';

const HeaderComponent = ({ adminIN }) => {
  const handleLogout = () => {
    window.location.href = '/logout';
  };

  return (
    <header className="header">
      <div className="user-info">
        <span>Ласкаво просимо, {adminIN}!</span>
        <button id="logout-button" onClick={handleLogout}>Вихід</button>
      </div>
    </header>
  );
}

export default HeaderComponent;
