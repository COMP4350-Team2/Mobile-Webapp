import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import UserAuthFactory from "./auth/UserAuthFactory";
import Home from "./components/Home/Home";
import MyLists from "./MyLists/MyLists"; // Import MyLists
import LoggedIn from "./components/LoggedIn/LoggedIn";

const App: React.FC = () => {
	const userAuth = UserAuthFactory();

	return (
		<Router>
			<Routes>
				<Route path="/" element={<Home userAuth={userAuth} />} />
				<Route path="/logged-in" element={<LoggedIn userAuth={userAuth} />} />
				<Route path="/my-lists" element={<MyLists />} /> {/* Add route for MyLists */}
			</Routes>
		</Router>
	);
};

export default App;
