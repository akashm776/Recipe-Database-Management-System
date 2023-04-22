import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';
import TextField from '@mui/material/TextField';
import { Autocomplete, Button, Card, CardContent, CardHeader, CardMedia, Checkbox, FormControlLabel, Drawer, ListItem, ListItemIcon, ListItemText, Grid, MenuItem, Select, Typography, IconButton, Stack } from '@mui/material';
import { Container } from '@mui/system';
import {Add, Search, DensityMedium, HomeOutlined} from "@mui/icons-material";


// value: value stored in database
// display: checkbox label
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

function ResultList({ results }) {
    const navigate = useNavigate();
    return (
      <Container>
        <Grid container spacing={1} alignItems="center">
          {results.map((recipe, index) => {
            return (
              <Grid key={index} item xs={4}>
                <Card sx={{ /* minWidth: 200, maxWidth: 400 */ minWidth : 385, maxWidth : 385, minHeight : 285, maxHeight : 285 }} variant='outlined' onClick={() => navigate("/view-recipe")}>
                  <CardHeader title={recipe.name} titleTypographyProps={{variant : 'h6'}}/>
                  <CardMedia 
                    sx={{height:150}}
                    image={recipe['image_path']!==undefined ? recipe['image_path'] : "/istockphoto-612x612.jpg"}
                  />
                  <CardContent>
                    <Typography variant='body2' color='text.secondary'>
                      Energy Level: {recipe.energy.charAt(0).toUpperCase() + recipe.energy.slice(1)}
                      <br></br>
                      Total Time to Cook (in mins): {recipe.time_mins}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )
          })}
        </Grid>
      </Container>
    )
}

function TriStateCheckbox({ onChange, label, value }) {
  // 0 is blank, 1 is checked, 2 is checked with minus
  const [state, setState] = useState(0);

  function handleCheckboxClick() {
    let newState = (state+1)%3;
    setState(newState);
    onChange(value, newState);
  };

  return (
    <FormControlLabel label={label} 
      control={
        <Checkbox
          checked={state} // blank if false, checked if true
          indeterminate={state === 2} // force the - symbol
          onClick={handleCheckboxClick}
        />
      }
    />
  );
}

