/**
 * This page displays all the ingredients available to the user
 */

import {
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    MenuItem,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
} from "@mui/material";
import { UserAuth } from "auth/UserAuth";
import isNumber from "is-number";
import { useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { useOutletContext } from "react-router-dom";
import { Ingredient } from "../../models/Ingredient";
import { BackendInterface } from "../../services/BackendInterface";
import { LayoutContext } from "../Layout/Layout";
import "./AllIngredients.css";

interface AllIngredientsProps {
	backend: BackendInterface;
	user: UserAuth;
}

function AllIngredients({ backend, user }: AllIngredientsProps) {
	const { searchQuery } = useOutletContext<LayoutContext>();

	const [ingredients, setIngredients] = useState<Ingredient[]>([]);
	const [open, setOpen] = useState(false);
	const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
	const [amount, setAmount] = useState<number | string>("");
	const [selectedList, setSelectedList] = useState<string>("");
	const [allLists, setAllLists] = useState<string[]>([]);
	const [units, setUnits] = useState<string[]>([]);
	const [selectedUnit, setSelectedUnit] = useState<string>("g"); //dropdown menu
	const [amountError, setAmountError] = useState<string>("");

	/**
	 * This hook calls the BackendInterface and retrieves all ingredients by invoking the getAllIngredients method.
	 * Once the result is validated, it calls setIngredients to display all available ingredients.
	 */
	useEffect(() => {
		backend
			.getAllIngredients()
			.then((res) => {
				if (Array.isArray(res)) {
					setIngredients(res);
				} else {
					throw new Error("Unexpected response format");
				}
			})
			.catch((error) => {
				console.error("Error fetching ingredients:", error);
			});
	}, [backend]);

	//the hook for rendering all the user's lists
	useEffect(() => {
		const fetchLists = async () => {
			try {
				const allLists = await backend.getMyLists();
				const listNames = allLists.map((list) => list.name); // Extracting names
				setAllLists(listNames);
			} catch (error) {
				console.error("Error fetching lists:", error);
			}
		};

		fetchLists();
	}, [backend]);

	//the hook for fetching measurements
	useEffect(() => {
		const fetchUnits = async () => {
			try {
				const fetchedUnits = await backend.getAllMeasurements();
				setUnits(fetchedUnits);
				if (fetchedUnits.length > 0) {
					setSelectedUnit(fetchedUnits[0]); // Set the default unit to the first fetched unit
				}
			} catch (error) {
				console.error("Error fetching units:", error);
			}
		};

		fetchUnits();
	}, [backend]);

	/**
	 * This function handles setting a certain ingredient (so that it can be added to a list)
	 *
	 * @param {Ingredient} ingredient - The ingredient object to be set
	 */
	const handleOpen = (ingredient: Ingredient) => {
		setSelectedIngredient(ingredient);
		setOpen(true);
		setAmountError("");
	};

	const handleClose = () => {
		setOpen(false);
		setAmount("");
		setSelectedUnit(units.length > 0 ? units[0] : "g");
		setSelectedList("");
		setSelectedIngredient(null);
		setAmountError("");
	};

	/**
	 *  Purpose: This function handles adding an ingredient to a certain list
	 */
	const handleAdd = async () => {
		if (!selectedIngredient || !selectedList) {
			console.error("Missing required fields: ingredient or list");
			return;
		}

		try {
			const parsedAmount = parseFloat(amount as string);
			if (parsedAmount <= 0 && isNumber(amount)) {
				setAmountError("Please enter a valid amount.");
				return;
			}
			const ingredientToAdd = new Ingredient(
				selectedIngredient.name,
				selectedIngredient.type,
				parsedAmount,
				selectedUnit
			);
			// Call the addIngredient method on the backend
			await backend.addIngredient(selectedList, ingredientToAdd);
			handleClose();
		} catch (error) {
			console.error("Error adding ingredient:", error);
		}
	};

	const filteredIngredients = ingredients.filter((ingredient) =>
		ingredient.name.toLowerCase().includes(searchQuery.toLowerCase())
	);

    const highlightText = (text: string, query: string) => {
        if (!query) return text;
    
        const parts = text.split(new RegExp(`(${query})`, "gi"));
        return parts.map((part, index) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <span key={index} style={{fontWeight: "bold" }}>
              {part}
            </span>
          ) : (
            part
          )
        );
    };

	return (
		<Container
			maxWidth={false}
			disableGutters
			className="sub-color"
			style={{ height: "100%" }}
		>
			{/* Main Content */}
			<TableContainer
				component={Paper}
				style={{ marginTop: "20px" }}
			>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell style={{ fontWeight: "bold" }}>Name</TableCell>
							<TableCell style={{ fontWeight: "bold" }}>Type</TableCell>
							<TableCell style={{ fontWeight: "bold", textAlign: "center" }}>Action</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{filteredIngredients.map((ingredient) => (
							<TableRow key={ingredient.name}>
								<TableCell>{highlightText(ingredient.name, searchQuery)}</TableCell>
								<TableCell>{ingredient.type}</TableCell>
								<TableCell style={{ textAlign: "center" }}>
									<IconButton
										className="plus-button secondary-color"
										onClick={() => handleOpen(ingredient)}
									>
										<AiOutlinePlus />
									</IconButton>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>

			{/* Popup Dialog for Adding Ingredients */}
			<Dialog
				open={open}
				onClose={handleClose}
				PaperProps={{ className: "secondary-color" }}
			>
				<DialogTitle>Add Ingredient</DialogTitle>
				<DialogContent>
					<TextField
						autoFocus
						margin="dense"
						label="Amount"
						type="number"
						value={amount}
						onChange={(e) => {
							const value = e.target.value;
							setAmount(value);
							if (parseFloat(value) > 0 && isNumber(value)) {
								setAmountError("");
							}
						}}
						fullWidth
						inputProps={{ step: "0.1", min: "0" }}
						style={{ backgroundColor: "white" }}
					/>
					{amountError && <div style={{ color: "red" }}>{amountError}</div>}
					<div style={{ marginBottom: "0.5px", color: "black" }}>Unit</div>
					<TextField
						select
						value={selectedUnit}
						onChange={(e) => setSelectedUnit(e.target.value)}
						fullWidth
						style={{ marginTop: "10px", backgroundColor: "white" }}
					>
						{units.map((option) => (
							<MenuItem
								key={option}
								value={option}
							>
								{option}
							</MenuItem>
						))}
					</TextField>

					{/* New dropdown for selecting a list */}
					<div style={{ marginBottom: "0.5px", color: "black" }}>List Name</div>
					<TextField
						select
						value={selectedList}
						onChange={(e) => setSelectedList(e.target.value)}
						fullWidth
						style={{ marginTop: "10px", backgroundColor: "white" }}
					>
						{allLists.length === 0 ? (
							<MenuItem value="">No lists available</MenuItem>
						) : (
							allLists.map((listItem) => (
								<MenuItem
									key={listItem}
									value={listItem}
								>
									{listItem}
								</MenuItem>
							))
						)}
					</TextField>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={handleClose}
						className="primary-color"
						style={{ color: "black" }}
					>
						Cancel
					</Button>
					<Button
						onClick={handleAdd}
						className="primary-color"
						style={{ color: "black" }}
					>
						Add
					</Button>
				</DialogActions>
			</Dialog>
		</Container>
	);
}

export default AllIngredients;
