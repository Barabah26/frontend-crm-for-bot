import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { listStatement } from '../service/StatementService'; // Імпорт функції з сервісу
import { useNavigate } from 'react-router-dom';
import { Form, Table, Button, Container, Row, Col } from 'react-bootstrap'; // Імпорт компонентів Bootstrap
import '../App.css'; 

const ListStatementComponent = () => {
  const [statements, setStatements] = useState([]);
  const [filteredStatements, setFilteredStatements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const navigate = useNavigate();

  // Отримуємо всі заявки при завантаженні компонента
  useEffect(() => {
    fetchStatements();
  }, []);

  // Фільтруємо заявки при зміні вибраного факультету або списку заявок
  useEffect(() => {
    filterStatements();
  }, [statements, selectedFaculty]);

  // Функція для отримання списку заявок з сервера
  const fetchStatements = async () => {
    try {
      // Використання ендпойнту з сервісу для отримання даних
      const response = await listStatement();
      setStatements(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Не вдалося отримати заявки:', error);
      setLoading(false);
    }
  };

  // Функція для фільтрації заявок за факультетами
  const filterStatements = () => {
    if (selectedFaculty === '') {
      setFilteredStatements([]); // Якщо факультет не обрано, не показуємо заявки
    } else {
      const filtered = statements.filter(statement => statement.faculty === selectedFaculty);
      setFilteredStatements(filtered);
    }
  };

  // Обробник для позначення заявки як готової
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
            console.error('Токен недійсний або протермінований. Перенаправляємо на сторінку логіну.');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            navigate('/login');
          } else {
            console.error('Не вдалося позначити заявку як готову:', error);
          }
        });
    }
  };

  // Обробник зміни вибраного факультету
  const handleFacultyChange = (e) => {
    setSelectedFaculty(e.target.value);
  };

  // Якщо дані ще завантажуються
  if (loading) {
    return <p>Завантаження...</p>;
  }

  return (
    <Container className="students-container">
      <h2 className="my-4">Список студентів</h2>
      
      {/* Фільтр факультетів */}
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group controlId="facultyFilter">
            <Form.Label>Оберіть свій факультет:</Form.Label>
            <Form.Control as="select" value={selectedFaculty} onChange={handleFacultyChange}>
              <option value="">Оберіть факультет</option> {/* Змінив значення */}
              <option value="Факультет цивільного захисту">Факультет цивільного захисту</option>
              <option value="Факультет пожежної та техногенної безпеки">Факультет пожежної та техногенної безпеки</option>
              <option value="Факультет психології і соціального захисту">Факультет психології і соціального захисту</option>
              {/* Додати більше факультетів за необхідності */}
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>

      {/* Таблиця студентів */}
      {selectedFaculty !== '' && (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ПІБ</th>
              <th>Група</th>
              <th>Рік набору</th>
              <th>Номер телефону</th>
              <th>Тип заявки</th>
              <th>Факультет</th>
              <th>Дія</th>
            </tr>
          </thead>
          <tbody>
            {filteredStatements.map(student => (
              <tr key={student.id}>
                <td>{student.fullName}</td>
                <td>{student.groupName}</td>
                <td>{student.yearEntry}</td>
                <td>{student.phoneNumber}</td>
                <td>{student.typeOfStatement}</td>
                <td>{student.faculty}</td>
                <td>
                  <Button variant="success" onClick={() => handleReady(student.id)}>Готово</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default ListStatementComponent;
