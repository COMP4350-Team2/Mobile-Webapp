// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { UserAuth } from './auth/UserAuth'; 
// import { MockUser } from './auth/MockUser'; 
// import { FaUserCircle } from 'react-icons/fa'; // Importing Profile icon
// import { AiOutlineArrowLeft } from 'react-icons/ai'; // Importing Back icon

// interface LoggedInProps {
//   userAuth: UserAuth; // Define the prop type
// }

// const LoggedIn: React.FC<LoggedInProps> = ({ userAuth }) => {
//   const navigate = useNavigate();
//   const [isMenuOpen, setIsMenuOpen] = useState(false); // State to control sliding menu

//   // Check authentication state
//   if (!userAuth.isAuthenticated()) {
//     // If not authenticated, redirect to home
//     navigate('/');
//     return null; // Prevent rendering of the component
//   }

//   const handleLogout = () => {
//     userAuth.logout(); // Log out the user
//     navigate('/'); // Navigate back to the home page
//   };

//   const userType = userAuth instanceof MockUser ? "Mock User" : "Auth0 User"; // Determine user type

//   return (
//     <div 
//       style={{
//         display: 'flex', 
//         flexDirection: 'column', 
//         justifyContent: 'center', 
//         alignItems: 'center', 
//         height: '100vh', // Full viewport height
//         textAlign: 'center', // Center text alignment
//         backgroundColor: '#99D9EA', // Set background color to blue
//         fontFamily: 'Arial, sans-serif', // Font style
//         position: 'relative', // Positioning context for the profile icon
//       }}
//     >
//       {/* Top Right User Profile Icon */}
//       <div 
//         style={{
//           position: 'absolute',
//           top: '20px',
//           right: '20px',
//           display: 'flex',
//           alignItems: 'center',
//           cursor: 'pointer',
//           padding: '10px',
//           borderRadius: '50%', // Circular background
//           backgroundColor: '#7FB5D8', // Adjusted background color for better fit
//           boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)', // Subtle shadow for depth
//           transition: 'background-color 0.3s ease', // Smooth background transition
//         }} 
//         onClick={() => setIsMenuOpen(!isMenuOpen)}
//         onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#A8D1E6'} // Lighter shade on hover
//         onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#7FB5D8'} // Reset color
//       >
//         <FaUserCircle style={{ fontSize: '36px', color: 'white' }} /> {/* Larger Profile Icon */}
//       </div>

//       {/* Sliding Menu */}
//       {isMenuOpen && (
//         <div 
//           style={{
//             position: 'absolute',
//             top: 0,
//             right: 0,
//             width: '250px', // Width of the sliding menu
//             height: '100vh', // Full height
//             backgroundColor: '#88B4D8', // Darker shade of blue
//             boxShadow: '-2px 0 5px rgba(0, 0, 0, 0.5)', // Shadow effect for depth
//             padding: '20px',
//             zIndex: 1000, // Ensures menu is above other elements
//             transition: 'transform 0.3s ease', // Smooth transition for opening
//           }}
//         >
//           {/* Back Icon and Text */}
//           <div 
//             style={{
//               display: 'flex', 
//               alignItems: 'center', 
//               marginBottom: '20px', // Space below the back button
//             }}
//           >
//             <AiOutlineArrowLeft 
//               style={{
//                 fontSize: '24px',
//                 color: 'white',
//                 cursor: 'pointer',
//                 marginRight: '10px', // Space between icon and text
//               }} 
//               onClick={() => setIsMenuOpen(false)} // Close menu on click
//             />
//             <span 
//               style={{
//                 color: 'white', 
//                 fontSize: '18px', 
//                 cursor: 'pointer', 
//               }}
//               onClick={() => setIsMenuOpen(false)} // Close menu when clicking the text as well
//             >
//               Back
//             </span>
//           </div>
          
//           <div style={{ color: 'white', fontSize: '1.2rem', marginBottom: '20px' }}>
//             User Type: {userType} {/* Display user type */}
//           </div>

//           <button 
//             onClick={handleLogout} // Log out action
//             style={{
//               backgroundColor: 'red', // Red button for logout
//               color: 'white', // White text color
//               padding: '10px 20px', // Padding for button
//               border: 'none', // Remove border
//               borderRadius: '5px', // Rounded corners
//               cursor: 'pointer', // Pointer cursor on hover
//               transition: 'background-color 0.3s ease', // Smooth background transition
//             }}
//             onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#D94F4F'} // Darker red on hover
//             onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'red'} // Reset color
//           >
//             Log Out
//           </button>
//         </div>
//       )}

//       {/* Cards Container */}
//       <div 
//         style={{
//           display: 'flex', 
//           flexDirection: 'row', // Horizontal layout
//           alignItems: 'center', 
//           gap: '20px', // Space between cards
//           marginTop: '100px', // Add margin from the top for better spacing
//         }}
//       >
//         {/* Card for "View My Lists" */}
//         <div 
//           onClick={() => { /* No action right now */ }} 
//           style={{
//             backgroundColor: '#AB4C11', // Set background color to orange
//             color: 'white', // White text color
//             padding: '20px', 
//             borderRadius: '15px', // Rounded corners
//             width: '150px', // Fixed width for the card
//             height: '150px', // Fixed height for the card
//             cursor: 'pointer', // Pointer cursor on hover
//             boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', // Add some shadow
//             transition: 'transform 0.3s ease', // Smooth hover effect
//             display: 'flex', // Flexbox for centering text
//             flexDirection: 'column', 
//             justifyContent: 'center', 
//             alignItems: 'center', 
//           }}
//           onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} // Scale on hover
//           onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'} // Reset scale
//         >
//           View my Lists
//         </div>

