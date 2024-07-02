import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HeaderComponent from './components/HeaderComponent';
import ListStatementComponent from './components/ListStatementComponent';
import LoginPage from './components/LoginPage';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/statements"
            element={
              <>
                <HeaderComponent />
                <ListStatementComponent />
              </>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
  