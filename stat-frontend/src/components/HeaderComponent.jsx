import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Container, Nav, Button, NavDropdown, Image } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaUniversity } from 'react-icons/fa'; // Іконка університету
import { BsPersonCircle } from 'react-icons/bs'; // Іконка для аватара користувача

const HeaderComponent = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/');
  };

  const handleProfileClick = () => {
    navigate('/profile'); // Направляє до сторінки профілю
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="py-3 shadow-sm">
      <Container>
        {/* Логотип університету з іконкою */}
        <Navbar.Brand href="#" className="d-flex align-items-center">
          <FaUniversity className="me-2" size={30} /> {/* Іконка університету */}
          <span className="fw-bold text-uppercase">Університет безпеки життєдіяльності</span>
        </Navbar.Brand>
        {/* Бутерброд-меню для мобільних пристроїв */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
    
          {/* Аватар користувача та випадаюче меню */}
          <Nav className="ms-auto d-flex align-items-center">
            <NavDropdown
              title={<BsPersonCircle size={30} className="text-light" />} // Іконка аватара
              id="basic-nav-dropdown"
              align="end"
              className="text-light"
            >
              {/* <NavDropdown.Item onClick={handleProfileClick}>Профіль</NavDropdown.Item> */}
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>Вихід</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default HeaderComponent;
