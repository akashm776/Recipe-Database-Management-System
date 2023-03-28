import {useState} from 'react';
import axios from 'axios';
import './App.css';
import TextField from '@mui/material/TextField';
import { Button, Card, CardContent, CardHeader, CardMedia, Grid, MenuItem, Select, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Container } from '@mui/system';

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

  function search(val) {
    setSearchedFor(val)
    axios({
      method: 'POST',
      url: 'query',
      data: {
        name: val,
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
  
  return (
    <div className="App">
      <div className="searchRow" style={{display:'flex', margin:'12px'}}>
        <TextField 
          className="searchbar" label="Search" 
          onChange={handleChange} onKeyDown={handleKeyDown} 
          style={{flex:'auto', marginRight:'4px'}} variant="outlined" hiddenLabel fullWidth autoFocus />
        <Button 
          className='searchButton' 
          onClick={()=>{search(searchBarText)}} 
          style={{flex:'none', marginRight:'4px'}} variant='contained' >
            <SearchIcon />
        </Button>
        <Select 
          className='sortSelect' label="Sort by"
          value={sortBy}
          onChange={(event)=>setSortBy(event.target.value)} >
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
