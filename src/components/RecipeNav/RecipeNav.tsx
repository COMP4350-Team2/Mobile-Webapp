import { Delete, Edit } from "@mui/icons-material";
import {
	Box,
	Button,
	Checkbox,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControlLabel,
	IconButton,
	MenuItem,
	TextField,
	Tooltip,
} from "@mui/material";
import isNumber from "is-number";
import { useEffect, useRef, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import customIngredIcon from "../../assets/icons/custom_ingred.png";
import { UserAuth } from "../../auth/UserAuth";
import { Ingredient } from "../../models/Ingredient";
import { Recipe } from "../../models/Recipe";
import { BackendInterface } from "../../services/BackendInterface";
import { highlightText } from "../../utils/Utils";
import "./RecipeNav.css";

interface RecipeNavProps {
	backendInterface: BackendInterface;
	userAuth: UserAuth;
}

function RecipeNav({ userAuth, backendInterface }: RecipeNavProps) {
	const navigate = useNavigate();
	const { recipeName } = useParams<{ recipeName: string }>();
	const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

	const [dialogSearchQuery, setDialogSearchQuery] = useState<string>("");
	const [open, setOpen] = useState(false); //first dialogue for all ingredients
	const [dialogFilter, setDialogFilter] = useState<"All" | "Common" | "Custom">("All");
	const [allIngredients, setAllIngredients] = useState<Ingredient[]>([]);
	const [chosenIngredient, setChosenIngredient] = useState<Ingredient | null>(null);
	const [amount, setAmount] = useState<number | "">("");
	const [amountError, setAmountError] = useState<string>("");
	const [openUnitDialog, setOpenUnitDialog] = useState(false);
	const [selectedUnit, setSelectedUnit] = useState<string>("g");
	const [units, setUnits] = useState<string[]>([]);
	const [formError, setFormError] = useState("");
	const [recipe, setRecipe] = useState<Recipe | null>();
	const [isAddingStep, setIsAddingStep] = useState(false);
	const [stepText, setStepText] = useState("");
	const [steps, setSteps] = useState<string[]>([]);
	const [editingIndex, setEditingIndex] = useState<number | null>(null);
	const [editedStep, setEditedStep] = useState<string>("");

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
		const fetchRecipe = async () => {
			if (recipeName && !recipe) {
				try {
					if (userAuth.getAllRecipes().length < 1) {
						await backendInterface.getAllRecipes();
					}
					const obj = userAuth.getRecipe(recipeName);
					if (obj) {
						setRecipe(obj);
						setSteps([...obj.steps]);
					} else {
						toast.error(`Failed to open ${recipeName}, the recipe doesn't exist.`);
						navigate("/my-recipes");
					}
				} catch (error) {
					console.error("Error fetching recipe:", error);
				}
			}
		};

		fetchUnits();
		fetchRecipe();
	}, [backendInterface, userAuth, recipeName, recipe, navigate]);

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

	const addIngredient = async () => {
		setAmountError("");
		setFormError("");

		if (!chosenIngredient || !recipeName || amount === "" || !selectedUnit) {
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
			ingredientToAdd.setCustomFlag(chosenIngredient.isCustom);
			await backendInterface.addIngredientToRecipe(recipeName, ingredientToAdd);
			setRecipe(userAuth.getRecipe(recipeName)!);
			toast.success(`${amount} ${selectedUnit} of ${chosenIngredient.name} added to ${recipeName}`, {
				style: {
					backgroundColor: "white",
					color: "#0f4c75",
					fontWeight: "bold",
				},
			});
		} catch (error) {
			console.error("Error adding ingredient:", error);
		} finally {
			setOpenUnitDialog(false);
		}
	};

	const handleUnitDialogClose = () => {
		setOpenUnitDialog(false);
	};

	const handleDeleteIngredient = async (ingr: Ingredient) => {
		if (recipeName) {
			await backendInterface.deleteIngredientFromRecipe(recipeName, ingr);
			setRecipe(userAuth.getRecipe(recipeName)!);
			toast.success(`${ingr.name} successfully deleted.`, {
				style: {
					backgroundColor: "white",
					color: "#0f4c75",
					fontWeight: "bold",
				},
			});
		}
	};

	const handleAddStepClick = () => {
		setIsAddingStep(true);
	};

	const handleBlur = async () => {
		// Hide the textarea if the user clicks outside of it
		setIsAddingStep(false);
		setStepText("");
		if (recipeName) {
			await backendInterface.addStepToRecipe(recipeName, stepText);
			const temp = userAuth.getRecipe(recipeName)!;
			setRecipe(temp);
			setSteps([...temp.steps]);
		}
	};

	// Close textarea if the user clicks outside of it
	const handleClickOutside = (event: MouseEvent) => {
		if (textAreaRef.current && !textAreaRef.current.contains(event.target as Node)) {
			setIsAddingStep(false);
		}
	};

	// Attach the event listener to detect clicks outside of the textarea
	useEffect(() => {
		document.addEventListener("click", handleClickOutside);
		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	}, []);

	const handleTextChange = (event) => {
		setStepText(event.target.value);
	};

	const handleDeleteStep = async (index: number) => {
		if (recipeName) {
			await backendInterface.deleteStepFromRecipe(recipeName, index + 1);
			const temp = userAuth.getRecipe(recipeName)!;
			setRecipe(temp);
			setSteps([...temp.steps]);
		}
	};

	const editStep = (index: number, step: string) => {
		setEditingIndex(index);
		setEditedStep(step);
	};

	const handleStepChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		setEditedStep(event.target.value);
	};

	const handleStepBlur = async () => {
		if (editingIndex !== null && recipeName) {
			await backendInterface.updateStep(recipeName, editedStep, editingIndex);
			const updatedSteps = [...steps];
			updatedSteps[editingIndex] = editedStep;
			setSteps(updatedSteps);
			setEditingIndex(null);
			const temp = userAuth.getRecipe(recipeName)!;
			setRecipe(temp);
		}
	};

	const handleClose = () => {
		setOpen(false);
		setDialogSearchQuery("");
		setDialogFilter("All");
	};

	const getFilteredIngredients = () => {
		switch (dialogFilter) {
			case "Common":
				return allIngredients.filter((ingredient) => !ingredient.isCustom);
			case "Custom":
				return allIngredients.filter((ingredient) => ingredient.isCustom);
			default:
				return allIngredients;
		}
	};
	const filteredAllIngredients = getFilteredIngredients().filter((ingredient) =>
		ingredient.name.toLowerCase().includes(dialogSearchQuery.toLowerCase())
	);

	return (
		<div style={{ padding: "16px" }}>
			{/* Ingredients Section */}
			<div>
				<div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
					<h3>Ingredients</h3>
					<Tooltip
						title="Add ingredient"
						arrow
					>
						<IconButton
							className="primary-color"
							onClick={() => handleAddIngredient()}
							sx={{
								color: "white",
								backgroundColor: "white",
								borderRadius: "50%",
								width: "40px",
								height: "40px",
								marginBottom: "4px",
							}}
						>
							<AiOutlinePlus />
						</IconButton>
					</Tooltip>
				</div>
				<div style={{ marginTop: "16px" }}>
					{recipe && recipe.getIngredients().length > 0 ? (
						recipe.getIngredients().map((ingredient, index) => (
							<div
								key={index}
								className="card"
								style={{
									width: "300px",
								}}
							>
								<span>
									{ingredient.name} | {ingredient.amount} {ingredient.unit}
								</span>
								<div style={{ display: "flex", alignItems: "center" }}>
									{ingredient.isCustom && (
										<img
											src={customIngredIcon}
											alt="Custom Ingredient"
											style={{
												width: "20px",
												height: "20px",
												marginRight: "10px",
											}}
										/>
									)}
									<Button
										color="error"
										onClick={() => handleDeleteIngredient(ingredient)}
										sx={{ width: "40px" }}
									>
										<Delete />
									</Button>
								</div>
							</div>
						))
					) : (
						<div style={{ fontStyle: "italic" }}>No ingredients added yet!</div>
					)}
				</div>
			</div>

			{/* Steps Section */}
			<div style={{ marginTop: "32px" }}>
				<div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
					<h3>Directions</h3>
					<Tooltip
						title="Add step"
						arrow
					>
						<IconButton
							className="primary-color"
							onClick={() => handleAddStepClick()}
							sx={{
								color: "white",
								backgroundColor: "white",
								borderRadius: "50%",
								width: "40px",
								height: "40px",
								marginBottom: "4px",
							}}
						>
							<AiOutlinePlus />
						</IconButton>
					</Tooltip>
				</div>
				<div style={{ marginTop: "16px" }}>
					{isAddingStep && (
						<textarea
							placeholder="Describe the step here..."
							onBlur={handleBlur}
							value={stepText}
							onChange={handleTextChange}
						/>
					)}
					{recipe && recipe.getSteps().length > 0
						? steps.map((step, index) => (
								<div
									key={index}
									className="card"
								>
									{editingIndex === index ? (
										<textarea
											value={editedStep}
											onChange={handleStepChange}
											onBlur={handleStepBlur}
											rows={3}
										/>
									) : (
										<span>{`${index + 1}. ${step}`}</span>
									)}
									<div style={{ display: "flex" }}>
										<Button
											color="primary"
											onClick={() => editStep(index, step)}
											sx={{ width: "40px" }}
										>
											<Edit />
										</Button>
										<Button
											color="error"
											onClick={() => handleDeleteStep(index)}
											sx={{ width: "40px" }}
										>
											<Delete />
										</Button>
									</div>
								</div>
						  ))
						: !isAddingStep && <div style={{ fontStyle: "italic" }}>No steps added yet!</div>}
				</div>
			</div>

			{/* Dialog for Select Ingredients for adding */}
			<Dialog
				open={open}
				onClose={handleClose}
				PaperProps={{ className: "white" }}
			>
				<DialogTitle style={{ color: "black" }}>
					<strong>Select Ingredients</strong>
				</DialogTitle>
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
					{/* Filter Checkboxes */}
					<div style={{ marginTop: "10px", marginBottom: "10px", marginLeft: "5px" }}>
						<Box
							display="flex"
							justifyContent="space-between"
							alignItems="center"
						>
							<FormControlLabel
								control={
									<Checkbox
										checked={dialogFilter === "All"}
										onChange={() => setDialogFilter("All")}
										color="primary"
									/>
								}
								label="All"
							/>
							<FormControlLabel
								control={
									<Checkbox
										checked={dialogFilter === "Common"}
										onChange={() => setDialogFilter("Common")}
										color="primary"
									/>
								}
								label="Common"
							/>
							<FormControlLabel
								control={
									<Checkbox
										checked={dialogFilter === "Custom"}
										onChange={() => setDialogFilter("Custom")}
										color="primary"
									/>
								}
								label="Custom"
							/>
						</Box>
					</div>
					<div style={{ maxHeight: "300px", overflowY: "auto" }}>
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
										display: "flex",
										alignItems: "center",
										justifyContent: "space-between",
									}}
									onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--secondary-color)")}
									onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "inherit")}
								>
									{" "}
									<div>
										<div> {highlightText(ingredient.name, dialogSearchQuery)}</div>
										<div style={{ fontSize: "0.9rem", color: "#606060" }}>{ingredient.type}</div>
									</div>
									{ingredient.isCustom && (
										<img
											src={customIngredIcon}
											alt="Custom Ingredient"
											style={{
												width: "20px",
												height: "20px",
												marginRight: "10px",
											}}
										/>
									)}
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
						onClick={addIngredient}
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
		</div>
	);
}

export default RecipeNav;
