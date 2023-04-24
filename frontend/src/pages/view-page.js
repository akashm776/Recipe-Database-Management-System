import React, { useEffect } from 'react';
import {useState} from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Button, Drawer, ListItem, ListItemIcon, ListItemText, IconButton, TextField } from '@mui/material';
import {Add, Edit, Search, DensityMedium, HomeOutlined} from "@mui/icons-material";

const ViewPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state;
    const [redirect, setRedirect] = useState(false);
    const [pageLoaded, setPageLoaded] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [linkRecipeId, setLinkRecipeId] = useState("");
    const [recName, setRecName] = useState("");
    const [recEnergy, setRecEnergy] = useState("");
    const [recTime, setRecTime] = useState(0);
    const [recType, setRecType] = useState("");
    const [recViews, setRecViews] = useState(0);
    const [recUtensils, setRecUtensils] = useState([]);
    const [recIngredients, setRecIngredients] = useState([]);
    const [recDirections, setRecDirections] = useState("");
    const [recImage, setRecImage] = useState("");
    let currentRecipe;

    const drawerItems = [
      { name: "Home", icon: <HomeOutlined />, action:() => navigate("/") },
      { name: "Search Recipes", icon: <Search />, action:() => navigate("/") },
      { name: "New Recipe", icon: <Add />, action:() => navigate("/add-recipe") },
      { name: "Edit Recipe", icon: <Edit />, action:() => handleEditLink() },
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
    
    function handleEditLink() {
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
        setRecTime(currentRecipe.time_mins);
        setRecType(currentRecipe.meal_type);
        setRecViews(currentRecipe.views);
        setRecUtensils(currentRecipe.utensils);
        setRecIngredients(currentRecipe.ingredients);
        setRecDirections(currentRecipe.instructions);
        setRecImage(currentRecipe.image_path);
        console.log("viewing recipe: " + currentRecipe.name);
      })
    }

    function parseDirections(directions) {
      
    }

    return redirect ?
    <Navigate to="/edit-recipe" replace={true} state={{rid: {linkRecipeId}}} />
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
          <h1>{recName} <img src={recImage}/></h1>
          <h2>Energy: {recEnergy} <br />Time: {recTime} min
          <br />Meal type: {recType}
          <br />Views: {recViews}</h2>
          <hr />
          <h2>Utensils: {recUtensils.join(", ")}</h2>
          <h2>Ingredients: { /* TODO */ }</h2>
          <hr />
          <h2>Directions:<br />{recDirections}</h2>
        </div>
      </div>
    )
}

export default ViewPage;