import React, { useEffect } from 'react';
import {useState} from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Button, Drawer, ListItem, ListItemIcon, ListItemText, IconButton, TextField, Select, MenuItem } from '@mui/material';
import {Add, DinnerDining, Search, DensityMedium, HomeOutlined} from "@mui/icons-material";

const EditPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state;
    const [redirect, setRedirect] = useState(false);
    const [pageLoaded, setPageLoaded] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [linkRecipeId, setLinkRecipeId] = useState("");
    const [recName, setRecName] = useState("");
    const [recTime, setRecTime] = useState("");
    const [recEnergy, setRecEnergy] = useState("");
    const [recMealType, setRecMealType] = useState("");
    const [recDirections, setRecDirections] = useState("");

    let currentRecipe;
    
    const drawerItems = [
      { name: "Home", icon: <HomeOutlined />, action:() => navigate("/") },
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
        setRecName(currentRecipe.name);
        setRecEnergy(currentRecipe.energy);
        setRecMealType(currentRecipe.meal_type);
        setRecTime(currentRecipe.time_mins);
        setRecDirections(currentRecipe.instructions);
        console.log("viewing recipe: " + currentRecipe.name);
      })
    }

    function handleSuccessfulEdit() {
      setRedirect(true)
    }

    function handleTitleChange(event) {
      setRecName(event.target.value);
    }
    
    const [timeError, setRecTimeError] = useState(false);

    function handleTimeChange(event) {
      let num = Number(event.target.value);
      if (isNaN(num)) {
        setRecTimeError(true);
        return;
      }

      setRecTime(num);
      if (timeError) {setRecTimeError(false)}
    }

    function handleMealTypeChange(event) {
      setRecMealType(event.target.value);
    }

    function handleRecEnergyChange(event) {
      setRecEnergy(event.target.value);
    }

    function handleDirectionsChange(event) {
      setRecDirections(event.target.value);
    }

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
        <div>
        <TextField 
            label="Title" value={recName} onChange={handleTitleChange}
            style={{flex:'auto', marginRight:'4px'}} variant="outlined" hiddenLabel required />
        <br></br>
        <br></br>
        <TextField 
            label="Meal Type" value={recMealType} onChange={handleMealTypeChange}
            style={{flex:'auto', marginRight:'4px'}} variant="outlined" hiddenLabel required />
        <br></br>
        <br></br>
        Energy:&ensp;
        <Select 
            value={recEnergy} 
            onChange={handleRecEnergyChange} >
              <MenuItem value="Easy">Easy</MenuItem>
              <MenuItem value="Moderate">Moderate</MenuItem>
              <MenuItem value="Difficult">Difficult</MenuItem>
        </Select>
        <br></br>
        <br></br>
        <TextField 
            label="Time to Cook" value={recTime} onChange={handleTimeChange}
            style={{flex:'auto', marginRight:'4px'}} variant="outlined" hiddenLabel required />
        <br></br>
        <br></br>
        <TextField 
            label="Directions" value={recDirections} onChange={handleDirectionsChange}
            style={{flex:'auto', marginRight:'4px'}} variant="outlined" hiddenLabel multiline />
        </div>
      </div>
    )
}

export default EditPage;