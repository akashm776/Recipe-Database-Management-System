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
  const [searchedFor, setSearchedFor] = useState("");
  const [results, setResults] = useState([]);

  function search(val) {
    setSearchedFor(val)
    axios({
      method: 'POST',
      url: 'query',
      data: {
        name: val
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
      <TextField class="searchbar" label="Search" onChange={handleChange} onKeyDown={handleKeyDown} variant="outlined" autoFocus/>
      <Button size='' onClick={()=>{search(searchBarText)}} variant='contained'>Search</Button>
      <p>Search results for: <b>{searchedFor}</b></p>
      <ResultList results={results}/>
    </div>
  );
}

export default App;
