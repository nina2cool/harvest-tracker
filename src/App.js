import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TimeEntriesPage from './pages/TimeEntriesPage';
import UsersPage from './pages/UsersPage';
import Header from './components/Header'; // Import the Header component
import './index.css';
import TimeEntriesPage2 from './pages/TimeEntriesPage2'; // Import the new component
import TimeEntriesPage3 from './pages/TimeEntriesPage3'; // Import the new component
import TimeEntriesPage4 from './pages/TimeEntriesPage4'; // Import the new component
import TasksPage from './pages/TasksPage'; // Import the new component
import { Container } from 'react-bootstrap';
const express = require('express');
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

const App = () => {
  
  return (
    <Router>
      <Container className="mx-auto pt-4">
      <Header />
        <div className="p-4">
          <Routes>
            <Route path="/" element={<h1>Welcome to the Time Tracking App</h1>} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/time-entries" element={<TimeEntriesPage />} />
            <Route path="/time-entries-step-2" element={<TimeEntriesPage2 />} />
            <Route path="/time-entries-step-3" element={<TimeEntriesPage3 />} />
            <Route path="/time-entries-step-4" element={<TimeEntriesPage4 />} />
            <Route path="/tasks" element={<TasksPage />} />
            {/* Other routes can be added here */}
          </Routes>
        </div>
      </Container>
      </Router>

  );
};

export default App;
