import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Container, Row, Col, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const ListStatementComponent = () => {
  const [statements, setStatements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [noResults, setNoResults] = useState(false); // Додати стан для повідомлення про відсутність
  const [errorMessage, setErrorMessage] = useState(''); // Стан для повідомлення про помилку

  const navigate = useNavigate();

  // Fetching statements based on selected filters
  useEffect(() => {
    fetchStatements();
  }, [selectedFaculty, selectedStatus]);

  // Fetch statements from the backend
  const fetchStatements = async () => {
    setLoading(true);
    const token = localStorage.getItem('accessToken');
    try {
      const response = await axios.get('http://localhost:9000/api/statements/statusAndFaculty', {
        params: {
          status: selectedStatus || undefined,
          faculty: selectedFaculty || undefined,
        },
        headers: { Authorization: `Bearer ${token}` },
      });
      setStatements(response.data);
      console.log(response.data);
      setNoResults(response.data.length === 0); // Перевірити, чи не знайдено жодної заявки
      setErrorMessage(''); // Скидаємо повідомлення про помилку
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.error('Statements not found for the given parameters:', error);
        setNoResults(true); // Встановити стан, що довідки не знайдені
        setErrorMessage('Заявки не знайдено для вказаних параметрів.'); // Повідомлення про 404
      } else {
        console.error('Error fetching statements:', error);
        setErrorMessage('Виникла помилка при отриманні заявок.'); // Загальне повідомлення про помилку
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle change in selected faculty
  const handleFacultyChange = (e) => {
    setSelectedFaculty(e.target.value);
  };

  // Handle change in selected status
  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  // Mark statement as IN_PROGRESS
  const handleInProgress = async (id) => {
    const confirm = window.confirm("Ви впевнені, що хочете змінити статус на 'В обробці'?");
    if (!confirm) return; // Якщо користувач не підтверджує, виходимо з функції

    const token = localStorage.getItem('accessToken');
    try {
      await axios.put(`http://localhost:9000/api/statements/${id}/in-progress`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(`Statement with ID ${id} marked as IN_PROGRESS`);
      fetchStatements(); // Fetch updated data after status change
    } catch (error) {
      console.error('Error marking statement as IN_PROGRESS:', error);
    }
  };

  // Mark statement as READY
  const handleReady = async (id) => {
    const confirm = window.confirm("Ви впевнені, що хочете змінити статус на 'Готово'?");
    if (!confirm) return; // Якщо користувач не підтверджує, виходимо з функції

    const token = localStorage.getItem('accessToken');
    try {
      await axios.put(`http://localhost:9000/api/statements/${id}/ready`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(`Statement with ID ${id} marked as READY`);
      fetchStatements(); // Fetch updated data after status change
    } catch (error) {
      console.error('Error marking statement as READY:', error);
    }
  };

  return (
    <Container className="students-container">
      <h2 className="my-4">Список заявок</h2>

      {/* Filters for faculty and status */}
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group controlId="facultyFilter">
            <Form.Label>Оберіть свій факультет:</Form.Label>
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
            <Form.Label>Оберіть статус заявки:</Form.Label>
            <Form.Control as="select" value={selectedStatus} onChange={handleStatusChange}>
              <option value="">Оберіть статус</option>
              <option value="PENDING">Очікується</option>
              <option value="IN_PROGRESS">В процесі</option>
              <option value="READY">Готово</option>
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>

      {/* Statement Table */}
      {loading ? (
        <p>Завантаження...</p>
      ) : (
        <>
          {noResults ? (
            <p className="text-center">{errorMessage}</p> // Відображення повідомлення про відсутність заявок
          ) : (
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
                {statements.map((statement) => (
                  <tr key={statement.id}>
                    <td>{statement.fullName}</td>
                    <td>{statement.groupName}</td>
                    <td>{statement.yearEntry}</td>
                    <td>{statement.phoneNumber}</td>
                    <td>{statement.typeOfStatement}</td>
                    <td>{statement.faculty}</td>
                    <td>{statement.status}</td>
                    <td>
                      {statement.status === 'В очікуванні' && (
                        <Button variant="primary" onClick={() => handleInProgress(statement.id)}>
                          В обробці
                        </Button>
                      )}
                      {statement.status === 'В процесі' && (
                        <Button variant="success" onClick={() => handleReady(statement.id)}>
                          Готово
                        </Button>
                      )}
                      {statement.status === 'Готово' && (
                        <Button variant="secondary" disabled>
                          Завершено
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </>
      )}
    </Container>
  );
};

export default ListStatementComponent;
