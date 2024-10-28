/**
 * This page displays all the ingredients available to the user
 */

import { AppBar, Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Toolbar, Typography } from "@mui/material";
import { UserAuth } from "auth/UserAuth";
import { useEffect, useState } from "react";
import { AiOutlineArrowLeft, AiOutlinePlus } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { Ingredient } from "../../models/Ingredient";
import { BackendInterface } from "../../services/BackendInterface";
import "./AllIngredients.css";

interface AllIngredientsProps {
	backend: BackendInterface;
	user: UserAuth;
}

function AllIngredients({ backend, user }: AllIngredientsProps) {
	const navigate = useNavigate();
	const [ingredients, setIngredients] = useState<Ingredient[]>([]);
	const [open, setOpen] = useState(false);
	const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
	const [amount, setAmount] = useState<number | string>("");
	const [unit, setUnit] = useState<string>("g");
	const [selectedList, setSelectedList] = useState<string>("");
	const [allLists, setAllLists] = useState<string[]>([]);

	const units: string[] = ["g", "ml", "count"];
	const lists: string[] = [];

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

	useEffect(() => {
        const fetchLists = async () => {
            try {
                const allLists = await user.getMyLists();
                const listNames = allLists.map((list) => list.name); // Extracting names
                setAllLists(listNames);
            } catch (error) {
                console.error("Error fetching lists:", error);
            }
        };

        fetchLists();
    }, [user]);

	/**
	 * This function handles setting a certain ingredient (so that it can be added to a list)
	 *
	 * @param {Ingredient} ingredient - The ingredient object to be set
	 */
	const handleOpen = (ingredient: Ingredient) => {
		setSelectedIngredient(ingredient);
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
		setAmount("");
		setUnit("g");
		setSelectedList("");
		setSelectedIngredient(null);
	};

	/**
	 *  Purpose: This function handles adding an ingredient to a certain list
	 *  @param {void} - SUBJECT TO CHANGE AFTER IMPLEMENTATION
	 */
	const handleAdd = () => {
		handleClose();
	};

	return (
		<Container maxWidth={false} disableGutters className="sub-color" style={{ height: "100vh" }}>
			{/* App Bar */}
			<AppBar position="static" className="header-color">
				<Toolbar>
					<AiOutlineArrowLeft style={{ fontSize: "24px", color: "white", cursor: "pointer" }} onClick={() => navigate("/logged-in")} />
					<Typography variant="h6" style={{ flexGrow: 1, textAlign: "center" }}>
						All Ingredients
					</Typography>
				</Toolbar>
			</AppBar>

			{/* Main Content */}
			<TableContainer component={Paper} style={{ marginTop: "20px" }}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell style={{ fontWeight: "bold" }}>Name</TableCell>
							<TableCell style={{ fontWeight: "bold" }}>Type</TableCell>
							<TableCell style={{ fontWeight: "bold", textAlign: "center" }}>Action</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{ingredients.map((ingredient) => (
							<TableRow key={ingredient.name}>
								<TableCell>{ingredient.name}</TableCell>
								<TableCell>{ingredient.type}</TableCell>
								<TableCell style={{ textAlign: "center" }}>
									<IconButton className="plus-button secondary-color" onClick={() => handleOpen(ingredient)}>
										<AiOutlinePlus />
									</IconButton>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>

			{/* Popup Dialog for Adding Ingredients */}
			<Dialog open={open} onClose={handleClose} PaperProps={{ className: "secondary-color" }}>
				<DialogTitle>Add Ingredient</DialogTitle>
				<DialogContent>
					<TextField
						autoFocus
						margin="dense"
						label="Amount"
						type="number"
						value={amount}
						onChange={(e) => setAmount(e.target.value)}
						fullWidth
						inputProps={{ step: "0.1", min: "0" }} // Allows only floats
						style ={{backgroundColor: 'white'}}
					/>
					<div style={{ marginBottom: '0.5px', color: 'black' }}>
                         Unit
                    </div>
					<TextField select value={unit} onChange={(e) => setUnit(e.target.value)} fullWidth style={{ marginTop: "10px" , backgroundColor: 'white'}}>
						{units.map((option) => (
							<MenuItem key={option} value={option}>
								{option}
							</MenuItem>
						))}
					</TextField>


					{/* New dropdown for selecting a list */}
					<div style={{ marginBottom: '0.5px', color: 'black' }}>
                         List Name
                    </div>
					<TextField select value={selectedList} onChange={(e) => setSelectedList(e.target.value)} fullWidth style={{ marginTop: "10px", backgroundColor: 'white' }}>
						{allLists.length === 0 ? (
							<MenuItem value="">No lists available</MenuItem>
						) : (
							allLists.map((listItem) => (
								<MenuItem key={listItem} value={listItem}>
									{listItem}
								</MenuItem>
							))
						)}
					</TextField>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} className="primary-color" style= {{color : 'black'}}>
						Cancel
					</Button>
					<Button onClick={handleAdd} className="primary-color" style= {{color : 'black'}}>
						Add
					</Button>
				</DialogActions>
			</Dialog>
		</Container>
	);
}

export default AllIngredients;
