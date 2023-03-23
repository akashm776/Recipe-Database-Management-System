import {useState} from 'react';
import axios from 'axios';
import './App.css';
import TextField from '@mui/material/TextField'
import { Button, Card, CardContent, CardHeader, CardMedia, Typography } from '@mui/material';

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
  const [searchResults, setSearchResults] = useState([]);

  function search(val) {
    axios({
      method: 'POST',
      url: 'query',
      data: {
        name: val
      }
    }).then((response) => {
       console.log("received: "+JSON.parse(response.data.results));
       setSearchResults(JSON.parse(response.data.results));
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
      <TextField class="searchbar" label="Search" onChange={handleChange} onKeyDown={handleKeyDown} variant="outlined" autoFocus/>
      <Button size='' onClick={()=>{search(searchBarText)}} variant='contained'>Search</Button>
      <p>Search results for: <b>{searchBarText}</b></p>
      <ResultList results={searchResults}/>
    </div>
  );
}

export default App;
