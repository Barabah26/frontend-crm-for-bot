import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { listStatement } from '../service/StatementService';

const ListStatementComponent = () => {
    const [statements, setStatements] = useState([]);

    useEffect(() => {
        listStatement().then((response) => {
            setStatements(response.data);
        }).catch(error => {
            console.error(error);
        });
    }, []);

    const handleReady = (id) => {
        const confirmAction = window.confirm("Ви впевнені, що хочете позначити цю заявку як готову?");
        if (confirmAction) {
            axios.delete(`http://localhost:9000/api/statements/${id}`)
                .then(response => {
                    console.log(response.data);
                    setStatements(statements.filter(statement => statement.id !== id));
                })
                .catch(error => {
                    console.error(error);
                });
        }
    };

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
                                <button type="submit" name="isReady" value="true" onClick={() => handleReady(student.id)}>Готово</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ListStatementComponent;
