import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MDBContainer, MDBInput } from 'mdb-react-ui-kit';
import { login } from '../service/LoginService';
import './LoginPage.css';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      if (!username || !password) {
        setError('Please enter both username and password.');
        return;
      }

      console.log('Sending login request...');
      const response = await login(username, password);
      console.log('Login successful:', response);

      // Store tokens and user role
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('userRole', response.role);

      // Debugging
      console.log('User role from localStorage:', localStorage.getItem('userRole'));

      // Redirect based on user role
      if (response.role === 'ADMIN') {
        console.log('Redirecting to /super-admin');
        navigate('/admin');
      } else {
        console.log('Redirecting to /statements');
        navigate('/statements');
      }
    } catch (error) {
      console.error('Login failed:', error.message);
      setError('Invalid login or password.');
    }
  };

  return (
    <div className="login-container d-flex justify-content-center align-items-center vh-100">
      <div className="login-box border rounded-lg p-4">
        <MDBContainer className="p-3">
          <h2 className="mb-4 text-center">Авторизація користувача</h2>
          <MDBInput 
            wrapperClass='mb-4' 
            placeholder='Прізвище' 
            id='login' 
            value={username} 
            type='text' 
            onChange={(e) => setUsername(e.target.value)} 
          />
          <MDBInput 
            wrapperClass='mb-4' 
            placeholder='Пароль' 
            id='password' 
            type='password' 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
          {error && <p className="text-danger">{error}</p>}
          <button className="btn-login mb-4 d-block btn-primary" onClick={handleLogin}>Увійти в систему</button>
        </MDBContainer>
      </div>
    </div>
  );
}

export default LoginPage;
