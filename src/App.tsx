// App.tsx
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import UserAuthFactory from "./auth/UserAuthFactory";
import AllIngredients from "./components/AllIngredients/AllIngredients"; // Import AllIngredients
import Home from "./components/Home/Home";
import LoggedIn from "./components/LoggedIn/LoggedIn";
//import MyLists from "./components/MyLists/MyLists"; // Import MyLists
import BackendFactory from "./services/BackendFactory"; // Import your BackendFactory


function App() {
	const userAuth = UserAuthFactory();
	const backend = BackendFactory(userAuth); // Use BackendFactory to get the appropriate backend instance

	return (
		<Router>
			<Routes>
				<Route path="/" element={<Home userAuth={userAuth} />} />
				<Route path="/logged-in" element={<LoggedIn userAuth={userAuth} />} />
				<Route path="/all-ingredients" element={<AllIngredients backend={backend} />} /> {/* Pass backend to AllIngredients */}
			</Routes>
		</Router>
	);
}

export default App;
