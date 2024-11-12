import ListNav from "components/ListNav/ListNav";
import MyLists from "components/MyLists/MyLists";
import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import UserAuthFactory from "./auth/UserAuthFactory";
import AllIngredients from "./components/AllIngredients/AllIngredients";
import Header from "./components/Header/Header";
import Home from "./components/Home/Home";
import LoggedIn from "./components/LoggedIn/LoggedIn";
import BackendFactory from "./services/BackendFactory";

function App() {
	const [isFirstLoggin, setIsFirstLoggin] = useState(true);
	const userAuth = UserAuthFactory();
	const backend = BackendFactory(userAuth);

	const router = createBrowserRouter([
		{
			path: "/",
			element: <Home userAuth={userAuth} />,
			errorElement: <div>404 Page Not Found</div>,
		},
		{
			element: (
				<>
					<Header></Header>
				</>
			),
			children: [
				{
					path: "/logged-in",
					element: (
						<LoggedIn
							userAuth={userAuth}
							isFirstLoggin={isFirstLoggin}
							setIsFirstLoggin={(val) => setIsFirstLoggin(val)}
						/>
					),
					errorElement: <div>404 Page Not Found</div>,
				},
				{
					path: "/all-ingredients",
					element: (
						<AllIngredients
							backend={backend}
							user={userAuth}
						/>
					),
					errorElement: <div>404 Page Not Found</div>,
				},
				{
					path: "/my-lists",
					element: (
						<MyLists
							userAuth={userAuth}
							backendInterface={backend}
						/>
					),
					errorElement: <div>404 Page Not Found</div>,
				},
				{
					path: "/view-list/:listName",
					element: (
						<ListNav
							userAuth={userAuth}
							backendInterface={backend}
						/>
					),
					errorElement: <div>404 Page Not Found</div>,
				},
			],
		},
	]);

	return <RouterProvider router={router} />;
}

export default App;
