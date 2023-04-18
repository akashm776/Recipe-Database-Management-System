import React from 'react';
import {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Drawer, ListItem, ListItemIcon, ListItemText, IconButton } from '@mui/material';
import {Add, Search, DensityMedium, HomeOutlined} from "@mui/icons-material";
import axios from 'axios';
import { Box } from '@mui/system';

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

    function selectFile(event) {
      setCurrentImage(event.target.files[0])
      setImagePreview(URL.createObjectURL(event.target.files[0]))
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
        <Box className="imageUpload" sx={{display:'table-cell', width:'300px', height:'300px'}}>
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
        {/* </div> */}
      </div>
    )
}

export default AddPage;