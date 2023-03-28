import {useState} from 'react';
import axios from 'axios';
import './App.css';
import TextField from '@mui/material/TextField';
import { Button, Card, CardContent, CardHeader, CardMedia, MenuItem, Select, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

function ResultList({ results }) {
  return (
    <div>
      {results.map((string, index) => {
        return (
        <Card key={index} sx={{ minWidth: 200, maxWidth: 300 }} variant='outlined'>
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
        )
      })}
    </div>
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
