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
  const [editingUser, setEditingUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
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
      setUsers(response.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
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
    setNewUser((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleRoleChange = (e) => {
    const { options } = e.target;
    const selectedRoles = Array.from(options)
      .filter((option) => option.selected)
      .map((option) => option.value);

    setNewUser((prevState) => ({
      ...prevState,
      roles: selectedRoles
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
    if (!username) return;

    const confirmAction = window.confirm('Ви впевнені що хочете видалити цього користувача?');
    if (confirmAction) {
      const token = localStorage.getItem('accessToken');
      axios
        .delete(`http://localhost:9000/api/admin/deleteByUsername/${username}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(() => {
          setUsers((prevUsers) => prevUsers.filter((user) => user.username !== username));
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            navigate('/login');
          } else {
            setError('Failed to delete user');
          }
        });
    }
  };

  const handleEditPassword = (user) => {
    setEditingUser(user);
    setNewPassword('');
  };

  const handleSavePassword = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const updateUserDto = { newPassword: newPassword };
      await axios.put(`http://localhost:9000/api/admin/updateByUsername/${editingUser.username}`, updateUserDto, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccessMessage('Password updated successfully');
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        navigate('/login');
      } else {
        console.error(error.response);
        setError(error.response?.data || 'Failed to update password');
      }
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
              autoComplete="new-password"
            />
          </div>
          <div className="mb-3">
            <select
              name="roles"
              className="form-control"
              multiple
              value={newUser.roles}
              onChange={handleRoleChange}
              required
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary">Register User</button>
        </form>
      </div>

      <h2>Всі користувачі</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Username</th>
            {/* <th>Password</th> */}
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.username}>
              <td>{user.username}</td>
              {/* <td>{user.password}</td> */}
              <td>{user.roles.join(', ')}</td>
              <td>
                <button className="btn btn-danger btn-sm" onClick={() => handleDeleteUser(user.username)}>Delete</button>
                <button className="btn btn-warning btn-sm ms-2" onClick={() => handleEditPassword(user)}>Edit Password</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingUser && (
        <div className="mt-4">
          <h2>Редагувати пароль для {editingUser.username}</h2>
          <form onSubmit={(e) => { e.preventDefault(); handleSavePassword(); }}>
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>
            <button type="submit" className="btn btn-success">Save Password</button>
            <button type="button" className="btn btn-secondary ms-2" onClick={() => setEditingUser(null)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default SuperAdminPage;
