/* Our starting point of the app. */
import { Auth0Provider } from "@auth0/auth0-react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const domain = process.env.REACT_APP_AUTH0_DOMAIN ?? "";
const clientId = process.env.REACT_APP_CLIENT_ID ?? "";
const auth_audience = process.env.REACT_APP_AUTH0_AUDIENCE ?? "";

const container = document.getElementById("root")!;
const root = createRoot(container); // Create root for React 18

root.render(
	<Auth0Provider
		domain={domain}
		clientId={clientId}
		useRefreshTokens={true}
		cacheLocation="localstorage"
		authorizationParams={{
			redirect_uri: `${window.location.origin}/home`,
			audience: auth_audience,
			scope: "read:post openid profile email offline_access",
		}}
	>
		<App />
	</Auth0Provider>
);
