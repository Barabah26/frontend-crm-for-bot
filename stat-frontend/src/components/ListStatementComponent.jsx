import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { listStatement } from '../service/StatementService';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import '../App.css'; 

const ListStatementComponent = () => {
  const [statements, setStatements] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Initialize useNavigate hook

  useEffect(() => {
    fetchStatements();
  }, []);

  const fetchStatements = async () => {
    try {
      const response = await listStatement();
      setStatements(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch statements:', error);
      setLoading(false);
    }
  };

  const handleReady = (id) => {
    const confirmAction = window.confirm("Ви впевнені, що хочете позначити цю заявку як готову?");
    if (confirmAction) {
      const token = localStorage.getItem('accessToken');
      axios.delete(`http://localhost:9000/api/statements/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(response => {
          console.log(response.data);
          setStatements(statements.filter(statement => statement.id !== id));
        })
        .catch(error => {
          if (error.response && error.response.status === 401) {
            console.error('Token expired or invalid. Redirecting to login.');
            localStorage.removeItem('accessToken'); // Clear expired token
            localStorage.removeItem('refreshToken'); // Clear refresh token if needed
            navigate('/login'); // Redirect to login page
          } else {
            console.error('Failed to mark statement as ready:', error);
          }
        });
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="students-container">
      <h2>Список студентів</h2>
      <table className="students-table">
        <thead>
          <tr>
            <th>ПІБ</th>
            <th>Група</th>
            <th>Рік набору</th>
            <th>Номер телефону</th>
            <th>Тип заявки</th>
            <th>Факультет</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {statements.map(student => (
            <tr key={student.id}>
              <td>{student.fullName}</td>
              <td>{student.groupName}</td>
              <td>{student.yearEntry}</td>
              <td>{student.phoneNumber}</td>
              <td>{student.typeOfStatement}</td>
              <td>{student.institute}</td>
              <td>
                <button type="button" onClick={() => handleReady(student.id)}>Готово</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListStatementComponent;
