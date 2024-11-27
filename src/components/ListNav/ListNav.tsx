import { Add, Delete, Edit, SwapHoriz } from "@mui/icons-material";
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Fab,
    Grid,
    IconButton,
    MenuItem,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import { UserAuth } from "auth/UserAuth";
import isNumber from "is-number";
import { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { BackendInterface } from "services/BackendInterface";
import { Ingredient } from "../../models/Ingredient";
import { LayoutContext } from "../Layout/Layout";

interface ListNavProps {
	backendInterface: BackendInterface;
	userAuth: UserAuth;
}

function ListNav({ userAuth, backendInterface }: ListNavProps) {
	const { listName } = useParams<{ listName: string }>();
	const { searchQuery } = useOutletContext<LayoutContext>();

	const [ingredients, setIngredients] = useState<Ingredient[]>([]);
	const [open, setOpen] = useState(false); //first dialogue for all ingredients
	const [allIngredients, setAllIngredients] = useState<Ingredient[]>([]);
	const [chosenIngredient, setChosenIngredient] = useState<Ingredient | null>(null);
	const [amount, setAmount] = useState<number | "">("");
	const [units, setUnits] = useState<string[]>([]);
	const [selectedUnit, setSelectedUnit] = useState<string>("g");
	const [ingredientToDelete, setIngredientToDelete] = useState<Ingredient | null>(null);
	const [openUnitDialog, setOpenUnitDialog] = useState(false);
	const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
	const [ingredientToEdit, setIngredientToEdit] = useState<Ingredient | null>(null);
	const [openEditDialog, setOpenEditDialog] = useState(false);
	const [editAmount, setEditAmount] = useState<number | "">("");
	const [editUnit, setEditUnit] = useState<string>("g");
	const [amountError, setAmountError] = useState<string>("");
	const [dialogSearchQuery, setDialogSearchQuery] = useState<string>("");
	const [availableLists, setAvailableLists] = useState<string[]>([]);
	const [openMoveDialog, setOpenMoveDialog] = useState(false);
	const [ingredientToMove, setIngredientToMove] = useState<Ingredient | null>(null);
	const [formError, setFormError] = useState("");

	useEffect(() => {
		const fetchIngredients = async () => {
			if (listName) {
				try {
					const ingredients = await userAuth.getIngredientsFromList(listName);
					setIngredients(ingredients);
				} catch (error) {
					console.error("Error fetching ingredients:", error);
				}
			}
		};
		fetchIngredients();
	}, [listName, userAuth]);

	//the hook for fetching measurements
	useEffect(() => {
		const fetchUnits = async () => {
			try {
				const fetchedUnits = await backendInterface.getAllMeasurements();
				setUnits(fetchedUnits);
				if (fetchedUnits.length > 0) {
					setSelectedUnit(fetchedUnits[0]); // Set the default unit to the first fetched unit
				}
			} catch (error) {
				console.error("Error fetching units:", error);
			}
		};

		fetchUnits();
	}, [backendInterface]);

	useEffect(() => {
		const fetchUserLists = async () => {
			try {
				const lists = await userAuth.getMyLists();
				const filteredLists = lists.filter((list) => list.name !== listName);
				setAvailableLists(filteredLists.map((list) => list.name));
			} catch (error) {
				console.error("Error fetching user lists:", error);
			}
		};

		fetchUserLists();
	}, [listName, userAuth]);

	const handleAddIngredient = async () => {
		const allIngreds = await backendInterface.getAllIngredients();
		setAllIngredients(allIngreds);
		setOpen(true);
	};

	const handleIngredientClick = (ingredient: Ingredient) => {
		setChosenIngredient(ingredient);
		setOpen(false);
		setAmount("");
		setSelectedUnit(units.length > 0 ? units[0] : "g");
		setOpenUnitDialog(true); //open the second dialogue
	};

	const handleDeleteIngredient = async () => {
		if (ingredientToDelete && listName) {
			await backendInterface.deleteIngredientFromList(listName, ingredientToDelete);
			const updatedIngredients = await userAuth.getIngredientsFromList(listName);
			setIngredients(updatedIngredients);
			handleCloseConfirmDialog();
			toast.success(`${ingredientToDelete.name} successfully deleted.`, {
				style: {
					backgroundColor: "white",
					color: "#0f4c75",
					fontWeight: "bold",
				},
			});
		}
	};

	const handleOpenConfirmDialog = (ingredient: Ingredient) => {
		setIngredientToDelete(ingredient);
		setOpenConfirmDialog(true);
	};

	const handleCloseConfirmDialog = () => {
		setOpenConfirmDialog(false);
		setTimeout(() => {
			setIngredientToDelete(null);
		}, 100); //to handle some rendering issues when closing the box
	};

	const handleUnitDialogClose = () => {
		setOpenUnitDialog(false);
		setOpen(true); // reopen first dialog when closing second dialog
	};

	const handleClose = () => {
		setOpen(false);
		setDialogSearchQuery("");
	};

	const handleAdd = async () => {
		setAmountError("");
		setFormError("");

		if (!chosenIngredient || !listName || amount === "" || !selectedUnit) {
			console.error("Missing required fields: ingredient, list, amount, or unit");
			setFormError("Please fill out all the fields.");
			return;
		}

		if (!isNumber(amount) || Number(amount) <= 0) {
			setAmountError("Please enter a valid amount.");
			return;
		} else {
			setAmountError("");
		}

		try {
			const ingredientToAdd = new Ingredient(chosenIngredient.name, chosenIngredient.type, amount, selectedUnit);

			// Call the addIngredient method on the backend
			await backendInterface.addIngredient(listName, ingredientToAdd);
			const updatedIngredients = await userAuth.getIngredientsFromList(listName);
			setIngredients(updatedIngredients);
			toast.success(`${amount} ${selectedUnit} of ${chosenIngredient.name} added to ${listName}`, {
				style: {
					backgroundColor: "white",
					color: "#0f4c75",
					fontWeight: "bold",
				},
			});
		} catch (error) {
			console.error("Error adding ingredient:", error);
		} finally {
			handleUnitDialogClose();
		}
	};

	const handleUpdateIngredient = async () => {
		if (!ingredientToEdit || !listName || editAmount === "" || !editUnit) {
			console.error("Missing required fields: ingredient, list, amount, or unit");
			return;
		}

		if (!isNumber(editAmount) || Number(editAmount) <= 0) {
			setAmountError("Please enter a valid amount.");
			return;
		} else {
			setAmountError("");
		}

		try {
			const updatedIngredient = new Ingredient(ingredientToEdit.name, ingredientToEdit.type, editAmount, editUnit);

			await backendInterface.updateIngred(listName, ingredientToEdit, updatedIngredient);

			// Fetch updated ingredients for the list to refresh the UI
			const updatedIngredients = await userAuth.getIngredientsFromList(listName);
			setIngredients(updatedIngredients);
			toast.success(`Success!`, {
				style: {
					backgroundColor: "white",
					color: "#0f4c75",
					fontWeight: "bold",
				},
			});
		} catch (error) {
			console.error("Error updating ingredient:", error);
		} finally {
			handleCloseEditDialog(); // Close the edit dialog
		}
	};

	const handleMoveIngredients = async (toListName: string) => {
		if (!ingredientToMove || !listName) return; // Ensure ingredient and current list are set

		try {
			await backendInterface.moveIngredient(listName, toListName, ingredientToMove); // Move ingredient

			const updatedIngredients = await userAuth.getIngredientsFromList(listName);
			setIngredients(updatedIngredients);
			toast.success(`${ingredientToMove.name} moved to ${listName}`, {
				style: {
					backgroundColor: "white",
					color: "#0f4c75",
					fontWeight: "bold",
				},
			});
		} catch (error) {
			console.error("Error moving ingredient:", error);
		} finally {
			handleCloseMoveDialog();
		}
	};

	const handleOpenEditDialog = (ingredient: Ingredient) => {
		setIngredientToEdit(ingredient);
		setEditAmount(ingredient.amount ?? "");
		setEditUnit(ingredient.unit ?? "g");
		setOpenEditDialog(true);
	};

	const handleCloseEditDialog = () => {
		setOpenEditDialog(false);
		setTimeout(() => {
			setIngredientToEdit(null);
		}, 100); // Small delay to avoid rendering issues
	};
	const handleOpenMoveDialog = (ingredient: Ingredient) => {
		setIngredientToMove(ingredient);
		setOpenMoveDialog(true);
	};

	const handleCloseMoveDialog = () => {
		setOpenMoveDialog(false);
		setIngredientToMove(null);
	};

	const filteredIngredients = ingredients.filter((ingredient) =>
		ingredient.name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const filteredAllIngredients = allIngredients.filter((ingredient) =>
		ingredient.name.toLowerCase().includes(dialogSearchQuery.toLowerCase())
	);

	const highlightText = (text: string, query: string) => {
		if (!query) return text;

		const parts = text.split(new RegExp(`(${query})`, "gi"));
		return parts.map((part, index) =>
			part.toLowerCase() === query.toLowerCase() ? (
				<span
					key={index}
					style={{ fontWeight: "bold" }}
				>
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
			style={{ height: "100%", position: "relative" }}
		>
			{/* Ingredient Cards */}
			<Grid
				container
				spacing={2}
				style={{ marginTop: "4px" }}
			>
				{ingredients.length > 0 ? (
					filteredIngredients
                    .slice()
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((ingredient, index) => (
						<Grid
							item
							xs={12}
							sm={6}
							md={4}
							lg={3}
							key={index}
						>
							<Card>
								<CardContent>
									<Typography
										variant="h6"
										style={{ color: "black", fontWeight: "bold" }}
									>
										{highlightText(ingredient.name, searchQuery)}
									</Typography>

									<Typography
										variant="body2"
										style={{
											color: "black",
											fontSize: "0.98rem",
											position: "relative",
											top: "8px",
										}}
									>
										{`${ingredient.type} | ${ingredient.amount} ${ingredient.unit}`}
									</Typography>
								</CardContent>

								<CardActions sx={{ display: "flex", justifyContent: "space-between", padding: "8px 35px" }}>
									<Tooltip
										title="Move to other list"
										arrow
									>
										<div
											style={{
												display: "flex",
												justifyContent: "center",
												width: "65px",
											}}
										>
											<IconButton
												className="secondary-color"
												onClick={() => handleOpenMoveDialog(ingredient)}
												sx={{ color: "black", width: "40px", height: "40px" }}
												size="medium"
											>
												<SwapHoriz />
											</IconButton>
										</div>
									</Tooltip>
									<Tooltip
										title="Edit"
										arrow
									>
										<Button
											color="primary"
											onClick={() => handleOpenEditDialog(ingredient)}
											sx={{ width: "65px" }}
										>
											<Edit />
										</Button>
									</Tooltip>
									<Tooltip
										title="Delete"
										arrow
									>
										<Button
											color="error"
											onClick={() => handleOpenConfirmDialog(ingredient)}
											sx={{ width: "65px" }}
										>
											<Delete />
										</Button>
									</Tooltip>
								</CardActions>
							</Card>
						</Grid>
					))
				) : (
					<Grid
						item
						xs={12}
					>
						<Typography
							variant="h6"
							style={{ textAlign: "center", color: "#555" }}
						>
							No ingredients available
						</Typography>
					</Grid>
				)}
			</Grid>

			{/* Spacer for FAB */}
			<div style={{ height: "60px" }}></div>

			{/* Confirm Delete Dialog */}
			<Dialog
				open={openConfirmDialog}
				onClose={handleCloseConfirmDialog}
				PaperProps={{ className: "white" }}
			>
				<DialogTitle
					sx={{
						color: "black",
						textAlign: "center",
						marginBottom: "4px",
						paddingBottom: "4px",
					}}
				>
					<strong>Confirm Deletion</strong>
				</DialogTitle>
				<DialogContent
					sx={{
						color: "black",
						textAlign: "center",
						marginBottom: "4px",
						paddingBottom: "4px",
					}}
				>
					{ingredientToDelete ? (
						<span>
							Are you sure you want to delete <strong>{ingredientToDelete.name}</strong> from your list?
						</span>
					) : null}
				</DialogContent>
				<DialogActions
					sx={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						gap: "20px",
					}}
				>
					<Button
						onClick={handleDeleteIngredient}
						sx={{
							backgroundColor: "error.main",
							color: "white",
							"&:hover": {
								backgroundColor: "error.dark",
							},
						}}
					>
						Delete
					</Button>
					<Button
						onClick={handleCloseConfirmDialog}
						className="white"
						style={{ color: "black", border: "1px solid #ccc" }}
					>
						Cancel
					</Button>
				</DialogActions>
			</Dialog>

			{/* Floating Action Button */}
			<Fab
				color="primary"
				className="secondary-color"
				style={{
					position: "fixed",
					bottom: "10%",
					right: "25px",
				}}
				onClick={handleAddIngredient}
			>
				<Add />
			</Fab>

			{/* Dialog for Select Ingredients for adding */}
			<Dialog
				open={open}
				onClose={handleClose}
				PaperProps={{ className: "white" }}
			>
				<DialogTitle style={{ color: "black" }}>Select Ingredients</DialogTitle>
				<DialogContent sx={{ overflowY: "hidden" }}>
					{/* Search Bar for Dialog */}
					<TextField
						variant="outlined"
						value={dialogSearchQuery}
						onChange={(e) => setDialogSearchQuery(e.target.value)}
						size="small"
						style={{ width: "100%", backgroundColor: "white" }}
						InputLabelProps={{
							shrink: true,
						}}
						placeholder="Search Ingredients"
					/>
					<div style={{ maxHeight: "400px", overflowY: "auto" }}>
						{filteredAllIngredients
                        .slice()
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((ingredient, index) => (
							<div
								key={index}
								onClick={() => handleIngredientClick(ingredient)}
								style={{
									cursor: "pointer",
									borderBottom: "1px solid #808080",
									color: "black",
									backgroundColor: "inherit",
									transition: "background-color 0.2s",
									padding: "10px",
								}}
								onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--secondary-color)")}
								onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "inherit")}
							>
								<div> {highlightText(ingredient.name, dialogSearchQuery)}</div>
								<div style={{ fontSize: "0.9rem", color: "#606060" }}>{ingredient.type}</div>
							</div>
						))}
					</div>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={handleClose}
						className="white"
						style={{ color: "black", border: "1px solid #ccc" }}
					>
						Cancel
					</Button>
				</DialogActions>
			</Dialog>

			{/*Dialogue for editing amounts*/}
			<Dialog
				open={openEditDialog}
				onClose={handleCloseEditDialog}
				PaperProps={{ className: "white" }}
			>
				<DialogTitle style={{ color: "black" }}>
					{ingredientToEdit ? `Edit ${ingredientToEdit.name}` : "Edit Ingredient"}
				</DialogTitle>
				<DialogContent
					sx={{
						display: "flex",
						flexDirection: "column",
						gap: "16px",
					}}
				>
					<Box>
						<div style={{ color: "black", marginBottom: "2px" }}>
							{" "}
							<strong>Amount</strong>
						</div>
						<TextField
							type="number"
							value={editAmount}
							onChange={(e) => {
								const value = e.target.value;
								if (value === "") {
									setEditAmount("");
									setAmountError("");
								} else if (isNumber(value)) {
									setEditAmount(Number(value));
									setAmountError("");
								} else {
									setAmountError("Please enter a valid amount.");
								}
							}}
							fullWidth
							margin="normal"
							style={{ backgroundColor: "white" }}
						/>
						{amountError && <div style={{ color: "red" }}>{amountError}</div>}
					</Box>

					<Box>
						<div style={{ color: "black", marginBottom: "2px" }}>
							<strong>Unit</strong>
						</div>
						<TextField
							select
							value={editUnit}
							onChange={(e) => setEditUnit(e.target.value)}
							fullWidth
							margin="normal"
							style={{ backgroundColor: "white" }}
						>
							{units.map((unitOption) => (
								<MenuItem
									key={unitOption}
									value={unitOption}
								>
									{unitOption}
								</MenuItem>
							))}
						</TextField>
					</Box>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={handleUpdateIngredient}
						className="secondary-color"
						style={{ color: "white" }}
					>
						Update
					</Button>

					<Button
						onClick={handleCloseEditDialog}
						className="white"
						style={{ color: "black", border: "1px solid #ccc" }}
					>
						Cancel
					</Button>
				</DialogActions>
			</Dialog>

			{/* Dialog for adding ingredient */}
			<Dialog
				open={openUnitDialog}
				onClose={handleUnitDialogClose}
				PaperProps={{ className: "white" }}
			>
				<DialogTitle style={{ color: "black" }}>
					{chosenIngredient ? `Add ${chosenIngredient.name}` : "Add Ingredient"}
				</DialogTitle>
				<DialogContent
					sx={{
						display: "flex",
						flexDirection: "column",
						gap: "16px",
					}}
				>
					<Box>
						<div style={{ marginBottom: "2px", color: "black" }}>
							<strong>Amount</strong>
						</div>
						<TextField
							type="number"
							value={amount}
							onChange={(e) => {
								const value = e.target.value;
								if (value === "") {
									setAmount("");
									setAmountError("");
								} else if (isNumber(value)) {
									setAmount(Number(value));
									setAmountError("");
								}
							}}
							fullWidth
							margin="normal"
							style={{ backgroundColor: "white", marginTop: "0px" }}
						/>
						{amountError && <div style={{ color: "red" }}>{amountError}</div>}
					</Box>
					<Box>
						<div style={{ marginBottom: "2px", color: "black" }}>
							{" "}
							<strong>Unit</strong>
						</div>
						<TextField
							select
							value={selectedUnit}
							onChange={(e) => setSelectedUnit(e.target.value)}
							fullWidth
							margin="normal"
							style={{ backgroundColor: "white", marginTop: "0px" }}
						>
							{units.map((unitOption) => (
								<MenuItem
									key={unitOption}
									value={unitOption}
								>
									{unitOption}
								</MenuItem>
							))}
						</TextField>
						{formError && <div style={{ color: "red" }}>{formError}</div>}
					</Box>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={handleAdd}
						className="secondary-color"
						style={{ color: "white" }}
					>
						Add
					</Button>
					<Button
						onClick={handleUnitDialogClose}
						className="white"
						style={{ color: "black", border: "1px solid #ccc" }}
					>
						Back
					</Button>
				</DialogActions>
			</Dialog>

			{/* Dialogue that opens when you click Move */}
			<Dialog
				open={openMoveDialog}
				onClose={handleCloseMoveDialog}
				PaperProps={{ className: "white" }}
			>
				<DialogTitle style={{ color: "black" }}>
					Move <strong>{ingredientToMove?.name}</strong> to another list
				</DialogTitle>
				<DialogContent>
					{/* List of available lists */}
					<div style={{ maxHeight: "300px", overflowY: "auto" }}>
						{availableLists
                        .slice()
                        .sort((a, b) => a.localeCompare(b))
                        .map((listName, index) => (
							<div
								key={index}
								onClick={() => handleMoveIngredients(listName)}
								style={{
									padding: "10px",
									cursor: "pointer",
									borderBottom: "1px solid #808080",
									color: "black",
									backgroundColor: "inherit",
									transition: "background-color 0.2s",
									fontWeight: "bold",
								}}
								onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#3282b8")}
								onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "inherit")}
							>
								{listName}
							</div>
						))}
					</div>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={handleCloseMoveDialog}
						className="white"
						style={{ color: "black", border: "1px solid #ccc" }}
					>
						Cancel
					</Button>
				</DialogActions>
			</Dialog>
		</Container>
	);
}

export default ListNav;
