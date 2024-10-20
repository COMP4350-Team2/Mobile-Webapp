import { UserAuth } from "../../auth/UserAuth";
import "./Home.css";

interface HomeProps {
	userAuth: UserAuth; // Receive UserAuth from props
}

function Home({ userAuth }: HomeProps) {
	const handleLogin = () => {
		if (!userAuth.isAuthenticated()) {
			userAuth.login(); // Log in the user using Auth0 or Mock User
		}
	};

	return (
		<div className="container">
			{/* Background Logo */}
			<div className="sub-color logo-background" />

			{/* Banner */}
			<span className="header-color header">Welcome to Cupboard!</span>

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
					className="primary-color"
					style={{
						padding: "15px 30px",
						fontSize: "1.2rem", // Use rem for responsive font size
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
}

export default Home;
