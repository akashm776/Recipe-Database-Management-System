import React, { useEffect } from 'react';
import {useState} from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Button, Drawer, ListItem, ListItemIcon, ListItemText, IconButton, TextField, Select, MenuItem, Paper, Stack, Grid, Snackbar, Autocomplete, Typography, FormControl, InputLabel } from '@mui/material';
import MuiAlert from "@mui/material/Alert";
import {Add, DinnerDining, Search, DensityMedium, Delete, Save} from "@mui/icons-material";
import ClearIcon from '@mui/icons-material/Clear';
import { Box } from '@mui/system';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';

const energyLevels = [
  {value:'easy',       display:'Easy'},
  {value:'moderate',   display:'Moderate'},
  {value:'difficult',  display:'Difficult'},
];

const mealTypes = [
  {value:'breakfast',  display:'Breakfast'},
  {value:'lunch',      display:'Lunch'},
  {value:'dinner',     display:'Dinner'},
  {value:'side dish',  display:'Side Dish'}, 
  {value:'sweets',     display:'Sweets'},
];

const maxUtensils = 100;
const maxIngredients = 100;
const imageDir = "../frontend/public/images/";

function addRecipe(image, recipe) {
  let formdata = new FormData();
  if (image !== null) {
    formdata.append("image", image);
  }

  // images need to use formdata, which don't mix with the data section
  // so we just add the string into the formdata
  formdata.append("data", JSON.stringify(recipe));

  axios.post("editrecipe",formdata, {
    headers: {
      "Content-Type": "multipart/form-data",
    }
  }).then((response)=>{
    // If response.data is 1, success! If 0, failure :pensive:
    const success = response.data;
    if (success === 1) {
      console.log("save successful!");
    } else {
      console.log("save unsuccessful");
    }
  });
}

/**
 * loads all ingredients and passes them to the setIngredients function
 * @param {function} setIngredients 
 */
function loadIngredients(setIngredients) {
  axios({
    method: 'GET',
    url: 'ingredientlist',
  }).then((response) => {
    let res = response.data;
    // console.log(res)
    setIngredients(res);
  })
  .catch((error)=>{
    console.log("Query for all ingredients gave: "+error.message+ "\ntrying again in 3 seconds");
    setTimeout(()=>loadIngredients(setIngredients), 3000);
  })
}

const EditPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state;
    const [redirect, setRedirect] = useState(false);
    const [pageLoaded, setPageLoaded] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [linkRecipeId, setLinkRecipeId] = useState("");
    const [currentImage, setCurrentImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [timeError, setTimeError] = useState(false);
    const [title, setTitle] = useState("");
    const [energy, setEnergy] = useState(energyLevels[0].value);
    const [time, setTime] = useState("");
    const [mealType, setMealType] = useState(mealTypes[0].value);
    const [directions, setDirections] = useState("");
    const [utensils, setUtensils] = useState([""]);
    const [ingredients, setIngredients] = useState([""]);
    const [DBingredients, setDBIngredients] = useState([""]);
    const [details, setDetails] = useState([""]);
    const [fileValue, setFileValue] = useState(''); // this is used so we have ability to clear the image
    const [oldImagePath, setOldImagePath] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(()=>loadIngredients(setDBIngredients), []) // this function will only be called on initial page load

    let currentRecipe;
    
    const drawerItems = [
      // { name: "Home", icon: <HomeOutlined />, action:() => navigate("/") },
      { name: "Search Recipes", icon: <Search />, action:() => navigate("/") },
      { name: "New Recipe", icon: <Add />, action:() => navigate("/add-recipe") },
      { name: "View Recipe", icon: <DinnerDining />, action:() => handleViewLink() },
    ];
    
    const getDrawerList = () => (
      <div style={{ width: 250 }} onClick={() => setDrawerOpen(false)}>
        {drawerItems.map((item, index) => (
          <ListItem button onClick={item.action} key={index}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.name} />
          </ListItem>
        ))}
      </div>
    );

    const RunOnLoad = () => {
      useEffect(() => {
        if (!pageLoaded) {
          fetchRecipe(state.rid);
          setLinkRecipeId(state.rid["linkRecipeId"]);
          setPageLoaded(true);
        }
      }, []);
    }

    const utensilBoxes = utensils.map((thingy, i) => {
      let uLabel = "Utensil " + (i + 1);

      return (
        <TextField key={i} label={uLabel} value={utensils[i]}
          onChange={(event) => handleUtensilChange(event.target.value, i)}
          variant="outlined" hiddenLabel />
      )
    });

    const ingredientBoxes = ingredients.map((thingy, i) => {
      let iLabel = "Ingredient " + (i + 1);
      let dLabel = "Details for Ingredient " + (i + 1);

      return (
        <Grid key={i} container columnSpacing={2} alignItems="center" justifyContent="center">
          <Grid item xs={4} md={3}>
            <Autocomplete
              freeSolo
              fullWidth
              options={DBingredients}
              value={ingredients[i]}
              onInputChange={(event, value) => handleIngredientChange(value, i)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={iLabel}
                  variant="outlined" hiddenLabel
                  placeholder="Type an ingredient"
                />
              )}
            />
          </Grid>
          <Grid item xs={7} md={5}>
            <TextField 
              fullWidth value={details[i]}
              label={dLabel} onChange={(event) => handleDetailChange(event.target.value, i)}
              variant="outlined" hiddenLabel />
          </Grid>
        </Grid>
      )
    });
    
    function handleViewLink() {
      setRedirect(true);
    }

    function fetchRecipe(recipeId) {
      axios({
        method: 'POST',
        url: 'fetchrecipe',
        data: {
          rid: recipeId
        }
      }).then((response) => {
        let res = JSON.parse(response.data.results);
        currentRecipe = res;
        setTitle(currentRecipe.name);
        setEnergy(currentRecipe.energy);
        setMealType(currentRecipe.meal_type);
        getOldUtensils(currentRecipe.utensils);
        getOldIngredients(currentRecipe.ingredients);
        setTime(currentRecipe.time_mins);
        setDirections(currentRecipe.instructions);
        setImagePreview(currentRecipe.image_path);
        setOldImagePath(currentRecipe.image_path);
        console.log("editing recipe: " + currentRecipe.name);
      })
    }

    function deleteRecipe(recipeId)
    {
      axios({
        method: 'POST',
        url: 'deleterecipe',
        data: {
          rid: recipeId
        }
      }).then((response)=>{
        // If response.data is 1, success! If 0, failure :pensive:
        console.log(response.data);
      });
    }

    function getOldUtensils(utensilsToLoad) {
      for (let i = 0; i < utensilsToLoad.length; i++) {
        utensils[i] = utensilsToLoad[i];
      }
    }

    function getOldIngredients(ingredientsToLoad) {
      for (let i = 0; i < ingredientsToLoad.length; i++) {
        ingredients[i] = ingredientsToLoad[i]["name"];
        if (ingredientsToLoad[i]["notes"]) {
          details[i] = ingredientsToLoad[i]["notes"];
        }
      }

      console.log(ingredients);
      console.log(details);
      
    }

    function handleSuccessfulEdit() {
      setRedirect(true)
    }

    function selectFile(event) {
      setCurrentImage(event.target.files[0]);
      setImagePreview(URL.createObjectURL(event.target.files[0]));
    }

    function handleSave() {
      {/* TODO:
          - create recipe object
            - get image url
          - convert object to JSON
          - send to backend
      */}
      
      // currently Title is the only mandatory info
      if (typeof(title) !== "string" || title.length === 0) {
        alert("Please enter a recipe title");
        return;
      }

      // array of all listed utensils in order.
      // if there are no utensils then it will be an array of 0 length.
      let uArray = Array(0);
      for (let i = 0; i < maxUtensils; i++) {
        if (typeof(utensils[i]) === "string" && utensils[i].length > 0) {
          uArray = [...uArray, utensils[i]];
        }
      }
      
      // array of all listed ingredients and the corresponsing details in order.
      // if there are no ingredients then it will be an array of 0 length.
      // if an ingredient has no details, it will still be saved.
      // if there are details with no ingredient, it will not be saved.
      let iArray = Array(0);
      const emptyString = "";
      for (let i = 0; i < maxIngredients; i++) {
        if (typeof(ingredients[i]) === "string" && ingredients[i].length > 0) {
          if (typeof(details[i]) === "string" && details[i].length > 0) {
            iArray = [...iArray, {name: ingredients[i], notes: details[i]}];
          } else {
            iArray = [...iArray, {name: ingredients[i], notes: ""}];
          }
        }
      }
      const recipeObj = {
        _id: state.rid,
        name: title,
        energy: energy,
        utensils: uArray,
        ingredients: iArray,
        views: 0,
        date_added: Date.now(),
        instructions: "",
      };

      // add time to cook
      if (time > 0) {
        recipeObj.time_mins = time;
      }

      // add meat type
      if (typeof(mealType) === "string" && mealType.length > 0) {
        recipeObj.meal_type = mealType;
      } 

      // add directions
      if (typeof(directions) === "string" && directions.length > 0) {
        recipeObj.instructions = directions;
      } 

      // add image path (if no new image provided)
      if (!currentImage) {
        recipeObj.image_path = oldImagePath;
      }

      console.log(JSON.stringify(recipeObj));
      // addRecipe(JSON.stringify(recipeObj));
      addRecipe(currentImage, recipeObj);
      //console.log(response);
    }

    function addUtensil() {
      setUtensils([...utensils, ""]);
    }

    function addIngredient() {
      setIngredients([...ingredients, ""]);
      setDetails([...details, ""]);
    }

    function handleTitleChange(event) {
      setTitle(event.target.value);
    }

    function handleEnergyChange(event) {
      setEnergy(event.target.value);
    }


    function handleTimeChange(event) {
      let num = Number(event.target.value);
      if (isNaN(num)) {
        setTimeError(true);
        return;
      }

      setTime(num);
      if (timeError) {setTimeError(false)}
    }

    function handleMealTypeChange(event) {
      setMealType(event.target.value);
    }

    function handleDirectionsChange(event) {
      setDirections(event.target.value);
    }

    function handleUtensilChange(value, uNum) {
      const newUtensils = utensils.slice();
      newUtensils[uNum] = value;
      setUtensils(newUtensils);
    }

    function handleIngredientChange(value, iNum) {
      const newIngredients = ingredients.slice();
      newIngredients[iNum] = value;
      setIngredients(newIngredients);
    }

    function handleDetailChange(value, dNum) {
      const newDetails = details.slice();
      newDetails[dNum] = value;
      setDetails(newDetails);
    } 

    const Alert = React.forwardRef(function Alert(props, ref) {
      return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });
  
    const [successOpen, setSuccessOpen] = React.useState(false);
    const [alertOpen, setAlertOpen] = React.useState(false);
  
    const handleSuccessClick = () => {
      handleSave();
      setSuccessOpen(true);
    };
  
    const handleSuccessClose = (event, reason) => {
      if (reason === "clickaway") {
        return;
      }
  
      setSuccessOpen(false);
      handleViewLink();
    };
    
    const handleDialogOpen = () => {
      setDialogOpen(true);
    }

    const handleDialogClose = () => {
      setDialogOpen(false);
    }

    const handleDelete = () => {
      setDialogOpen(false);
      handleAlertClick();
    }

    const handleAlertClick = () => {
      deleteRecipe(linkRecipeId);
      setAlertOpen(true);
    };
  
    const handleAlertClose = (event, reason) => {
      if (reason === "clickaway") {
        return;
      }
  
      setAlertOpen(false);
      navigate("/");
    };

    return  redirect ?
    <Navigate to="/view-recipe" replace={true} state={{rid: {linkRecipeId}}} />
    :(
      <div className="App">
        <RunOnLoad />
        <Dialog
            open={dialogOpen}
            onClose={handleDialogClose} >
          <DialogTitle>
            Are you sure you want to delete this recipe?
          </DialogTitle>
          <DialogActions>
            <Button onClick={handleDialogClose} variant="contained" color="success">
              Nevermind
            </Button>
            <Button onClick={handleDelete} variant="contained" color="error" 
                startIcon={<Delete />} >
              Yes, delete it!
            </Button>
          </DialogActions>
        </Dialog>
        <div className="searchRow" style={{display:'flex', margin:'12px'}}>
          <Button className="sideBarButton" onClick={() => setDrawerOpen(true)}>
            <IconButton><DensityMedium/></IconButton>
          </Button>
          <Drawer open={drawerOpen} anchor={"left"} onClose={() => setDrawerOpen(false)}>
            {getDrawerList()}
          </Drawer>
        </div>

        <Grid container justifyContent='space-around' rowSpacing={3} margin='12px'>
          <Grid item>
          <Stack direction='column' spacing={3}>
            <Typography variant='h3'>Edit Recipe</Typography>
            <TextField 
              label="Title" onChange={handleTitleChange} value={title}
              style={{flex:'auto', marginRight:'4px'}} variant="outlined" hiddenLabel required />
            <Stack direction='row' spacing={3}>
              <FormControl>
                <InputLabel>Energy</InputLabel>
                <Select 
                  className='energySelect' label="Energy"
                  value={energy} 
                  onChange={handleEnergyChange} >
                    {energyLevels.map((item, i)=>{
                      return <MenuItem key={i} value={item.value}>{item.display}</MenuItem>
                    })}
                </Select>
              </FormControl>
              <TextField 
                label="Time in Minutes" value={time} error={timeError} onChange={handleTimeChange}
                variant="outlined" style={{width:"16ch"}} hiddenLabel />
              <FormControl>
                <InputLabel>Meal Type</InputLabel>
                <Select 
                  className='mealSelect' label="Meal Type"
                  value={mealType} 
                  onChange={handleMealTypeChange} >
                    {mealTypes.map((item, i)=>{
                      return <MenuItem key={i} value={item.value}>{item.display}</MenuItem>
                    })}
                </Select>
              </FormControl>
            </Stack>
          </Stack>
          </Grid>
          <Grid item>
          <Paper className="imageUpload" height={2}
              sx={{padding:'12px', display:'table-cell', width:'300px', height:'300px'}}>
            <Grid container spacing={1} justifyContent='center'>
              <Grid item >
              <label htmlFor="btn-upload">
                <input
                  id="btn-upload"
                  name="btn-upload"
                  style={{ display: 'none' }}
                  type="file"
                  accept="image/*"
                  value={fileValue}
                  onChange={selectFile} />
                <Button
                  className="btn-choose"
                  variant="outlined"
                  component="span" >
                    Choose Image
                </Button>
              </label>
              </Grid>

              <Grid item >
                <Button
                  className="btn-cancel"
                  color="primary"
                  variant="contained"
                  style={{flex:'none'}}
                  disabled={!currentImage}
                  onClick={()=>{setCurrentImage(null);setImagePreview(null);setFileValue('')}}>
                  <ClearIcon />
                </Button>
              </Grid>
              <Grid item >
                <Box >
                  <img src={imagePreview} alt="" style={{maxWidth:'100%', maxHeight:'100%'}} />
                </Box>
              </Grid>
              <Grid item className="file-name">
                <Typography>{currentImage ? currentImage.name : null}</Typography>
              </Grid>
            </Grid>
          </Paper>
          </Grid>
        </Grid>

        <div>
          <hr /><br />
          <Stack spacing={1} direction='column' alignItems='center'>
            <Typography>Utensils</Typography>
            {utensilBoxes}
          <Button 
            onClick={addUtensil} 
            style={{
              borderRadius: 20,
              backgroundColor: "#93E9BE",
              color: "#0047AB",
              padding: "10px 20px",
              fontSize: "14px"
            }} 
            variant="outlined">
            Add Utensil
          </Button>
          </Stack>
        </div>

        <div>
          <hr /><br />
          <Stack spacing={1} direction='column' justifyContent='center' alignItems='center'>
            <Typography>Ingredients</Typography>
            {ingredientBoxes}
          <Button 
            onClick={addIngredient}
            style={{
              borderRadius: 20,
              backgroundColor: "#93E9BE",
              color: "#0047AB",
              padding: "10px 20px",
              fontSize: "14px"
            }} 
            variant="outlined">
            Add Ingredient
            </Button>
          </Stack>
          <hr />
        </div>

        <div >
          <br />
          <Grid container justifyContent='center'>
            <Grid item xs={11} sm={10} md={8}>
              <TextField 
                label="Directions" value={directions} onChange={handleDirectionsChange}
                minRows={4} variant="outlined" hiddenLabel fullWidth multiline />
            </Grid>
          </Grid>
        </div>

        <div>
          <br />
          {/* <Button onClick={handleSave} variant="outlined">Save</Button> */}
          <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSuccessClick} >
            Save Recipe
          </Button>
          <Snackbar open={successOpen} autoHideDuration={1500} onClose={handleSuccessClose}>
            <Alert onClose={handleSuccessClose} severity="success" sx={{ width: "100%" }}>
              Saved "{title}"
            </Alert>
          </Snackbar>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Button
              variant="contained"
              color="error"
              startIcon={<Delete />}
              onClick={handleDialogOpen} >
            Delete Recipe
          </Button>
          <Snackbar open={alertOpen} autoHideDuration={1500} onClose={handleAlertClose}>
            <Alert onClose={handleAlertClose} severity="error" sx={{ width: "100%" }}>
              Deleted "{title}"
            </Alert>
          </Snackbar>
        </div>
      </div>
    )
}

export default EditPage;