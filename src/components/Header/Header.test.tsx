import { render, screen } from "@testing-library/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./Header"; // adjust path if needed

describe("Header", () => {
	// Mock props for Header
	const mockProps = {
		searchQuery: "",
		searchQueryChange: jest.fn(),
	};

	// Helper component to render Header with a specific path
	const TestHeader = ({ path }) => {
		window.history.pushState({}, "Test page", path);

		return (
			<BrowserRouter>
				<Routes>
					<Route
						path="*"
						element={<Header {...mockProps} />}
					/>
				</Routes>
			</BrowserRouter>
		);
	};

	it("displays 'Ingredient Selections' for the '/all-ingredients' path", () => {
		render(<TestHeader path="/all-ingredients" />);
		expect(screen.getByText("Ingredient Selections")).toBeInTheDocument();
	});

	it("displays 'My Lists' for the '/my-lists' path", () => {
		render(<TestHeader path="/my-lists" />);
		expect(screen.getByText("My Lists")).toBeInTheDocument();
	});

	it("displays dynamic list name for the '/view-list/:listName' path", () => {
		render(<TestHeader path="/view-list/shopping-list" />);
		expect(screen.getByText("shopping-list")).toBeInTheDocument();
	});

	it("decodes URL-encoded names in dynamic routes", () => {
		render(<TestHeader path="/view-list/a%20b%20c" />);
		expect(screen.getByText("a b c")).toBeInTheDocument();
	});

	it("displays '404 Page Not Found' for an unknown path", () => {
		render(<TestHeader path="/unknown-path" />);
		expect(screen.getByText("404 Page Not Found")).toBeInTheDocument();
	});
});
