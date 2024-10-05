import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import LoggedIn from './Logged_In';
import UserAuthFactory from './auth/UserAuthFactory';

const App: React.FC = () => {
  const userAuth = UserAuthFactory(); 

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home userAuth={userAuth} />} />
        <Route path="/logged-in" element={<LoggedIn userAuth={userAuth} />} />
      </Routes>
    </Router>
  );
};

export default App;
