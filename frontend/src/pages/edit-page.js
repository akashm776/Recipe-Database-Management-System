import React, { useEffect } from 'react';
import {useState} from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Button, Drawer, ListItem, ListItemIcon, ListItemText, IconButton, TextField, Select, MenuItem, Paper, Stack, Grid, Snackbar } from '@mui/material';
import MuiAlert from "@mui/material/Alert";
import {Add, DinnerDining, Search, DensityMedium, Delete, Save} from "@mui/icons-material";
import ClearIcon from '@mui/icons-material/Clear';
import axios from 'axios';

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
    console.log(response.data);
  });
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
    const [title, setTitle] = useState("");
    const [energy, setEnergy] = useState("Easy");
    const [time, setTime] = useState("");
    const [mealType, setMealType] = useState("");
    const [directions, setDirections] = useState("");
    const [utensils, setUtensils] = useState(Array(1).fill(""));
    const [utensilsActive, setUtensilsActive] = useState(Array(1).fill(1));
    const [nextUtensil, setNextUtensil] = useState(1);
    const [ingredients, setIngredients] = useState([Array(maxIngredients).fill(null)]);
    const [details, setDetails] = useState([Array(maxIngredients).fill(null)]);
    const [ingredientsActive, setIngredientsActive] = useState([Array(maxIngredients).map((a, i) => boxLogicInit(i))]);
    const [nextIngredient, setNextIngredient] = useState(1);
    const [fileValue, setFileValue] = useState(''); // this is used so we have ability to clear the image
    const [oldImagePath, setOldImagePath] = useState("");

    let currentRecipe;
    
    const drawerItems = [
      // { name: "Home", icon: <HomeOutlined />, action:() => navigate("/") },
      { name: "Search Recipes", icon: <Search />, action:() => navigate("/") },
      { name: "New Recipe", icon: <Add />, action:() => navigate("/add-recipe") },
      { name: "View Recipe", icon: <DinnerDining />, action:() => handleViewLink(state.rid) },
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

    const utensilBoxes = utensilsActive.map((thingy, i) => {
      let uLabel = "Utensil " + (i + 1);

      return (
        <li key={i}>
          <br />
          <TextField label={uLabel} value={utensils[i]} onChange={event => handleUtensilChange(event, i)}
            style={{flex:'auto', marginRight:'4px'}} variant="outlined" hiddenLabel />
        </li>
      )
    });

    const ingredientBoxes = ingredientsActive.map((thingy, i) => {
      let iLabel = "Ingredient " + (i + 1);
      let dLabel = "Details for Ingredient " + (i + 1);

      return (
        <li key={i}>
          <br />
          <TextField 
            label={iLabel} onChange={event => handleIngredientChange(event, i)}
            style={{flex:'auto', marginRight:'4px'}} variant="outlined" hiddenLabel />
          &ensp;
          <TextField 
            label={dLabel} onChange={event => handleDetailChange(event, i)}
            style={{flex:'auto', marginRight:'4px'}} variant="outlined" hiddenLabel />
        </li>
      )
    });
    
    function handleViewLink(rid) {
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
        loadUtensils(currentRecipe.utensils);
        setTime(currentRecipe.time_mins);
        setDirections(currentRecipe.instructions);
        setImagePreview(currentRecipe.image_path);
        setOldImagePath(currentRecipe.image_path);
        console.log("editing recipe: " + currentRecipe.name);
      })
    }

    function loadUtensils(utensilsToLoad) {
      for (let i = 0; i < utensilsToLoad.length - 1; i++) {
        utensils[i] = utensilsToLoad[i];
        if (i !== utensilsToLoad.length - 2) {
          utensilsActive[i + 1] = 1;
        }
      }
      setNextUtensil(utensilsToLoad.length - 1);
      
    }

    function handleSuccessfulEdit() {
      setRedirect(true)
    }

    function boxLogicInit(i) {
      if (i === 0) {
        return 1;
      } else {
        return null;
      }
    }

    function selectFile(event) {
      setCurrentImage(event.target.files[0]);
      setImagePreview(URL.createObjectURL(event.target.files[0]));
      console.log("Selected image:");
      console.log(currentImage);
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
    }

    function addUtensil() {
      utensilsActive[nextUtensil] = 1;
      setNextUtensil(nextUtensil + 1);
    }

    function addIngredient() {
      ingredientsActive[nextIngredient] = 1;
      setNextIngredient(nextIngredient + 1);
    }

    function handleTitleChange(event) {
      setTitle(event.target.value);
    }

    function handleEnergyChange(event) {
      setEnergy(event.target.value);
    }

    const [timeError, setTimeError] = useState(false);

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

    function handleUtensilChange(event, uNum) {
      const newUtensils = utensils.slice();
      newUtensils[uNum] = event.target.value;
      setUtensils(newUtensils);
    }

    function handleIngredientChange(event, iNum) {
      const newIngredients = ingredients.slice();
      newIngredients[iNum] = event.target.value;
      setIngredients(newIngredients);
    }

    function handleDetailChange(event, dNum) {
      const newDetails = details.slice();
      newDetails[dNum] = event.target.value;
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
    };
  
    const handleAlertClick = () => {
      setAlertOpen(true);
    };
  
    const handleAlertClose = (event, reason) => {
      if (reason === "clickaway") {
        return;
      }
  
      setAlertOpen(false);
    };

    return  redirect ?
    <Navigate to="/view-recipe" replace={true} state={{rid: {linkRecipeId}}} />
    :(
      <div className="App">
        <RunOnLoad />
        <div className="searchRow" style={{display:'flex', margin:'12px'}}>
          <Button className="sideBarButton" onClick={() => setDrawerOpen(true)}>
            <IconButton><DensityMedium/></IconButton>
          </Button>
          <Drawer open={drawerOpen} anchor={"left"} onClose={() => setDrawerOpen(false)}>
            {getDrawerList()}
          </Drawer>
        </div>

        <Paper className="imageUpload" height={2} sx={{padding:'12px', display:'table-cell', width:'300px', height:'100px'}}>
          <Grid container spacing={1} justifyContent='center'>
            <Grid item >
            <label htmlFor="btn-upload">
              <input
                id="btn-upload"
                name="btn-upload"
                style={{ display: 'none' }}
                type="file"
                accept="image/*"null
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
              <img src={imagePreview} alt="" style={{width:'100%', maxHeight:'300px'}} />
            </Grid>
            <Grid item className="file-name">
              {currentImage ? currentImage.name : null}
            </Grid>
          </Grid>
        </Paper>

        <div>
          <TextField 
            label="Title" onChange={handleTitleChange} value={title}
            style={{flex:'auto', marginRight:'4px'}} variant="outlined" hiddenLabel required />
          <br /><br />
          Energy:&ensp;
          <Select 
            className='sortSelect' label="Sort by"
            value={energy} 
            onChange={handleEnergyChange} >
              <MenuItem value="Easy">Easy</MenuItem>
              <MenuItem value="Moderate">Moderate</MenuItem>
              <MenuItem value="Difficult">Difficult</MenuItem>
          </Select>
          &emsp;
          <TextField 
            label="Time in Minutes" value={time} error={timeError} onChange={handleTimeChange}
            style={{flex:'auto', marginRight:'4px'}} variant="outlined" hiddenLabel />
          <br /><br />
          <TextField 
            label="Meal Type" value={mealType} onChange={handleMealTypeChange}
            style={{flex:'auto', marginRight:'4px'}} variant="outlined" hiddenLabel />
        </div>

        <div>
          <hr /><br />
          Utensils
          <ol>
            {utensilBoxes}
          </ol>
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
        </div>

        <div>
          <hr /><br />
          Ingredients
          <ol>
            {ingredientBoxes}
          </ol>
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
          <hr />
        </div>

        <div className="searchRow" style={{display:'flex', margin:'12px'}} >
          <br />
          <TextField 
            label="Directions" value={directions} onChange={handleDirectionsChange}
            style={{flex:'auto', marginRight:'4px'}} variant="outlined" hiddenLabel multiline />
        </div>
        <div>
          {/* <Button onClick={handleSave} variant="outlined">Save</Button> */}
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSuccessClick}
          >
            Save Recipe
          </Button>
          <Snackbar open={successOpen} autoHideDuration={3000} onClose={handleSuccessClose}>
            <Alert onClose={handleSuccessClose} severity="success" sx={{ width: "100%" }}>
              Saved "{title}"
            </Alert>
          </Snackbar>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Button
            variant="contained"
            color="error"
            startIcon={<Delete />}
            onClick={handleAlertClick}
          >
            Delete Recipe
          </Button>
          <Snackbar open={alertOpen} autoHideDuration={3000} onClose={handleAlertClose}>
            <Alert onClose={handleAlertClose} severity="error" sx={{ width: "100%" }}>
              Deleted "{title}"
            </Alert>
          </Snackbar>
        </div>
      </div>
    )
}

export default EditPage;