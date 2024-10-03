// // src/App.tsx
// import React from 'react';
// import Home from './Home';

// const App: React.FC = () => {
//     return (
//         <div className="App">
//             <Home />
//         </div>
//     );
// };

// export default App;
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import LoggedInPage from './Logged_In';
import { useAuth0 } from '@auth0/auth0-react';

const App = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {isAuthenticated && <Route path="/logged-in" element={<LoggedInPage />} />}
      </Routes>
    </Router>
  );
};

export default App;
