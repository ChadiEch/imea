// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './dashboard/Dashboard';
import AddItemPage from './items/AddItemPage';
import EditItemPage from './items/EditItemPage';
import Login from './authentications/login/Login';
import SignupPage from './authentications/signup/SignupPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/add-item" element={<AddItemPage />} />
        <Route path="/edit-item/:id" element={<EditItemPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </Router>
  );
};

export default App;
