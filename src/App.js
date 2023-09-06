import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Users from './components/pages/Users';
import Events from './components/pages/Events';
import Home from './components/pages/Home';
import SupportTicket from './components/pages/SupportTicket';
import NavigationBar from './components/structure/NavigationBar';
import LogIn from './components/pages/LogIn';
import Register from './components/pages/Register';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<Users />} />
          <Route path="/events" element={<Events />} />
          <Route path="/support-tickets" element={<SupportTicket />} />
          <Route path="/log-in" element={<LogIn />} />
          <Route path="/register" element={<Register />} />
        </Routes>
        <NavigationBar />
      </div>
    </Router>
  );
}

export default App;
