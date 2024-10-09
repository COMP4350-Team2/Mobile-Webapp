import { AppBar, Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Toolbar, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { AiOutlineArrowLeft, AiOutlinePlus } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { Ingredient } from "../../models/Ingredient";
import { BackendInterface } from "../../services/BackendInterface";

interface AllIngredientsProps {
	backend: BackendInterface;
}

function AllIngredients({ backend }: AllIngredientsProps) {
	const navigate = useNavigate();
	const [ingredients, setIngredients] = useState<Ingredient[]>([]);
	const [open, setOpen] = useState(false);
	const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
	const [amount, setAmount] = useState<number | string>("");
	const [unit, setUnit] = useState<string>("g");
	const [list, setList] = useState<string>("");

	const units: string[] = ["g", "ml", "count"];
	const lists: string[] = [];

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

	const handleOpen = (ingredient: Ingredient) => {
		setSelectedIngredient(ingredient);
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
		setAmount("");
		setUnit("g");
		setList("");
		setSelectedIngredient(null);
	};

	const handleAdd = () => {
		// Handle adding ingredient logic here (currently does nothing)
		console.log("Added:", { ingredient: selectedIngredient, amount, unit, list });
		handleClose();
	};

	return (
		<Container maxWidth={false} disableGutters style={{ height: "100vh", backgroundColor: "#99D9EA" }}>
			{/* App Bar */}
			<AppBar position="static" style={{ backgroundColor: "#9EAD39" }}>
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
									<IconButton onClick={() => handleOpen(ingredient)}>
										<AiOutlinePlus style={{ color: "#AB4C11" }} />
									</IconButton>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>

			{/* Popup Dialog for Adding Ingredients */}
			<Dialog open={open} onClose={handleClose}>
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
					/>
					<TextField select label="Unit" value={unit} onChange={(e) => setUnit(e.target.value)} fullWidth style={{ marginTop: "10px" }}>
						{units.map((option) => (
							<MenuItem key={option} value={option}>
								{option}
							</MenuItem>
						))}
					</TextField>
					{/* New dropdown for selecting a list (currently empty) */}
					<TextField select label="Select List" value={list} onChange={(e) => setList(e.target.value)} fullWidth style={{ marginTop: "10px" }}>
						{/* Currently no options */}
						{lists.length === 0 ? (
							<MenuItem value="">No lists available</MenuItem>
						) : (
							lists.map((listItem) => (
								<MenuItem key={listItem} value={listItem}>
									{listItem}
								</MenuItem>
							))
						)}
					</TextField>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="primary">
						Cancel
					</Button>
					<Button onClick={handleAdd} color="primary">
						Add
					</Button>
				</DialogActions>
			</Dialog>
		</Container>
	);
}


export default AllIngredients;

