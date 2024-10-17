import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TimeEntriesPage from './pages/TimeEntriesPage';
import UsersPage from './pages/UsersPage';
import Header from './components/Header'; // Import the Header component
import './index.css';
const App = () => {

  return (
    <Router>
      <div className="container mx-auto p-4">
      <Header />
        <div className="p-4">
          <Routes>
            <Route path="/" element={<h1>Welcome to the Time Tracking App</h1>} />
            <Route path="/time-entries" element={<TimeEntriesPage />} />
            <Route path="/users" element={<UsersPage />} />
            {/* Other routes can be added here */}
          </Routes>
        </div>
      </div>
      </Router>

  );
};

export default App;
