import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MDBContainer, MDBInput } from 'mdb-react-ui-kit';
import './LoginPage.css';
import { login } from '../service/LoginService';

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
            const response = await login(username, password); // Using the login function from LoginService
            console.log('Login successful:', response);

            // Save tokens to localStorage
            localStorage.setItem('accessToken', response.accessToken);
            localStorage.setItem('refreshToken', response.refreshToken);

            navigate('/statements'); // Assuming '/statements' is a route in your frontend
        } catch (error) {
            console.error('Login failed:', error.response ? error.response.data : error.message);
            setError('Invalid username or password.');
        }
    };

    return (
        <div className="login-container d-flex justify-content-center align-items-center vh-100">
            <div className="login-box border rounded-lg p-4">
                <MDBContainer className="p-3">
                    <h2 className="mb-4 text-center">Авторизація користувача</h2>
                    <MDBInput wrapperClass='mb-4' placeholder='Прізвище' id='email' value={username} type='email' onChange={(e) => setUsername(e.target.value)} />
                    <MDBInput wrapperClass='mb-4' placeholder='Пароль' id='password' type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                    {error && <p className="text-danger">{error}</p>} {/* Render error message if exists */}
                    <button className="btn-login mb-4 d-block btn-primary" onClick={handleLogin}>Увійти в систему</button>
                </MDBContainer>
            </div>
        </div>
    );
}

export default LoginPage;
