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
        {results.map((string, index) => {
          return (
            <Grid item xs={4}>
              <Card key={index} sx={{ minWidth: 200, maxWidth: 400 }} variant='outlined'>
                <CardHeader title={string}/>
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
       console.log("received: "+JSON.parse(response.data.results));
       setResults(JSON.parse(response.data.results));
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
      <div class="searchRow" style={{display:'flex', margin:'12px'}}>
        <TextField 
          class="searchbar" label="Search" 
          onChange={handleChange} onKeyDown={handleKeyDown} 
          style={{flex:'auto', marginRight:'4px'}} variant="outlined" hiddenLabel fullWidth autoFocus />
        <Button 
          class='searchButton' 
          onClick={()=>{search(searchBarText)}} 
          style={{flex:'none', marginRight:'4px'}} variant='contained' >
            <SearchIcon />
        </Button>
        <Select 
          class='sortSelect' label="Sort by"
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
