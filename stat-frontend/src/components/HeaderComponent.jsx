import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const HeaderComponent = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/');
  };

  const brandStyle = {
    marginLeft: '5cm', // Adjust as needed
    lineHeight: '3.5', // Adjust line-height for vertical centering
  };

  const navbarStyle = {
    height: '80px', // Adjust height as needed
    paddingTop: '15px', // Adjust top padding as needed
    paddingBottom: '15px', // Adjust bottom padding as needed
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark" style={navbarStyle}>
      <div className="container-fluid">
        <a className="navbar-brand text-uppercase me-auto" href="#" style={brandStyle}>
          Львівський державний університет безпеки життєдіяльності
        </a>
        <div style={{ marginRight: '5cm' }}> {/* Adjusted margin */}
          <button
            id="logout-button"
            className="btn btn-outline-light"
            onClick={handleLogout}
          >
            Вихід
          </button>
        </div>
      </div>
    </nav>
  );
};

export default HeaderComponent;
