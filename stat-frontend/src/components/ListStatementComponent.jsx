import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Container, Row, Col, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const ListStatementComponent = () => {
  const [statements, setStatements] = useState([]);
  const [filteredStatements, setFilteredStatements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchStatements();
  }, []);

  useEffect(() => {
    filterStatements();
  }, [selectedFaculty, selectedStatus]);

  const fetchStatements = async () => {
    setLoading(true);
    const token = localStorage.getItem('accessToken');
    try {
      const response = await axios.get('http://localhost:9000/api/statements', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStatements(response.data);
      setFilteredStatements(response.data);
    } catch (error) {
      console.error('Error fetching statements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFacultyChange = (e) => {
    setSelectedFaculty(e.target.value);
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const filterStatements = () => {
    let filtered = statements;

    // Фільтруємо за факультетом
    if (selectedFaculty !== '') {
      filtered = filtered.filter(
        (student) => student.faculty === selectedFaculty
      );
    }

    // Фільтруємо за статусом
    if (selectedStatus !== '') {
      filtered = filtered.filter((student) => student.status === selectedStatus);
    }

    setFilteredStatements(filtered);
  };

  const handleInProgress = (id) => {
    console.log(`Заявка з ID ${id} позначена як в процесі`);
  };

  const handleReady = (id) => {
    console.log(`Заявка з ID ${id} позначена як готова`);
  };

  return (
    <Container className="students-container">
      <h2 className="my-4">Список студентів</h2>

      {/* Фільтр факультетів та статусу */}
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

      {/* Таблиця студентів */}
      {selectedFaculty && selectedStatus && filteredStatements.length > 0 ? (
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
            {filteredStatements.map((student) => (
              <tr key={student.id}>
                <td>{student.fullName}</td>
                <td>{student.groupName}</td>
                <td>{student.yearEntry}</td>
                <td>{student.phoneNumber}</td>
                <td>{student.typeOfStatement}</td>
                <td>{student.faculty}</td>
                <td>{student.status}</td>
                <td>
                  {student.status === 'PENDING' && (
                    <Button variant="primary" onClick={() => handleInProgress(student.id)}>
                      В обробці
                    </Button>
                  )}
                  {student.status === 'IN_PROGRESS' && (
                    <Button variant="success" onClick={() => handleReady(student.id)}>
                      Готово
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        selectedFaculty && selectedStatus && <p>Немає заявок для відображення</p>
      )}
    </Container>
  );
};

export default ListStatementComponent;