function CheckBoxList({ title, items, includes, setIncludes, excludes, setExcludes }) {

  function updateFilters(item, newState) {
    switch (newState) {
      case 0:
        // remove from negative filters
        setExcludes(excludes.filter((e)=>e!==item))
        break;
      case 1:
        // add to positive filters
        setIncludes(includes.concat(item))
        break;
      case 2:
        // remove from positive filters
        // add to negative filters
        setIncludes(includes.filter((e)=>e!==item))
        setExcludes(excludes.concat(item))
        break;
    }
  }

  return (
    <div>
      <Typography variant='h6'>{title}</Typography>
      <Stack direction='column'>
        {items.map((item, index)=>{
          return (
            <TriStateCheckbox label={item.display} value={item.value} onChange={updateFilters}/>
          )
        })}
      </Stack>
    </div>
  )
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

const SearchPage = () => {
  const navigate = useNavigate();
  const [searchBarText, setSearchBarText] = useState("");
  const [sortBy, setSortBy] = useState("alphabetical"); // default value
  const [goodIngredients, setGoodIngredients] = useState([])
  const [badIngredients, setBadIngredients] = useState([])
  const [goodEnergy, setGoodEnergy] = useState([]);
  const [badEnergy, setBadEnergy] = useState([]);
  const [goodMealTypes, setGoodMealTypes] = useState([]);
  const [badMealTypes, setBadMealTypes] = useState([]);
  const [searchedFor, setSearchedFor] = useState("");
  const [results, setResults] = useState([]);
  const [ingredients, setIngredients] = useState(["loading ingredients..."]);

  
  useEffect(()=>loadIngredients(setIngredients), []) // this function will only be called on initial page load

  // this will search any time any of the listed variables are updated
  useEffect(()=>{
    search();
  },[searchBarText, sortBy, goodIngredients, badIngredients, goodEnergy, badEnergy, goodMealTypes, badMealTypes]);

  function search() {
    setSearchedFor(searchBarText)
    axios({
      method: 'POST',
      url: 'query',
      data: {
        name: searchBarText,
        sort: sortBy,
        ingredients: {"include":goodIngredients, "exclude":badIngredients},
        energy: {"include":goodEnergy, "exclude":badEnergy},
        meal_type: {"include":goodMealTypes, "exclude":badMealTypes},
      }
    }).then((response) => {
      let res = JSON.parse(response.data.results);
      console.log("received "+res.length+" recipes");
      if (results[0]) {
        console.log("received: "+results[0]['name']);
        console.log("received: "+results[0]['image_path']);
      }
      setResults(res);
    })
  }

  function handleKeyDown(event) { // TODO remove
    if (event.key === "Enter") {
      search(); 
    }
  }

  const drawerItems = [
    { name: "Home", icon: <HomeOutlined />, action:() => navigate("/") },
    { name: "Search Recipes", icon: <Search />, action:() => navigate("/") },
    { name: "New Recipe", icon: <Add />, action:() => navigate("/add-recipe") },
  ];

  const [drawerOpen, setDrawerOpen] = useState(false);

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
  
  return (
    <div className="App">
      <div className="searchRow" style={{display:'flex', margin:'12px'}}>
        <Button className="sideBarButton" onClick={() => setDrawerOpen(true)}><IconButton><DensityMedium/></IconButton></Button>
        <Drawer open={drawerOpen} anchor={"left"} onClose={() => setDrawerOpen(false)}>
          {getDrawerList()}
        </Drawer>
        <TextField 
          className="searchbar" label="Search for a Recipe" 
          onChange={(event)=>setSearchBarText(event.target.value)} onKeyDown={handleKeyDown} 
          style={{flex:'auto', marginRight:'4px'}} variant="outlined" hiddenLabel fullWidth autoFocus />
        {/* <Button 
          className='searchButton' 
          onClick={()=>{search(searchBarText)}} 
          style={{flex:'none', marginRight:'4px'}} variant='contained' >
            <Search />
        </Button> */}
        <Select 
          className='sortSelect' label="Sort by"
          value={sortBy}
          onChange={(event)=>setSortBy(event.target.value)} >
            <MenuItem value="alphabetical">Alphabetical</MenuItem>
            <MenuItem value="date">Date Added</MenuItem>
            <MenuItem value="views">Views</MenuItem>
        </Select>
      </div>
      {/* <div className='secondRow' style={{display:'flex', margin:'12px'}}> */}
      <Stack direction='row' justifyContent='space-evenly' margin='12px'>
        <Stack direction='column'>
          <Autocomplete
            // maxWidth
            // style={{flex:'auto', marginRight:'4px'}}
            sx={{width:'70vw'}}
            value={goodIngredients}
            onChange={(event, newVal) => {setGoodIngredients(newVal)}}
            multiple
            options={ingredients}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Included Ingredients"
                placeholder="Type an ingredient"
              />
            )}
          />
          <Autocomplete
            maxWidth
            // style={{flex:'auto'}}
            value={badIngredients}
            onChange={(event, newVal) => {setBadIngredients(newVal)}}
            multiple
            options={ingredients}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Excluded Ingredients"
                placeholder="Type an ingredient"
              />
            )}
          />
        </Stack>
        <Stack direction='row'>
          <CheckBoxList title="Energy" items={energyLevels} includes={goodEnergy} setIncludes={setGoodEnergy} excludes={badEnergy} setExcludes={setBadEnergy} />
          <CheckBoxList title="Meal Type" items={mealTypes} includes={goodMealTypes} setIncludes={setGoodMealTypes} excludes={badMealTypes} setExcludes={setBadMealTypes} />
        </Stack>
      {/* </div> */}
      </Stack>

      {/* <div className="thirdRow" style={{display:'flex', margin:'12px'}}>
        <Select 
          className='energySelect' label="Energy"
          value={energy}
          onChange={(event)=>setEnergy(event.target.value)} >
            <MenuItem value="alphabetical">Alphabetical</MenuItem>
            <MenuItem value="date">Date Added</MenuItem>
            <MenuItem value="views">Views</MenuItem>
        </Select>
      </div> */}
      {/* <p>PosFilter: <b>{goodEnergy}</b></p>
      <p>NegFilter: <b>{badEnergy}</b></p> */}
      {/* <p>Search results for: <b>{searchedFor}</b></p> */}
      <ResultList results={results}/>
    </div>
  );
}

export default SearchPage;
