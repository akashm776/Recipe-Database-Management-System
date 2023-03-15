import {useState} from 'react';
import axios from 'axios';
import './App.css';

function SearchBar({onEnter}) {
  function handleKeyDown(event) {
    if (event.key === "Enter") {
      onEnter(event.target.value);
    }
  }

  return <input type="text" placeholder="Search" onKeyDown={handleKeyDown} />;
}

function App() {
  const [searchBarText, setSearchBarText] = useState("");
  const [searchResult, setSearchResult] = useState("");

  function search(val) {
    setSearchBarText(val);
    axios({
      method: 'POST',
      url: 'query',
      data: {
        name: val
      }
    })
    .then((response) => {
       console.log("received");
       setSearchResult(response.data.message);
    })
  }

  return (
    <div className="App">
      <SearchBar onEnter={search} />
      <p>Search results for: <b>{searchBarText}</b></p>
      <p>{searchResult}</p>
    </div>
  );
}

export default App;
