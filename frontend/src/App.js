import {useState} from 'react';
import axios from 'axios';
import './App.css';
import TextField from '@mui/material/TextField';
import { Button, Card, CardContent, CardHeader, CardMedia, Drawer, ListItem, ListItemIcon, ListItemText, Grid, MenuItem, Select, Typography, IconButton } from '@mui/material';
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

function App() {
  const [searchBarText, setSearchBarText] = useState("");
  const [sortBy, setSortBy] = useState("alphabetical"); // default value
  const [searchedFor, setSearchedFor] = useState("");
  const [results, setResults] = useState([]);

  function search(recipeName) {
    setSearchedFor(recipeName)
    axios({
      method: 'POST',
      url: 'query',
      data: {
        name: recipeName,
        sort: sortBy
      }
    }).then((response) => {
      let res = JSON.parse(response.data.results);
      console.log("received "+res.length+" recipes");
      //  console.log("received: "+results[0]['name']);
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
      <p>Search results for: <b>{searchedFor}</b></p>
      <ResultList results={results}/>
    </div>
  );
}

export default App;
