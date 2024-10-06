import React from "react";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../../auth/UserAuth";
import myAppLogo from "../assets/Cupboard_Logo.png"; // Import logo

interface HomeProps {
	userAuth: UserAuth; // Receive UserAuth from props
}

const Home: React.FC<HomeProps> = ({ userAuth }) => {
	const navigate = useNavigate(); // Initialize navigate

	const handleLogin = () => {
		userAuth.login(); // Log in the user using Auth0 or Mock User
		if (userAuth.isAuthenticated()) {
			// Check if the user is authenticated
			navigate("/logged-in"); // Redirect to the LoggedIn page
		}
	};

	return (
		<div
			style={{
				position: "relative",
				height: "100vh",
				textAlign: "center",
				backgroundColor: "#99D9EA",
			}}
		>
			{/* Background Logo */}
			<div
				style={{
					position: "absolute",
					top: 0,
					left: "50%",
					width: "100%",
					height: "100%",
					backgroundImage: `url(${myAppLogo})`,
					backgroundSize: "contain",
					backgroundRepeat: "no-repeat",
					backgroundPosition: "center",
					filter: "blur(1px)",
					opacity: 0.3,
					transform: "translateX(-50%) scale(0.95)",
					zIndex: 0,
				}}
			/>

			{/* Banner */}
			<div
				style={{
					position: "relative",
					zIndex: 1,
					width: "100%",
					height: "auto", // Use auto for responsive height
					backgroundColor: "#9EAD39",
					color: "white",
					padding: "10px 0", // Responsive padding
					fontSize: "1.5rem",
					fontWeight: "bold",
					textTransform: "uppercase",
					boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
				}}
			>
				Welcome to Cupboard!
			</div>

			{/* Main Content */}
			<div
				style={{
					position: "absolute", // Change to absolute positioning
					bottom: "20px", // Set bottom offset
					left: "50%", // Center horizontally
					transform: "translateX(-50%)", // Center alignment
					zIndex: 1,
				}}
			>
				{/* Button */}
				<button
					onClick={handleLogin}
					style={{
						padding: "15px 30px",
						fontSize: "1.2rem", // Use rem for responsive font size
						backgroundColor: "#AB4C11",
						color: "white",
						border: "none",
						borderRadius: "5px",
						cursor: "pointer",
						textTransform: "uppercase",
						letterSpacing: "1px",
						minWidth: "200px", // Ensure a minimum width for the button
						maxWidth: "90%", // Ensure the button doesn’t overflow on smaller screens
					}}
				>
					Log In
				</button>
			</div>
		</div>
	);
};

export default Home;
