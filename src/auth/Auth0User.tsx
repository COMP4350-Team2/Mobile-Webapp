// src/auth/Auth0User.tsx
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { UserAuth } from "./UserAuth";

export class Auth0User implements UserAuth {
	private auth0 = useAuth0();
	private _accessToken;

	login() {
		this.auth0.loginWithRedirect(); //logs the user in using auth0 redirect
	}

	logout() {
		this.auth0.logout(); //logs the user out using auth0 logout
	}

	isAuthenticated(): boolean {
		return this.auth0.isAuthenticated; // This will be false initially until Auth0 completes login
	}

	isAuth0User = () => true;

	getAccessMessage(): void {
		var token =
			"eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ims2QkJ4X0hCdUxab2ZIU0JtUU5zLSJ9.eyJuaWNrbmFtZSI6InNhbWtlaTI4MTciLCJuYW1lIjoic2Fta2VpMjgxN0BnbWFpbC5jb20iLCJwaWN0dXJlIjoiaHR0cHM6Ly9zLmdyYXZhdGFyLmNvbS9hdmF0YXIvMDRjZmYxZDQwNmM0MmE4NjAyM2Y4ZjVlOTY0MTBjNzY_cz00ODAmcj1wZyZkPWh0dHBzJTNBJTJGJTJGY2RuLmF1dGgwLmNvbSUyRmF2YXRhcnMlMkZzYS5wbmciLCJ1cGRhdGVkX2F0IjoiMjAyNC0xMC0wNlQwODozNToxNS45MTRaIiwiZW1haWwiOiJzYW1rZWkyODE3QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczovL2Rldi1jdXBib2FyZC5jYS5hdXRoMC5jb20vIiwiYXVkIjoiTFRIRjNCQWpNcVduOGJVN1hDdHFXbjZGNWdLR2g2SVEiLCJpYXQiOjE3MjgyMDM3NjksImV4cCI6MTcyODIzOTc2OSwic3ViIjoiYXV0aDB8NjZmZWQ5Njg4YjVmYTg3MTIzYTRjZjEzIiwic2lkIjoiT19Sc2d1Rml1QWdTNmhDUlh2Q0NVWVVKTFg5S0VNY3UiLCJub25jZSI6IlNHVlFkR1pQYzBsUmREaEJPWEZRYjJSbFNtSjRZVFo2ZVZsNVJIRnZNR3N1WVhGbFNXMU9RVzlDTWc9PSJ9.eOsIhOeEkq5a_5hUVW5UbKH8V_xo7jX1IqYQ6zEEfQkvNiWDYYjmCTbTYNBZ7_v5mW-VcCNwKfsk3ich470DnYz7J0jIKvhIvBFoARgC9TpiLWZMG_ug7nBzL0O_Mai4SDWGZCCxN3Lo_7E4k2R010t_yHBmJauwt2Ql3j-0pTOpk2RQLQnOMcMZ3NsgejojqawMWa5hW-WfeJ6452FS_-mLvNmZt9kg-yKYS0BTnijRHnK5B5Orcu0GWUmnhjW7wevRcliiXonVO-bb9SsfYFeRq0z-aHCEmJMobZFrSEQgAWy_EwV90TYultyL74cxqUYtCeu04CysM-TPnkRKAw";

		axios
			.get("http://localhost:8000/api/private", {
				headers: {
					authorization: "Bearer " + token,
				},
			})
			.then(function (response) {
				console.log(response.data);
			})
			.catch(function (error) {
				console.error(error);
			});
	}

	storeAccessToken() {
		this.auth0.getAccessTokenSilently().then((token) => (this._accessToken = token));
	}

	get accessToken(): string {
		return this._accessToken;
	}
}
