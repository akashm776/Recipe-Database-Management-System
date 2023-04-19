import React from 'react';
import {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Drawer, ListItem, ListItemIcon, ListItemText, IconButton, Select, MenuItem } from '@mui/material';
import {Add, Search, DensityMedium, HomeOutlined} from "@mui/icons-material";
import axios from 'axios';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/system';

const maxUtensils = 50;
const maxIngredients = 100;

function uploadImage(file) {
  let formdata = new FormData();
  formdata.append("image", file);
  axios.post("upload",formdata, {
    headers: {
      "Content-Type": "multipart/form-data",
    }
  });
  
  // axios({
  //   method: 'POST',
  //   url: 'upload',
  //   headers: {
  //     "Content-Type": "multipart/form-data",
  //   },
  //   data: {
  //     file: formdata
  //   }
  // })
}

const AddPage = () => {
    const navigate = useNavigate();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [title, setTitle] = useState(null);
    const [energy, setEnergy] = useState("Easy");
    const [time, setTime] = useState(0);
    const [directions, setDirections] = useState(null);
    const [utensils, setUtensils] = useState([Array(maxUtensils).fill(null)]);
    const [utensilsActive, setUtensilsActive] = useState([Array(maxUtensils).fill(null)]);
    const [nextUtensil, setNextUtensil] = useState(0);
    const [ingredients, setIngredients] = useState([Array(maxIngredients).fill(null)]);
    const [ingredientsActive, setIngredientsActive] = useState([Array(maxIngredients).fill(null)]);
    const [nextIngredient, setNextIngredient] = useState(0);

    const drawerItems = [
      { name: "Home", icon: <HomeOutlined />, action:() => navigate("/") },
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
      {/* if (!utensilsActive[0]) {
        addUtensil();
      } */}
      let uLabel = "Utensil " + (i + 1);

      return (
        <li key={i}>
          <br />
          <TextField label={uLabel}
            style={{flex:'auto', marginRight:'4px'}} variant="outlined" hiddenLabel autoFocus />
        </li>
      )
    });

    const ingredientBoxes = ingredientsActive.map((thingy, i) => {
      {/* if (!ingredientsActive[0]) {
        addIngredient();
      } */}
      let iLabel = "Ingredient " + (i + 1);
      let dLabel = "Details for Ingredient " + (i + 1);

      return (
        <li key={i}>
          <br />
          <TextField 
            label={iLabel}
            style={{flex:'auto', marginRight:'4px'}} variant="outlined" hiddenLabel autoFocus />
          <TextField 
            label={dLabel}
            style={{flex:'auto', marginRight:'4px'}} variant="outlined" hiddenLabel autoFocus />
        </li>
      )
    });

    function addUtensil() {
      utensilsActive[nextUtensil] = 1;
      setNextUtensil(nextUtensil + 1);
    }

    function addIngredient() {
      ingredientsActive[nextIngredient] = 1;
      setNextIngredient(nextIngredient + 1);
    }

    function selectFile(event) {
      setCurrentImage(event.target.files[0])
      setImagePreview(URL.createObjectURL(event.target.files[0]))
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

    function handleDirectionsChange(event) {
      setDirections(event.target.value);
    }

    return (
      <div className="App">
        <div className="searchRow" style={{display:'flex', margin:'12px'}}>
          <Button className="sideBarButton" onClick={() => setDrawerOpen(true)}><IconButton><DensityMedium/></IconButton></Button>
          <Drawer open={drawerOpen} anchor={"left"} onClose={() => setDrawerOpen(false)}>
            {getDrawerList()}
          </Drawer>
        </div>

        {/* <div className="imageUpload" sx={{width:'300px', height:'300px'}}> */}
        <Box className="imageUpload" sx={{display:'table-cell', width:'300px', height:'100px'}}>
          <label htmlFor="btn-upload">
            <input
              id="btn-upload"
              name="btn-upload"
              style={{ display: 'none' }}
              type="file"
              accept="image/*"
              onChange={selectFile} />
            <Button
              className="btn-choose"
              variant="outlined"
              component="span" >
                Choose Image
            </Button>
          </label>
          <img src={imagePreview} alt="" style={{width:'300px', maxHeight:'300px'}} />
          <div className="file-name">
            {currentImage ? currentImage.name : null}
          </div>
          <Button
            className="btn-upload"
            color="primary"
            variant="contained"
            component="span"
            disabled={!currentImage}
            onClick={()=>uploadImage(currentImage)}>
            Upload
          </Button>
        </Box>

        <div>
          <TextField 
            label="Title" onChange={handleTitleChange}
            style={{flex:'auto', marginRight:'4px'}} variant="outlined" hiddenLabel autoFocus />
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
            style={{flex:'auto', marginRight:'4px'}} variant="outlined" hiddenLabel autoFocus />
        </div>

        <div>
          <hr /><br />
          Utensils
          <ol>
            {utensilBoxes}
          </ol>
          <Button onClick={addUtensil}>Add Utensil</Button>
        </div>

        <div>
          <hr /><br />
          Ingredients
          <ol>
            {ingredientBoxes}
          </ol>
          <Button onClick={addIngredient}>Add Ingredient</Button>
        </div>

        <div>
          <hr /><br />
          <TextField 
            label="Directions" onChange={handleDirectionsChange}
            style={{flex:'auto', marginRight:'4px'}} variant="outlined" hiddenLabel autoFocus />
        </div>
        
        {/* </div> */}
      </div>
    )
}

export default AddPage;