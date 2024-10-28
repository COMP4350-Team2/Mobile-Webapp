/**
 * This page is what the user is redirected to once theyve successfully logged in.
 */
import { useEffect, useState } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { MockUser } from "../../auth/MockUser";
import { UserAuth } from "../../auth/UserAuth";
import Loading from "../Loading/Loading";
import "./LoggedIn.css";

interface LoggedInProps {
	userAuth: UserAuth;
}

function LoggedIn({ userAuth }: LoggedInProps) {
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(true);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);

	useEffect(() => {
		const checkAuth = async () => {
			while (userAuth.isProcessing()) {
				await new Promise((resolve) => setTimeout(resolve, 100)); // Wait 100ms before rechecking
			}

			if (userAuth.isAuthenticated()) {
				setIsLoading(false);
				userAuth.storeAccessToken!();
			} else {
				navigate("/");
			}
		};

		setIsLoading(true);
		checkAuth();
	}, [navigate, userAuth]);

	const handleLogout = () => {
		userAuth.logout();
		navigate("/");
	};

	const userType = userAuth instanceof MockUser ? "Mock User" : "Auth0 User"; // Determine user type (for printing purposes)

	//These two methods are just for showing the sliding modal for logging out
	const showComingSoonModal = () => {
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
	};

	return (
		<div className="sub-color" style={{ height: "100vh" }}>
			{/* Background Logo */}
			<div className="logo-background" />
			{/* Main Content */}
			{isLoading ? (
				<Loading />
			) : (
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						alignItems: "center",
						height: "100%", // Full height
						textAlign: "center",
						fontFamily: "Arial, sans-serif",
						overflowY: "clip",
					}}
				>
					{/* Top Right User Profile Icon */}
					<div className="secondary-color profile-button" onClick={() => setIsMenuOpen(!isMenuOpen)}>
						<FaUserCircle style={{ fontSize: "36px", color: "white" }} />
					</div>

					{/* Sliding Menu */}
					{isMenuOpen && (
						<div
							className="secondary-color"
							style={{
								position: "fixed",
								top: 0,
								right: 0,
								width: "250px",
								height: "100%",
								boxShadow: "-2px 0 5px rgba(0, 0, 0, 0.5)",
								padding: "20px",
								zIndex: 1000,
								transition: "transform 0.3s ease",
								opacity: 0.95,
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
								className="primary-color logout-button"
								onClick={handleLogout}
								style={{
									color: "white",
									padding: "10px 20px",
									border: "none",
									borderRadius: "5px",
									cursor: "pointer",
									transition: "background-color 0.3s ease",
								}}
							>
								Log Out
							</button>
						</div>
					)}

					{/* Cards Container */}
					<div className="card-container">
						{/* Card for "View My Lists" */}
						<div className="primary-color card" onClick={showComingSoonModal} onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")} onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}>
							My Lists
						</div>

						{/* Card for "View All Ingredients" */}
						<div
							className="primary-color card"
							onClick={() => navigate("/all-ingredients")} // Navigate to All Ingredients page
							onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
							onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
						>
							All Ingredients
						</div>
					</div>
				</div>
			)}

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
							className="secondary-color"
							onClick={closeModal}
							style={{
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
