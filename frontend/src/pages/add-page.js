import React from 'react';
import {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Drawer, ListItem, ListItemIcon, ListItemText, IconButton, Select, MenuItem } from '@mui/material';
import {Add, Search, DensityMedium, HomeOutlined, Details} from "@mui/icons-material";
import ClearIcon from '@mui/icons-material/Clear';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/system';

const maxUtensils = 100;
const maxIngredients = 100;
const imageDir = "../frontend/public/images/";

function addRecipe(image, recipe) {
  let formdata = new FormData();
  if (image !== null) {
    formdata.append("image", image);
  }

  // images need to use formdata, which don't mix with the data section
  // we must convert the object to formdata key/value pairs
  for (var prop in recipe) {
    // console.log(prop);
    formdata.append(prop, recipe[prop]);
  }

  axios.post("newrecipe",formdata, {
    headers: {
      "Content-Type": "multipart/form-data",
    }
  }).then((response)=>{
    console.log(response.data);
  });
}

const AddPage = () => {
    const navigate = useNavigate();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [title, setTitle] = useState(null);
    const [energy, setEnergy] = useState("Easy");
    const [time, setTime] = useState(0);
    const [mealType, setMealType] = useState(null);
    const [directions, setDirections] = useState(null);
    const [utensils, setUtensils] = useState([Array(maxUtensils).fill(null)]);
    const [utensilsActive, setUtensilsActive] = useState([Array(maxUtensils).map((a, i) => boxLogicInit(i))]);
    const [nextUtensil, setNextUtensil] = useState(1);
    const [ingredients, setIngredients] = useState([Array(maxIngredients).fill(null)]);
    const [details, setDetails] = useState([Array(maxIngredients).fill(null)]);
    const [ingredientsActive, setIngredientsActive] = useState([Array(maxIngredients).map((a, i) => boxLogicInit(i))]);
    const [nextIngredient, setNextIngredient] = useState(1);
    const [fileValue, setFileValue] = useState(''); // this is used so we have ability to clear the image


    const drawerItems = [
      // { name: "Home", icon: <HomeOutlined />, action:() => navigate("/") },
      { name: "Search Recipes", icon: <Search />, action:() => navigate("/") },
      { name: "New Recipe", icon: <Add />, action:() => navigate("/add-recipe") },
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

    const utensilBoxes = utensilsActive.map((thingy, i) => {
      let uLabel = "Utensil " + (i + 1);

      return (
        <li key={i}>
          <br />
          <TextField label={uLabel} onChange={event => handleUtensilChange(event, i)}
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

    function boxLogicInit(i) {
      if (i === 0) {
        return 1;
      } else {
        return null;
      }
    }

    function selectFile(event) {
      setCurrentImage(event.target.files[0])
      setImagePreview(URL.createObjectURL(event.target.files[0]))
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
        // maybe show an error message to indicate why recipe wasn't saved
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
        name: title,
        energy: energy,
        utensils: uArray,
        ingredients: iArray,
        views: 0,
        date_added: Date.now()
      };

      // add time to cook
      // TODO: disallow non-numerical input
      if (typeof(time) === "string" && time.length > 0) {
        recipeObj.time_mins = time;
      } else {
        recipeObj.time_mins = "";
      }

      // add meat type
      if (typeof(mealType) === "string" && mealType.length > 0) {
        recipeObj.meal_type = mealType;
      } else {
        recipeObj.meal_type = "";
      }

      // add directions
      if (typeof(directions) === "string" && directions.length > 0) {
        recipeObj.instructions = directions;
      } else {
        recipeObj.instructions = "";
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

    function handleTimeChange(event) {
      setTime(event.target.value);
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

    return (
      <div className="App">
        <div className="searchRow" style={{display:'flex', margin:'12px'}}>
          <Button className="sideBarButton" onClick={() => setDrawerOpen(true)}><IconButton><DensityMedium/></IconButton></Button>
          <Drawer open={drawerOpen} anchor={"left"} onClose={() => setDrawerOpen(false)}>
            {getDrawerList()}
          </Drawer>
        </div>

        <Box className="imageUpload" sx={{display:'table-cell', width:'300px', height:'100px'}}>
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

          <Button
            className="btn-cancel"
            color="primary"
            variant="contained"
            component="span"
            disabled={!currentImage}
            onClick={()=>{setCurrentImage(null);setImagePreview(null);setFileValue('')}}>
            <ClearIcon />
          </Button>
          <img src={imagePreview} alt="" style={{width:'300px', maxHeight:'300px'}} />
          <div className="file-name">
            {currentImage ? currentImage.name : null}
          </div>
        </Box>

        <div>
          <TextField 
            label="Title" onChange={handleTitleChange}
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
            label="Time in Minutes" onChange={handleTimeChange}
            style={{flex:'auto', marginRight:'4px'}} variant="outlined" hiddenLabel />
          <br /><br />
          <TextField 
            label="Meal Type" onChange={handleMealTypeChange}
            style={{flex:'auto', marginRight:'4px'}} variant="outlined" hiddenLabel />
        </div>

        <div>
          <hr /><br />
          Utensils
          <ol>
            {utensilBoxes}
          </ol>
          <Button onClick={addUtensil} variant="outlined">Add Utensil</Button>
        </div>

        <div>
          <hr /><br />
          Ingredients
          <ol>
            {ingredientBoxes}
          </ol>
          <Button onClick={addIngredient} variant="outlined">Add Ingredient</Button>
          <hr />
        </div>

        <div className="searchRow" style={{display:'flex', margin:'12px'}} >
          <br />
          <TextField 
            label="Directions" onChange={handleDirectionsChange}
            style={{flex:'auto', marginRight:'4px'}} variant="outlined" hiddenLabel multiline />
        </div>
        <div>
          <Button onClick={handleSave} variant="outlined">Save</Button>
        </div>
        
        {/* </div> */}
      </div>
    )
}

export default AddPage;