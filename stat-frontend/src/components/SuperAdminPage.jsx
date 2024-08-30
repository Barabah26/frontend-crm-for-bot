import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const SuperAdminPage = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    roles: [] 
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('http://localhost:9000/api/admin/allUsers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Fetched users:', response.data);
      setUsers(response.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error('Token expired or invalid. Redirecting to login.');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        navigate('/login');
      } else {
        setError('Failed to fetch users');
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleRolesChange = (e) => {
    const { value } = e.target;
    setNewUser(prevState => ({
      ...prevState,
      roles: value.split(',').map(role => role.trim())
    }));
  };

  const handleRegisterUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('accessToken');
      await axios.post('http://localhost:9000/api/admin/register', newUser, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccessMessage('User registered successfully');
      setNewUser({ username: '', password: '', roles: [] });
      fetchUsers();
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error('Token expired or invalid. Redirecting to login.');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        navigate('/login');
      } else if (error.response && error.response.status === 409) {
        setError('Такий користувач вже існує');
      } else if (error.response && error.response.status === 404) {
        setError('Роль може бути: USER або ADMIN');
      } else {
        setError(error.response?.data || 'Registration failed');
      }
    }
  };

  const handleDeleteUser = (username) => {
    console.log('Deleting user with username:', username);

    if (!username) {
      console.error('Invalid username');
      return;
    }

    const confirmAction = window.confirm("Ви впевнені що хочете видалити цього користувача?");
    if (confirmAction) {
      const token = localStorage.getItem('accessToken');
      axios.delete(`http://localhost:9000/api/admin/deleteByUsername/${username}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        console.log('User deleted successfully:', response.data);
        setUsers(users.filter(user => user.username !== username));
      })
      .catch(error => {
        if (error.response && error.response.status === 401) {
          console.error('Token expired or invalid. Redirecting to login.');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          navigate('/login');
        } else {
          console.error('Failed to delete user:', error);
          setError('Failed to delete user');
        }
      });
    }
  };

  return (
    <div className="container mt-4">
      {error && <div className="alert alert-danger">{error}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}

      <div className="mb-4">
        <h2>Зареєструвати нового користувача</h2>
        <form onSubmit={handleRegisterUser}>
          <div className="mb-3">
            <input
              type="text"
              name="username"
              className="form-control"
              placeholder="Username"
              value={newUser.username}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Password"
              value={newUser.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              name="roles"
              className="form-control"
              placeholder="Roles (comma-separated)"
              value={newUser.roles.join(', ')} 
              onChange={handleRolesChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">Register User</button>
        </form>
      </div>

      <h2>Всі користувачі</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Username</th>
            <th>Password</th>
            <th>Roles</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.username}>
              <td>{user.username}</td>
              <td>{user.password}</td>
              <td>{user.roles.join(', ')}</td>
              <td>
                <button className="btn btn-danger btn-sm" onClick={() => {
                  console.log('User Username:', user.username);
                  handleDeleteUser(user.username);
                }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SuperAdminPage;
