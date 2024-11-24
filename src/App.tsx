import UserAuthFactory from "auth/UserAuthFactory";
import AllIngredients from "components/AllIngredients/AllIngredients";
import Home from "components/Home/Home";
import Layout from "components/Layout/Layout";
import ListNav from "components/ListNav/ListNav";
import MyLists from "components/MyLists/MyLists";
import Welcome from "components/Welcome/Welcome";
import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import BackendFactory from "services/BackendFactory";
import "./App.css";

function App() {
	const [isFirstLoggin, setIsFirstLoggin] = useState(true);
	const userAuth = UserAuthFactory();
	const backend = BackendFactory(userAuth);

	const router = createBrowserRouter([
		{
			path: "/",
			element: <Welcome userAuth={userAuth} />,
			errorElement: <div>404 Page Not Found</div>,
		},
		{
			element: <Layout userAuth={userAuth} />,
			children: [
				{
					path: "/home",
					element: (
						<Home
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

	return (
		<>
			<RouterProvider router={router} />
		</>
	);
}

export default App;
