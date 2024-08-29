import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Ensure this file is correctly loaded

const SuperAdminPage = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    userName: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:9000/api/admin/allUsers', {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      setUsers(response.data);
    } catch (error) {
      setError('Failed to fetch users');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleRegisterUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:9000/api/admin/register', newUser, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      setSuccessMessage('User registered successfully');
      setNewUser({ userName: '', email: '', password: '' });
      fetchUsers(); // Refresh the user list
    } catch (error) {
      setError(error.response?.data || 'Registration failed');
    }
  };

  const handleDeleteUser = async () => {
    if (selectedUser) {
      try {
        await axios.delete(`http://localhost:9000/api/admin/delete/${selectedUser}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        });
        setSuccessMessage('User deleted successfully');
        setSelectedUser(null); // Close modal
        fetchUsers(); // Refresh the user list
      } catch (error) {
        setError('Failed to delete user');
      }
    }
  };

  const openDeleteModal = (userId) => {
    setSelectedUser(userId);
    const deleteModal = new window.bootstrap.Modal(document.getElementById('deleteModal'));
    deleteModal.show();
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
              name="userName"
              className="form-control"
              placeholder="Username"
              value={newUser.userName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Email"
              value={newUser.email}
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
          <button type="submit" className="btn btn-primary">Register User</button>
        </form>
      </div>

      <h2>Всі користувачі</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Username</th>
            <th>Password</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.password}</td>
              <td>{user.roles}</td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => openDeleteModal(user.id)} // Ensure this matches backend ID
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Delete Confirmation Modal */}
      <div className="modal fade" id="deleteModal" tabIndex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="deleteModalLabel">Confirm Deletion</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              Are you sure you want to delete this user?
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" className="btn btn-danger" onClick={handleDeleteUser}>Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminPage;
