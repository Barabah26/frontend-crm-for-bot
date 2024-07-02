import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { listStatement } from '../service/StatementService';

const ListStatementComponent = () => {
    const [statements, setStatements] = useState([]);
    const [loading, setLoading] = useState(true); // Додали стан для завантаження

    useEffect(() => {
        fetchStatements(); // Витягнути заявки при монтажі компонента
    }, []);

    const fetchStatements = async () => {
        try {
            const response = await listStatement(); // Викликаємо функцію listStatement з сервісу
            setStatements(response.data); // Оновлюємо стан заявок з даними з сервера
            setLoading(false); // Встановлюємо прапорець завантаження як false
        } catch (error) {
            console.error('Failed to fetch statements:', error);
            setLoading(false); // В разі помилки також встановлюємо прапорець завантаження як false
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
                    console.error('Failed to mark statement as ready:', error);
                });
        }
    };

    if (loading) {
        return <p>Loading...</p>; // Показуємо повідомлення про завантаження, поки дані завантажуються
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
                            <td>{student.statement}</td>
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
