import { createBrowserRouter, RouterProvider } from "react-router-dom";
import UserAuthFactory from "./auth/UserAuthFactory";
import AllIngredients from "./components/AllIngredients/AllIngredients";
import Home from "./components/Home/Home";
import LoggedIn from "./components/LoggedIn/LoggedIn";
import BackendFactory from "./services/BackendFactory";

function App() {
	const userAuth = UserAuthFactory();
	const backend = BackendFactory(userAuth);
	const router = createBrowserRouter([
		{
			path: "/",
			element: <Home userAuth={userAuth} />,
			errorElement: <div>404 Page Not Found</div>,
		},
		{
			path: "/logged-in",
			element: <LoggedIn userAuth={userAuth} />,
			errorElement: <div>404 Page Not Found</div>,
		},
		{
			path: "/all-ingredients",
			element: <AllIngredients backend={backend} />,
			errorElement: <div>404 Page Not Found</div>,
		},
	]);

	return <RouterProvider router={router} />;
}

export default App;
