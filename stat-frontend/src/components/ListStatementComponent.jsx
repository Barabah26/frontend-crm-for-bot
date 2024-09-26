import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Table, Button, Container, Row, Col } from 'react-bootstrap';
import '../App.css';

const ListStatementComponent = () => {
  const [statements, setStatements] = useState([]); // Стан для всіх заявок
  const [filteredStatements, setFilteredStatements] = useState([]); // Стан для відфільтрованих заявок
  const [loading, setLoading] = useState(true); // Стан для індикатора завантаження
  const [selectedFaculty, setSelectedFaculty] = useState(''); // Стан для обраного факультету
  const [selectedStatus, setSelectedStatus] = useState('PENDING'); // Стан для обраного статусу
  const navigate = useNavigate(); // Для навігації між маршрутами

  useEffect(() => {
    fetchStatements(); // Завантаження заявок при монтажі компонента
  }, []);

  useEffect(() => {
    filterStatements(); // Фільтрація заявок при зміні стану
  }, [statements, selectedFaculty, selectedStatus]);

  const fetchStatements = async () => {
    setLoading(true); // Зупинка індикатора завантаження
    try {
      let data = [];
      if (selectedFaculty) {
        data = await fetchStatementsByFaculty(selectedFaculty);
      } else if (selectedStatus) {
        data = await fetchStatementsByStatus(selectedStatus);
      } else {
        data = await listStatement(); // Якщо не вибрано фільтрів, отримати всі заявки
      }

      console.log('Отримані дані:', data); // Логування отриманих даних
      setStatements(data); // Встановлення стану для всіх заявок
    } catch (error) {
      console.error('Не вдалося отримати заявки:', error);
    } finally {
      setLoading(false); // Зупинка індикатора завантаження
    }
  };

  const fetchStatementsByStatus = async (status) => {
    const token = localStorage.getItem('accessToken'); // Отримання токена
    try {
      const response = await axios.get(`http://localhost:9000/api/statements/status/${status}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Не вдалося отримати заявки за статусом:', error);
      throw error;
    }
  };

  const fetchStatementsByFaculty = async (faculty) => {
    const token = localStorage.getItem('accessToken'); // Отримання токена
    try {
      const response = await axios.get(`http://localhost:9000/api/statements/faculty/${faculty}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Не вдалося отримати заявки за факультетом:', error);
      throw error;
    }
  };

  const filterStatements = () => {
    let filtered = statements;

    // Фільтрація за факультетом
    if (selectedFaculty) {
      filtered = filtered.filter(statement => statement.faculty === selectedFaculty);
    }

    // Фільтрація за статусом (перевірка регістру)
    if (selectedStatus) {
      filtered = filtered.filter(statement => 
        statement.application_status && statement.application_status.toUpperCase() === selectedStatus
      );
    }

    console.log('Відфільтровані заявки:', filtered); // Логування відфільтрованих даних
    setFilteredStatements(filtered); // Встановлення стану для відфільтрованих заявок
  };

  const handleUpdateStatus = async (id, newStatus) => {
    const confirmAction = window.confirm(`Ви впевнені, що хочете змінити статус на ${newStatus}?`); // Підтвердження зміни статусу
    if (confirmAction) {
      const token = localStorage.getItem('accessToken'); // Отримання токена з localStorage
      try {
        await axios.put(`http://localhost:9000/api/statements/${id}`, { status: newStatus }, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        fetchStatements(); // Оновлення списку після зміни статусу
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.error('Токен недійсний або протермінований. Перенаправляємо на сторінку логіну.');
          localStorage.removeItem('accessToken'); // Видалення токена
          navigate('/login'); // Перенаправлення на сторінку логіну
        } else {
          console.error('Не вдалося змінити статус заявки:', error);
        }
      }
    }
  };

  const handleFacultyChange = (e) => {
    setSelectedFaculty(e.target.value); // Оновлення стану для обраного факультету
    fetchStatements(); // Завантажити заявки після зміни факультету
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value); // Оновлення стану для обраного статусу
    fetchStatements(); // Завантажити заявки після зміни статусу
  };

  if (loading) {
    return <p>Завантаження...</p>; // Показуємо повідомлення про завантаження
  }

  return (
    <Container className="students-container">
      <h2 className="my-4">Список заявок</h2>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group controlId="facultyFilter">
            <Form.Label>Оберіть факультет:</Form.Label>
            <Form.Control as="select" value={selectedFaculty} onChange={handleFacultyChange}>
              <option value="">Оберіть факультет</option>
              <option value="Факультет цивільного захисту">Факультет цивільного захисту</option>
              <option value="Факультет пожежної та техногенної безпеки">Факультет пожежної та техногенної безпеки</option>
              <option value="Факультет психології і соціального захисту">Факультет психології і соціального захисту</option>
            </Form.Control>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="statusFilter">
            <Form.Label>Оберіть статус:</Form.Label>
            <Form.Control as="select" value={selectedStatus} onChange={handleStatusChange}>
              <option value="PENDING">Щойно зареєстровані</option>
              <option value="IN_PROGRESS">В обробці</option>
              <option value="READY">Готово</option>
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>

      {filteredStatements.length > 0 ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ПІБ</th>
              <th>Група</th>
              <th>Рік набору</th>
              <th>Номер телефону</th>
              <th>Тип заявки</th>
              <th>Факультет</th>
              <th>Статус</th>
              <th>Дія</th>
            </tr>
          </thead>
          <tbody>
            {filteredStatements.map(statement => (
              <tr key={statement.id}>
                <td>{statement.fullName}</td>
                <td>{statement.groupName}</td>
                <td>{statement.yearEntry}</td>
                <td>{statement.phoneNumber}</td>
                <td>{statement.typeOfStatement}</td>
                <td>{statement.faculty}</td>
                <td>{statement.application_status}</td>
                <td>
                  {statement.application_status === 'PENDING' && (
                    <Button variant="warning" onClick={() => handleUpdateStatus(statement.id, 'IN_PROGRESS')}>В обробку</Button>
                  )}
                  {statement.application_status === 'IN_PROGRESS' && (
                    <Button variant="success" onClick={() => handleUpdateStatus(statement.id, 'READY')}>Готово</Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>Заявки не знайдено.</p>
      )}
    </Container>
  );
};

export default ListStatementComponent;
