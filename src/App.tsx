import MyLists from "components/MyLists/MyLists";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import UserAuthFactory from "./auth/UserAuthFactory";
import AllIngredients from "./components/AllIngredients/AllIngredients";
import Home from "./components/Home/Home";
import LoggedIn from "./components/LoggedIn/LoggedIn";
import BackendFactory from "./services/BackendFactory";
function App() {
	const userAuth = UserAuthFactory();
	const backend = BackendFactory(userAuth);

	return (
		<Router>
			<Routes>
				<Route path="/" element={<Home userAuth={userAuth} />} />
				<Route path="/logged-in" element={<LoggedIn userAuth={userAuth} />} />
				<Route path="/all-ingredients" element={<AllIngredients backend={backend} />} /> {}
                <Route path="/my-lists" element={<MyLists userAuth={userAuth} />} />
			</Routes>
		</Router>
	);
}

export default App;
