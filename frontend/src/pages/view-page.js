import React, { useEffect, Helmet } from 'react';
import {useState} from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Button, Drawer, ListItem, ListItemIcon, ListItemText, IconButton, TextField, Grid, Typography, Stack } from '@mui/material';
import {Add, Edit, Search, DensityMedium} from "@mui/icons-material";

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
      //{ name: "Home", icon: <HomeOutlined />, action:() => navigate("/") },
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
          if (state.rid == null) { navigate("/") }
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
        setRecViews(currentRecipe.views + 1);
        setRecUtensils(currentRecipe.utensils);
        currentRecipe.ingredients.forEach(element => console.log("ingredient: " + String(element.name) +  "\t" + "details: " + String(element.notes)));
        setRecIngredients(currentRecipe.ingredients);
        setRecDirections(currentRecipe.instructions);
        setRecImage(currentRecipe.image_path);
        console.log("viewing recipe: " + currentRecipe.name);
        incrementViews(state.rid["linkRecipeId"], currentRecipe.views);
      })
    }

    function incrementViews(recipeId, oldViews) {
      axios({
        method: 'POST',
        url: 'incrementviews',
        data: {
          rid: recipeId,
          views: oldViews
        }
      }).then((response) => {
        // If response.data is 1, success! If 0, failure :pensive:
        const success = response.data;
        if (success === 1) {
          console.log("view count updated");
        } else {
          console.log("view count update was unsuccessful");
        }
      })
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
              <img src={recImage} style={{maxWidth:'25%', height:'auto'}}/>
            </Grid>
            <Grid item>
              <Typography variant="h3" align="center"><u>{recName}</u></Typography>
            </Grid>
          </Grid>
          <Typography variant='subtitle1'><b>Energy:</b> {recEnergy.charAt(0).toUpperCase() + recEnergy.slice(1)} </Typography>
          <Typography variant='subtitle1'><b>Time:</b> {recTime} min</Typography>
          <Typography variant='subtitle1'><b>Meal Type:</b> {recType.charAt(0).toUpperCase() + recType.slice(1)}</Typography>
          <Typography variant='subtitle1'><b># of Views:</b> {recViews}</Typography>
          <hr />
          <Typography variant='h5'>Utensils:</Typography>
          <Typography variant='subtitle1'>{recUtensils.map((str) => titleCase(str)).join(", ")}</Typography>
          <Typography variant='h5'>Ingredients:</Typography>
            
          <Grid container style={{direction:'column', alignItems:'flex-start', justify:'center', textAlign:'left', display:'inline-block'}}>
          
            <Grid item>
            <ul style={{listStylePosition:'outside', margin:"auto", textAlign:"justify", verticalAlign:"middle", position: 'relative', display:'table'}}>
              {recIngredients.map((ingredient) => (
                <Grid item> <li><Typography variant='subtitle1'>{ingredient.name} &rarr; {ingredient.notes}</Typography></li> </Grid>
              ))}
            </ul>
            </Grid>

          </Grid>

          <hr />
          <Typography variant='h4'>Directions:</Typography>

            <ul style={{listStylePosition:'inside', margin:"auto", textAlign:"justify", verticalAlign:"middle", display:'inline-block', listStyleType:'none'}}>
                {recDirections.split("\n").map((instruction) => (
                  <li><Typography variant='subtitle1'>{instruction}</Typography></li>
                ))}
            </ul>
            <hr />     
        </div>
      </div>
    )
}

export default ViewPage;