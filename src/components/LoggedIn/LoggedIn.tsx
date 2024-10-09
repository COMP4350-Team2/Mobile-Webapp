import { useState } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai"; // Importing Back icon
import { FaUserCircle } from "react-icons/fa"; // Importing Profile icon
import { useNavigate } from "react-router-dom";
import myAppLogo from "../../assets/Cupboard_Logo.png"; // Import your logo image
import { MockUser } from "../../auth/MockUser";
import { UserAuth } from "../../auth/UserAuth";

interface LoggedInProps {
	userAuth: UserAuth; // Define the prop type
}

function LoggedIn({ userAuth }: LoggedInProps) {
	const navigate = useNavigate();
	const [isMenuOpen, setIsMenuOpen] = useState(false); // State to control sliding menu
	const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

	// Check authentication state
	if (!userAuth.isAuthenticated()) {
		// If not authenticated, redirect to home
		navigate("/");
		return null; // Prevent rendering of the component
	} else {
		userAuth.storeAccessToken!();
	}

	const handleLogout = () => {
		userAuth.logout(); // Log out the user
		navigate("/"); // Navigate back to the home page
	};

	const userType = userAuth instanceof MockUser ? "Mock User" : "Auth0 User"; // Determine user type

	const showComingSoonModal = () => {
		setIsModalOpen(true); // Show the modal
	};

	const closeModal = () => {
		setIsModalOpen(false); // Close the modal
	};

	return (
		<div style={{ position: "relative", height: "100vh", backgroundColor: "#99D9EA" }}>
			{/* Background Logo */}
			<div
				style={{
					position: "absolute",
					top: 0,
					left: "50%",
					width: "100%",
					height: "100%",
					backgroundImage: `url(${myAppLogo})`,
					backgroundSize: "contain", // Change to 'cover' for full coverage
					backgroundRepeat: "no-repeat",
					backgroundPosition: "center",
					filter: "blur(1px)", // Blur effect
					opacity: 0.3,
					transform: "translateX(-50%) scale(0.95)", // Scale down for zoom effect (change 0.9 to experiment)
					zIndex: 0,
				}}
			/>

			{/* Main Content */}
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
					height: "100%", // Full height
					textAlign: "center",
					fontFamily: "Arial, sans-serif",
					position: "relative",
					zIndex: 1, // Ensure content is above the background
				}}
			>
				{/* Top Right User Profile Icon */}
				<div
					style={{
						position: "absolute",
						top: "20px",
						right: "20px",
						display: "flex",
						alignItems: "center",
						cursor: "pointer",
						padding: "10px",
						borderRadius: "50%",
						backgroundColor: "#7FB5D8",
						boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
						transition: "background-color 0.3s ease",
					}}
					onClick={() => setIsMenuOpen(!isMenuOpen)}
					onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#A8D1E6")}
					onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#7FB5D8")}
				>
					<FaUserCircle style={{ fontSize: "36px", color: "white" }} />
				</div>

				{/* Sliding Menu */}
				{isMenuOpen && (
					<div
						style={{
							position: "absolute",
							top: 0,
							right: 0,
							width: "250px",
							height: "100vh",
							backgroundColor: "#88B4D8",
							boxShadow: "-2px 0 5px rgba(0, 0, 0, 0.5)",
							padding: "20px",
							zIndex: 1000,
							transition: "transform 0.3s ease",
						}}
					>
						{/* Back Icon and Text */}
						<div
							style={{
								display: "flex",
								alignItems: "center",
								marginBottom: "20px",
							}}
						>
							<AiOutlineArrowLeft
								style={{
									fontSize: "24px",
									color: "white",
									cursor: "pointer",
									marginRight: "10px",
								}}
								onClick={() => setIsMenuOpen(false)}
							/>
							<span
								style={{
									color: "white",
									fontSize: "18px",
									cursor: "pointer",
								}}
								onClick={() => setIsMenuOpen(false)}
							>
								Back
							</span>
						</div>

						<div style={{ color: "white", fontSize: "1.2rem", marginBottom: "20px" }}>User Type: {userType}</div>

						<button
							onClick={handleLogout}
							style={{
								backgroundColor: "red",
								color: "white",
								padding: "10px 20px",
								border: "none",
								borderRadius: "5px",
								cursor: "pointer",
								transition: "background-color 0.3s ease",
							}}
							onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#D94F4F")}
							onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "red")}
						>
							Log Out
						</button>
					</div>
				)}

				{/* Cards Container */}
				<div
					style={{
						display: "flex",
						flexDirection: "row",
						alignItems: "center",
						gap: "360px",
						marginTop: "100px",
					}}
				>
					{/* Card for "View My Lists" */}
					<div
						onClick={showComingSoonModal} // Show modal instead of navigating
						style={{
							backgroundColor: "#AB4C11",
							color: "white",
							padding: "20px",
							borderRadius: "15px",
							width: "150px",
							height: "150px",
							cursor: "pointer",
							boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
							transition: "transform 0.3s ease",
							display: "flex",
							flexDirection: "column",
							justifyContent: "center",
							alignItems: "center",
						}}
						onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
						onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
					>
						My Lists
					</div>

					{/* Card for "View All Ingredients" */}
					<div
						onClick={() => navigate("/all-ingredients")} // Navigate to All Ingredients page
						style={{
							backgroundColor: "#AB4C11",
							color: "white",
							padding: "20px",
							borderRadius: "15px",
							width: "150px",
							height: "150px",
							cursor: "pointer",
							boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
							transition: "transform 0.3s ease",
							display: "flex",
							flexDirection: "column",
							justifyContent: "center",
							alignItems: "center",
						}}
						onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
						onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
					>
						All Ingredients
					</div>
				</div>
			</div>

			{/* Modal for Coming Soon */}
			{isModalOpen && (
				<div
					style={{
						position: "fixed",
						top: 0,
						left: 0,
						width: "100%",
						height: "100%",
						backgroundColor: "rgba(0, 0, 0, 0.5)",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						zIndex: 2000,
					}}
					onClick={closeModal}
				>
					<div
						style={{
							backgroundColor: "#fff",
							padding: "30px",
							borderRadius: "10px",
							textAlign: "center",
						}}
						onClick={(e) => e.stopPropagation()} // Prevent click on modal from closing it
					>
						<h2>Coming Soon!</h2>
						<p>Team Teacup is working hard to bring this feature to you. Stay tuned for our next release!</p>
						<button
							onClick={closeModal}
							style={{
								backgroundColor: "#AB4C11",
								color: "white",
								padding: "10px 20px",
								border: "none",
								borderRadius: "5px",
								cursor: "pointer",
							}}
						>
							Close
						</button>
					</div>
				</div>
			)}
		</div>
	);
}

export default LoggedIn;
