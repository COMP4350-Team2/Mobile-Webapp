/**
 * This page is what the user is redirected to once theyve successfully logged in.
 */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../../auth/UserAuth";
import Loading from "../Loading/Loading";

interface HomeProps {
	userAuth: UserAuth;
}

function Home({ userAuth }: HomeProps) {
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const checkAuth = async () => {
			while (userAuth.isProcessing()) {
				await new Promise((resolve) => setTimeout(resolve, 100)); // Wait 100ms before rechecking
			}

			if (!userAuth.isAuthenticated()) {
				navigate("/");
			}
			setIsLoading(false);
		};

		setIsLoading(true);
		checkAuth();
	}, [navigate, userAuth]);

	return (
		<div
			className="sub-color"
			style={{ height: "100%" }}
		>
			{/* Background Logo */}
			<div className="logo-background" />

			{/* Main Content */}
			{isLoading && true ? <Loading /> : <div></div>}
		</div>
	);
}

export default Home;
