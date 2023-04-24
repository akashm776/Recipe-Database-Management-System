import React from 'react';
import {useState} from 'react';
import {useEffect} from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Button, Drawer, ListItem, ListItemIcon, ListItemText, IconButton, Select, MenuItem, Paper, Stack, Grid, Autocomplete } from '@mui/material';
import {Add, Search, DensityMedium, HomeOutlined, Details} from "@mui/icons-material";
import ClearIcon from '@mui/icons-material/Clear';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/system';

const imageDir = "../frontend/public/images/";

function addRecipe(image, recipe) {
  let formdata = new FormData();
  if (image !== null) {
    formdata.append("image", image);
  }

  // images need to use formdata, which don't mix with the data section
  // so we just add the string into the formdata
  formdata.append("data", JSON.stringify(recipe));

  axios.post("newrecipe",formdata, {
    headers: {
      "Content-Type": "multipart/form-data",
    }
  }).then((response)=>{
    console.log(response.data);
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
    const [utensils, setUtensils] = useState([""]);
    const [ingredients, setIngredients] = useState([""]);
    const [DBingredients, setDBIngredients] = useState([]);
    const [details, setDetails] = useState([]);
    const [fileValue, setFileValue] = useState(''); // this is used so we have ability to clear the image

    useEffect(()=>loadIngredients(setDBIngredients), []) // this function will only be called on initial page load

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

    const utensilBoxes = utensils.map((thingy, i) => {
      let uLabel = "Utensil " + (i + 1);

      return (
        <li key={i}>
          <br />
          <TextField label={uLabel} onChange={(event) => handleUtensilChange(event.target.value, i)}
            style={{flex:'auto', marginRight:'4px'}} variant="outlined" hiddenLabel />
        </li>
      )
    })
    

    const ingredientBoxes = ingredients.map((thingy, i) => {
      let iLabel = "Ingredient " + (i + 1);
      let dLabel = "Details for Ingredient " + (i + 1);

      return (
        <li key={i}>
          <br />
          {/* <TextField 
            label={iLabel} onChange={event => handleIngredientChange(event, i)}
            style={{flex:'auto', marginRight:'4px'}} variant="outlined" hiddenLabel /> */}
          {/* <Box sx={{justifyContent: 'auto'}}> */}
            {/* <Stack justifyContent= 'center' spaceing= '2'> */}
              <Grid container direction="column" alignItems="center" justify="center">
                <Grid item sx={{width:"15%"}}>
                  <Autocomplete
                  // sx={{width:"15%"}}
                  freeSolo
                  options={DBingredients}
                  onInputChange={(event, value) => handleIngredientChange(value, i)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={iLabel}
                      style={{flex:'auto', marginRight:'4px'}} variant="outlined" hiddenLabel
                      placeholder="Type an ingredient"
                    />
                  )}
                  />
                  &ensp;
                </Grid>
                <Grid item sx={{width:"15%"}}>
                    &ensp;
                    <TextField 
                    label={dLabel} onChange={(event) => handleDetailChange(event.target.value, i)}
                    style={{flex:'auto', marginRight:'4px'}} variant="outlined" hiddenLabel />
                </Grid>
              </Grid>
            {/* </Stack> */}
      {/* </Box> */}
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
      for (let i = 0; i < utensils.length; i++) {
        if (typeof(utensils[i]) === "string" && utensils[i].length > 0) {
          uArray = [...uArray, utensils[i]];
        }
      }
      
      // array of all listed ingredients and the corresponsing details in order.
      // if there are no ingredients then it will be an array of 0 length.
      // if an ingredient has no details, it will still be saved.
      // if there are details with no ingredient, it will not be saved.
      let iArray = Array(0);
      for (let i = 0; i < ingredients.length; i++) {
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

      console.log(JSON.stringify(recipeObj));
      // addRecipe(JSON.stringify(recipeObj));
      addRecipe(currentImage, recipeObj);
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

    return (
      <div className="App">
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
              <img src={imagePreview} alt="" style={{width:'100%', maxHeight:'300px'}} />
            </Grid>
            <Grid item className="file-name">
              {currentImage ? currentImage.name : null}
            </Grid>
          </Grid>
        </Paper>

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
            label="Time in Minutes" error={timeError} onChange={handleTimeChange}
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