//         {/* Card for "View All Ingredients" */}
//         <div 
//           onClick={() => { /* No action right now */ }} 
//           style={{
//             backgroundColor: '#AB4C11', // Set background color to orange
//             color: 'white', // White text color
//             padding: '20px', 
//             borderRadius: '15px', // Rounded corners
//             width: '150px', // Fixed width for the card
//             height: '150px', // Fixed height for the card
//             cursor: 'pointer', // Pointer cursor on hover
//             boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', // Add some shadow
//             transition: 'transform 0.3s ease', // Smooth hover effect
//             display: 'flex', // Flexbox for centering text
//             flexDirection: 'column', 
//             justifyContent: 'center', 
//             alignItems: 'center', 
//           }}
//           onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} // Scale on hover
//           onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'} // Reset scale
//         >
//           View All Ingredients
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoggedIn;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserAuth } from './auth/UserAuth'; 
import { MockUser } from './auth/MockUser'; 
import { FaUserCircle } from 'react-icons/fa'; // Importing Profile icon
import { AiOutlineArrowLeft } from 'react-icons/ai'; // Importing Back icon
import myAppLogo from './assets/Cupboard_Logo.png'; // Import your logo image

interface LoggedInProps {
  userAuth: UserAuth; // Define the prop type
}

const LoggedIn: React.FC<LoggedInProps> = ({ userAuth }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to control sliding menu

  // Check authentication state
  if (!userAuth.isAuthenticated()) {
    // If not authenticated, redirect to home
    navigate('/');
    return null; // Prevent rendering of the component
  }

  const handleLogout = () => {
    userAuth.logout(); // Log out the user
    navigate('/'); // Navigate back to the home page
  };

  const userType = userAuth instanceof MockUser ? "Mock User" : "Auth0 User"; // Determine user type

  return (
    <div style={{ position: 'relative', height: '100vh', backgroundColor: '#99D9EA' }}>
      {/* Background Logo */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          width: '100%',
          height: '100%',
          backgroundImage: `url(${myAppLogo})`,
          backgroundSize: 'contain', // Change to 'cover' for full coverage
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          filter: 'blur(1px)', // Blur effect
          opacity: 0.3,
          transform: 'translateX(-50%) scale(0.95)', // Scale down for zoom effect (change 0.9 to experiment)
          zIndex: 0,
        }}
      />

      {/* Main Content */}
      <div 
        style={{
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100%', // Full height
          textAlign: 'center', 
          fontFamily: 'Arial, sans-serif', 
          position: 'relative', 
          zIndex: 1, // Ensure content is above the background
        }}
      >
        {/* Top Right User Profile Icon */}
        <div 
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            padding: '10px',
            borderRadius: '50%', 
            backgroundColor: '#7FB5D8', 
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)', 
            transition: 'background-color 0.3s ease', 
          }} 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#A8D1E6'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#7FB5D8'}
        >
          <FaUserCircle style={{ fontSize: '36px', color: 'white' }} />
        </div>

        {/* Sliding Menu */}
        {isMenuOpen && (
          <div 
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '250px', 
              height: '100vh', 
              backgroundColor: '#88B4D8', 
              boxShadow: '-2px 0 5px rgba(0, 0, 0, 0.5)', 
              padding: '20px',
              zIndex: 1000, 
              transition: 'transform 0.3s ease', 
            }}
          >
            {/* Back Icon and Text */}
            <div 
              style={{
                display: 'flex', 
                alignItems: 'center', 
                marginBottom: '20px', 
              }}
            >
              <AiOutlineArrowLeft 
                style={{
                  fontSize: '24px',
                  color: 'white',
                  cursor: 'pointer',
                  marginRight: '10px',
                }} 
                onClick={() => setIsMenuOpen(false)} 
              />
              <span 
                style={{
                  color: 'white', 
                  fontSize: '18px', 
                  cursor: 'pointer', 
                }}
                onClick={() => setIsMenuOpen(false)} 
              >
                Back
              </span>
            </div>
            
            <div style={{ color: 'white', fontSize: '1.2rem', marginBottom: '20px' }}>
              User Type: {userType}
            </div>

            <button 
              onClick={handleLogout} 
              style={{
                backgroundColor: 'red', 
                color: 'white', 
                padding: '10px 20px', 
                border: 'none', 
                borderRadius: '5px', 
                cursor: 'pointer', 
                transition: 'background-color 0.3s ease', 
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#D94F4F'} 
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'red'} 
            >
              Log Out
            </button>
          </div>
        )}

        {/* Cards Container */}
        <div 
          style={{
            display: 'flex', 
            flexDirection: 'row', 
            alignItems: 'center', 
            gap: '360px', 
            marginTop: '100px', 
          }}
        >
          {/* Card for "View My Lists" */}
          <div 
            onClick={() => { /* No action right now */ }} 
            style={{
              backgroundColor: '#AB4C11', 
              color: 'white', 
              padding: '20px', 
              borderRadius: '15px', 
              width: '150px', 
              height: '150px', 
              cursor: 'pointer', 
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', 
              transition: 'transform 0.3s ease', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center', 
              alignItems: 'center', 
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} 
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'} 
          >
            My Lists
          </div>

          {/* Card for "View All Ingredients" */}
          <div 
            onClick={() => { /* No action right now */ }} 
            style={{
              backgroundColor: '#AB4C11', 
              color: 'white', 
              padding: '20px', 
              borderRadius: '15px', 
              width: '150px', 
              height: '150px', 
              cursor: 'pointer', 
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', 
              transition: 'transform 0.3s ease', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center', 
              alignItems: 'center', 
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} 
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'} 
          >
            All Ingredients
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoggedIn;
