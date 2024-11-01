import { Add } from "@mui/icons-material";
import { AppBar, Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, Fab, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Toolbar, Typography } from "@mui/material";
import { UserAuth } from "auth/UserAuth";
import { useEffect, useState } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useNavigate, useParams } from "react-router-dom";
import { BackendInterface } from "services/BackendInterface";
import { Ingredient } from "../../models/Ingredient";


interface ListNavProps {
    backendInterface: BackendInterface;
    userAuth: UserAuth;
}

function ListNav({ userAuth, backendInterface }: ListNavProps) {
    const { listName } = useParams<{ listName: string }>();
    const navigate = useNavigate();
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [open, setOpen] = useState(false); //first dialogue for all ingredients
    const [allIngredients, setAllIngredients] = useState<Ingredient[]>([]);
    const [chosenIngredient, setChosenIngredient] = useState<Ingredient | null>(null);
    const [amount, setAmount] = useState<number | ''>('');
    const [units, setUnits] = useState<string[]>([]);
    const [selectedUnit, setSelectedUnit] = useState<string>("g");

    const [openUnitDialog, setOpenUnitDialog] = useState(false); //second dialogue

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

    const handleAddIngredient = async () => {
        const allIngreds = await backendInterface.getAllIngredients();
        setAllIngredients(allIngreds);
        setOpen(true);
    }

    const handleIngredientClick = (ingredient: Ingredient) =>{
        setChosenIngredient(ingredient);
        setOpen(false);
        setAmount('');
        setSelectedUnit(units.length > 0 ? units[0] : "g");
        setOpenUnitDialog(true); //open the second dialogue
    }

    const handleUnitDialogClose = () => {
        setOpenUnitDialog(false);
        setOpen(true); // reopen first dialog when closing second dialog
    };
    
    const handleClose = () => {
        setOpen(false);
    }

    const handleAdd = async () => {
        if (!chosenIngredient || !listName || amount === '' || !selectedUnit) {
            console.error("Missing required fields: ingredient, list, amount, or unit");
            return;
        }
    
        try {
    
            // Clone the selected ingredient and set the amount and unit from user input
            const ingredientToAdd = new Ingredient(
                chosenIngredient.name,
                chosenIngredient.type,
                amount,
                selectedUnit // Use the selected unit from the dropdown
            );
    
            // Call the addIngredient method on the backend
            await backendInterface.addIngredient(listName, ingredientToAdd);
            console.log(`Added ${ingredientToAdd.name} to ${listName}`);
    
            // Optionally refresh the ingredient list after adding
            const updatedIngredients = await userAuth.getIngredientsFromList(listName);
            setIngredients(updatedIngredients);
    
        } catch (error) {
            console.error("Error adding ingredient:", error);
        } finally {
            handleUnitDialogClose(); // Close the unit dialog
        }
    };
    
    return (
        <Container maxWidth={false} disableGutters className="sub-color" style={{ height: "100vh", position: "relative" }}>
            {/* App Bar */}
            <AppBar position="static" className="header-color">
                <Toolbar>
                    <AiOutlineArrowLeft
                        style={{ fontSize: "24px", color: "white", cursor: "pointer" }}
                        onClick={() => navigate("/my-lists")}
                    />
                    <Typography variant="h6" style={{ flexGrow: 1, textAlign: "center", color: "white", fontWeight: "bold", fontSize: "1.5rem" }}>
                        {listName}
                    </Typography>
                </Toolbar>
            </AppBar>

            {/* Ingredient Table */}
            <TableContainer component={Paper} style={{ marginTop: "20px" }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell style={{ fontWeight: "bold" }}>Ingredient Name</TableCell>
                            <TableCell style={{ fontWeight: "bold" }}>Type</TableCell>
                            <TableCell style={{ fontWeight: "bold" }}>Amount</TableCell>
                            <TableCell style={{ fontWeight: "bold" }}>Unit</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {ingredients.length > 0 ? (
                            ingredients.map((ingredient, index) => (
                                <TableRow
                                    key={index}
                                    sx={{
                                        cursor: "pointer",
                                        backgroundColor: "white",
                                        "&:hover": {
                                            backgroundColor: "#f5f5f5",
                                        },
                                    }}
                                    style={{
                                        borderBottom: "1px solid #ddd",
                                    }}
                                >
                                    <TableCell style={{ padding: "12px 16px" }}>{ingredient.name}</TableCell>
                                    <TableCell>{ingredient.type}</TableCell>
                                    <TableCell>{ingredient.amount ?? "N/A"}</TableCell>
                                    <TableCell>{ingredient.unit ?? "N/A"}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell style={{ fontSize: "1.1rem", color: "#555" }} colSpan={4}>No ingredients available</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Floating Action Button */}
            <Fab
                color="primary"
                className="primary-color"
                style={{
                    position: "fixed",
                    bottom: "20px",
                    right: "20px",
                }}
                onClick={handleAddIngredient}
            >
                <Add />
            </Fab>
            
            {/* Dialog for Adding Ingredients */}
            <Dialog open={open} onClose={handleClose} PaperProps={{ className: "secondary-color" }}>
            <DialogTitle>Select Ingredients</DialogTitle>
            <DialogContent>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {allIngredients.map((ingredient, index) => (
                <div
                    key={index}
                    onClick={() => handleIngredientClick(ingredient)}
                    style={{
                        padding: '10px',
                        cursor: 'pointer',
                        borderBottom: '1px solid #ddd',
                        backgroundColor: 'inherit',
                        transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e0e0e0'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'inherit'}
                >
                    {ingredient.name}
                </div>
                ))}
            </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} className="primary-color" style= {{color : 'black'}}>
                    Close
                </Button>
            </DialogActions>
            </Dialog>

        {/* Dialog for Unit and Amount Input */}
        <Dialog open={openUnitDialog} onClose={handleUnitDialogClose} PaperProps={{ className: "secondary-color" }}>
                <DialogTitle>{chosenIngredient ? `Add ${chosenIngredient.name}` : 'Add Ingredient'}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Amount"
                        type="float"
                        value={amount}
                        onChange={(e) => {
                            const value = e.target.value;
                            // Check if the input is empty or if it's a valid number
                            if (value === "") {
                                setAmount(""); // Set to empty string if the input is empty
                            } else if (!isNaN(Number(value))) {
                                setAmount(Number(value)); // Convert string to number if it's a valid number
                            }
                        }}                        
                        fullWidth
                        margin="normal"
                        style={{ backgroundColor: 'white' }} // Set background color to white
                    />
                    <div style={{ marginBottom: '0.5px', color: 'black' }}>
                         Unit
                    </div>
                    <TextField
                        select
                        //label="Unit"
                        value={selectedUnit}
                        onChange={(e) => setSelectedUnit(e.target.value)}
                        fullWidth
                        margin="normal"
                        style={{ backgroundColor: 'white' }}
                    >
                        {units.map((unitOption) => ( // **Use fetched units**
                            <MenuItem key={unitOption} value={unitOption}>
                                {unitOption}
                            </MenuItem>
                        ))}
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleAdd} className="primary-color" style={{ color: 'black' }}>
                        Add
                    </Button>
                    <Button onClick={handleUnitDialogClose} className="primary-color" style={{ color: 'black' }}>
                        Back
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default ListNav;

