import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HeaderComponent from './components/HeaderComponent';
import ListStatementComponent from './components/ListStatementComponent';
import LoginPage from './components/LoginPage';
import PrivateRoute from './components/PrivateRoute';
import SuperAdminPage from './components/SuperAdminPage';

function App() {
  return (
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
        <Route
          path="/admin"
          element={
            <PrivateRoute requiredRole="ADMIN">
              <HeaderComponent />
              <SuperAdminPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
