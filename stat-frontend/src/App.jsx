import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HeaderComponent from './components/HeaderComponent';
import ListStatementComponent from './components/ListStatementComponent';
import LoginPage from './components/LoginPage';
import PrivateRoute from './components/PrivateRoute'; // Імпортуйте PrivateRoute

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/statements"
            element={
              <PrivateRoute>
                <HeaderComponent />
                <ListStatementComponent />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
