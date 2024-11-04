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
	isFirstLoggin: boolean;
	setIsFirstLoggin: (val: boolean) => void;
}

function LoggedIn({ userAuth, isFirstLoggin, setIsFirstLoggin }: LoggedInProps) {
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(true);
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	useEffect(() => {
		const checkAuth = async () => {
			while (userAuth.isProcessing()) {
				await new Promise((resolve) => setTimeout(resolve, 100)); // Wait 100ms before rechecking
			}

			if (userAuth.isAuthenticated() && isFirstLoggin) {
				userAuth.storeAccessToken!();
				setIsFirstLoggin(false);
			} else if (!userAuth.isAuthenticated()) {
				navigate("/");
			}
			setIsLoading(false);
		};

		setIsLoading(true);
		checkAuth();
	}, [navigate, userAuth, isFirstLoggin, setIsFirstLoggin]);

	const handleLogout = () => {
		userAuth.logout();
		navigate("/");
	};

	const userType = userAuth instanceof MockUser ? "Mock User" : "Auth0 User"; // Determine user type (for printing purposes)



    return (
        <div 
            className="sub-color" 
            style={{ height: "100vh" }}
        >
            {/* Background Logo */}
            <div className="logo-background" />
    
            {/* Main Content */}
            {isLoading && true? (
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
                    <div 
                        className="secondary-color profile-button" 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
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
    
                            <div style={{ color: "white", fontSize: "1.2rem", marginBottom: "20px" }}>
                                User Type: {userType}
                            </div>
    
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
                        <div
                            className="primary-color card"
                            onClick={() => navigate("/my-lists")}
                            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                        >
                            My Lists
                        </div>
    
                        {/* Card for "View All Ingredients" */}
                        <div
                            className="primary-color card"
                            onClick={() => navigate("/all-ingredients")}
                            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                        >
                            All Ingredients
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
    
    
}

export default LoggedIn;
