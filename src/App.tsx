import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home/Home';
import LoggedIn from './Logged_In/Logged_In';
import MyLists from './MyLists/MyLists'; // Import MyLists
import UserAuthFactory from './auth/UserAuthFactory';

const App: React.FC = () => {
  const userAuth = UserAuthFactory(); 

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home userAuth={userAuth} />} />
        <Route path="/logged-in" element={<LoggedIn userAuth={userAuth} />} />
        <Route path="/my-lists" element={<MyLists />} /> {/* Add route for MyLists */}
      </Routes>
    </Router>
  );
};

export default App;
