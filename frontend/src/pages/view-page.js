import React, { useEffect } from 'react';
import {useState} from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Button, Drawer, ListItem, ListItemIcon, ListItemText, IconButton, TextField, Grid, Typography, Stack } from '@mui/material';
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
        currentRecipe.ingredients.forEach(element => console.log("ingredient: " + String(element.name) +  "\t" + "details: " + String(element.notes)));
        setRecIngredients(currentRecipe.ingredients);
        setRecDirections(currentRecipe.instructions);
        setRecImage(currentRecipe.image_path);
        console.log("viewing recipe: " + currentRecipe.name);
      })
    }

    function parseDirections(directions) {
      
    }

    function titleCase(str) {
      return str.toLowerCase().split(' ').map(function (word) {
        return (word.charAt(0).toUpperCase() + word.slice(1));
      }).join(' ');
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
          {/* <h1 style={{textAlign : 'center'}}>{recName}</h1> */}
          <Grid container direction="column" alignItems="center" justify="center">
            <Grid item>
              <img src={recImage}/>
            </Grid>
            <Grid item>
              <Typography variant="h2" align="center">{recName}</Typography>
            </Grid>
          </Grid>
          <h2>Energy: {recEnergy.charAt(0).toUpperCase() + recEnergy.slice(1)} <br />Time: {recTime} min
          <br />Meal Type: {recType.charAt(0).toUpperCase() + recType.slice(1)}
          <br /># of Views: {recViews}</h2>
          <hr />
          <h2>Utensils: {recUtensils.map((str) => titleCase(str)).join(", ")}</h2>
          <h2>Ingredients:</h2>
            
          <Grid container style={{direction:'column', alignItems:'flex-start', justify:'center', textAlign:'left', display:'inline-block'}}>
          
            <Grid item>
            <ul style={{listStylePosition:'inside', margin:"auto", textAlign:"justify", verticalAlign:"middle", position: 'relative', display:'table'}}>
              {recIngredients.map((ingredient) => (
                <Grid item> <li>{ingredient.name} &rarr; {ingredient.notes}</li> </Grid>
              ))}
            </ul>
            </Grid>

          </Grid>

          <hr />
          <h2>Directions:</h2>

            <ul style={{listStylePosition:'inside', margin:"auto", textAlign:"justify", verticalAlign:"middle", display:'inline-block', listStyleType:'none'}}>
                {recDirections.split("\n").map((instruction) => (
                  <li>{instruction}</li>
                ))}
            </ul>

        </div>
      </div>
    )
}

export default ViewPage;