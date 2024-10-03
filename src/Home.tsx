// // src/Home.tsx
// import React from 'react';
// import { useAuth0 } from '@auth0/auth0-react';

// const Home: React.FC = () => {
//     const { loginWithRedirect } = useAuth0();

//     const handleClick = () => {
//         loginWithRedirect();
//     };

//     return (
//         <div style={{ 
//             display: 'flex', 
//             justifyContent: 'center', 
//             alignItems: 'center', 
//             height: '100vh', 
//             textAlign: 'center' 
//         }}>
//             <button 
//                 onClick={handleClick} 
//                 style={{
//                     padding: '10px 20px', 
//                     fontSize: '16px',
//                     cursor: 'pointer'
//                 }}
//             >
//                 Login Button
//             </button>
//         </div>
//     );
// };

// export default Home;
import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
    const { loginWithRedirect, isAuthenticated } = useAuth0();
    const navigate = useNavigate();

    // Redirect to "Logged In" page after successful login
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/logged-in');
        }
    }, [isAuthenticated, navigate]);

    const handleClick = () => {
        loginWithRedirect();
    };

    return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh', 
            textAlign: 'center' 
        }}>
            <button 
                onClick={handleClick} 
                style={{
                    padding: '10px 20px', 
                    fontSize: '16px',
                    cursor: 'pointer'
                }}
            >
                Login Button
            </button>
        </div>
    );
};

export default Home;
