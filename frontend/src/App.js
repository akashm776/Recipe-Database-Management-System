import {useState} from 'react';
import axios from 'axios';
import './App.css';
import TextField from '@mui/material/TextField';
<<<<<<< HEAD
import { Button, Card, CardContent, CardHeader, CardMedia, Drawer, ListItem, ListItemIcon, ListItemText, Grid, MenuItem, Select, Typography, IconButton } from '@mui/material';
=======
import { Autocomplete, Button, Card, CardContent, CardHeader, CardMedia, Checkbox, FormControlLabel, Grid, MenuItem, Select, Stack, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
>>>>>>> 29454b5510f28a68ef4427937bf2bbc8bdc91a33
import { Container } from '@mui/system';
import {Add, Search, DensityMedium, HomeOutlined} from "@mui/icons-material";

const data = [
  {name: "Home", icon: <HomeOutlined /> },
  { name: "Search Recipes", icon: <Search /> },
  { name: "New Recipe", icon: <Add /> },
];

function ResultList({ results }) {
  return (
    <Container>
      <Grid container spacing={1} alignItems="center">
        {results.map((recipe, index) => {
          return (
            <Grid key={index} item xs={4}>
              <Card sx={{ minWidth: 200, maxWidth: 400 }} variant='outlined'>
                <CardHeader title={recipe.name}/>
                <CardMedia 
                  sx={{height:150}}
                  image="/istockphoto-612x612.jpg"
                />
                <CardContent>
                  <Typography variant='body2' color='text.secondary'>
                    placeholder text
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

function TriStateCheckbox({ onChange, label }) {
  // 0 is blank, 1 is checked, 2 is checked with minus
  const [state, setState] = useState(0);

  function handleCheckboxClick() {
    let newState = (state+1)%3;
    setState(newState);
    onChange(label, newState);
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

function FilterList({ items, includes, setIncludes, excludes, setExcludes }) {
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
    <div style={{display:'flex', margin:'12px'}}>
      {/* {items.map((item, index)=>{
        return (
          <TriStateCheckbox label={item} onChange={updateFilters}/>
        )
      })} */}
      <Autocomplete
        style={{flex:'auto', marginRight:'4px'}}
        value={includes}
        onChange={(event, newVal) => {setIncludes(newVal)}}
        multiple
        options={items}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Included Ingredients"
            placeholder="Type an ingredient"
          />
        )}
      />
      <Autocomplete
        style={{flex:'auto'}}
        value={excludes}
        onChange={(event, newVal) => {setExcludes(newVal)}}
        multiple
        options={items}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Excluded Ingredients"
            placeholder="Type an ingredient"
          />
        )}
      />
    </div>
  )
}

function App() {
  const [searchBarText, setSearchBarText] = useState("");
  const [sortBy, setSortBy] = useState("alphabetical"); // default value
  const [goodIngredients, setGoodIngredients] = useState([])
  const [badIngredients, setBadIngredients] = useState([])
  const [searchedFor, setSearchedFor] = useState("");
  const [results, setResults] = useState([]);
  const [ingredients, setIngredients] = useState(["ground beef","mild sausage","butter","potatoes"]);

  function search(recipeName) {
    setSearchedFor(recipeName)
    axios({
      method: 'POST',
      url: 'query',
      data: {
        name: recipeName,
        sort: sortBy,
        include_ingredients: goodIngredients,
        exclude_ingredients: badIngredients
      }
    }).then((response) => {
      let res = JSON.parse(response.data.results);
      console.log("received "+res.length+" recipes");
      // console.log("received: "+results[0]['name']);
      setResults(res);
    })
  }

  function handleChange(event) {
    setSearchBarText(event.target.value);
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      search(searchBarText);
    }
  }

  function handleSortByChange(event) {
    setSortBy(event.target.value);
    search(searchedFor);
  }
  
  const [open, setOpen] = useState(false);

  const getList = () => (
    <div style={{ width: 250 }} onClick={() => setOpen(false)}>
      {data.map((item, index) => (
        <ListItem button key={index}>
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.name} />
        </ListItem>
      ))}
    </div>
  );

  return (
    <div className="App">

    <div>
      <Button className="sideBarButton" onClick={() => setOpen(true)}><IconButton><DensityMedium/></IconButton></Button>
      <Drawer open={open} anchor={"left"} onClose={() => setOpen(false)}>
        {getList()}
      </Drawer>
    </div>

      <div className="searchRow" style={{display:'flex', margin:'12px'}}>
        <TextField 
          className="searchbar" label="Search" 
          onChange={handleChange} onKeyDown={handleKeyDown} 
          style={{flex:'auto', marginRight:'4px'}} variant="outlined" hiddenLabel fullWidth autoFocus />
        <Button 
          className='searchButton' 
          onClick={()=>{search(searchBarText)}} 
          style={{flex:'none', marginRight:'4px'}} variant='contained' >
            <Search />
        </Button>
        <Select 
          className='sortSelect' label="Sort by"
          value={sortBy}
          onChange={handleSortByChange} >
            <MenuItem value="alphabetical">Alphabetical</MenuItem>
            <MenuItem value="date">Date Added</MenuItem>
            <MenuItem value="views">Views</MenuItem>
        </Select>
      </div>
      <FilterList items={ingredients} includes={goodIngredients} setIncludes={setGoodIngredients} excludes={badIngredients} setExcludes={setBadIngredients} />
      {/* <p>PosFilter: <b>{goodIngredients}</b></p>
      <p>NegFilter: <b>{badIngredients}</b></p> */}
      <p>Search results for: <b>{searchedFor}</b></p>
      <ResultList results={results}/>
    </div>
  );
}

export default App;
