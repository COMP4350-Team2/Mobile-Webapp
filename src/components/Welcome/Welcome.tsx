import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { UserAuth } from "../../auth/UserAuth";
import "./Welcome.css";

interface WelcomeProps {
	userAuth: UserAuth; // Receive UserAuth from props
}

function Welcome({ userAuth }: WelcomeProps) {
	const navigate = useNavigate();

	const handleLogin = () => {
		if (!userAuth.isAuthenticated()) {
			userAuth.login().catch(async (e: Error) => {
				navigate("/");
				await new Promise((resolve) => setTimeout(resolve, 100));
				toast.error(e.message || "An error occurred while logging in.");
			});
		}
		navigate("/home");
	};

	return (
		<div className="container">
			{/* Background Logo */}
			<div className="logo-background" />

			{/* Banner */}
			<span className="header-color header">Welcome to Cupboard!</span>

			{/* Main Content */}
			<div className="sub-color"></div>
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
						position: "absolute",
						top: "-175px",
						left: "50%",
						transform: "translateX(-50%)",
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

			<ToastContainer
				position="top-center"
				autoClose={2000}
			/>
		</div>
	);
}

export default Welcome;
