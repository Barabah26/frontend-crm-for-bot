import React, { useEffect, useState } from 'react';
import { listStatement } from '../service/StatementService';

const ListStatementComponent = () => {

    const [statements, setStatements] = useState([])

    useEffect(() => {
        listStatement().then((response) => {
            setStatements(response.data);
        }).catch(error => {
            console.error(error)
        })

    }, [])

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
                <input type="hidden" name="studentId" value={student.id} />
                <button type="submit" name="isReady" value="true">Готово</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListStatementComponent;
