import React from 'react';
import {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Drawer, ListItem, ListItemIcon, ListItemText, IconButton } from '@mui/material';
import {Add, Edit, Search, DensityMedium, HomeOutlined} from "@mui/icons-material";

const ViewPage = () => {
    const navigate = useNavigate();

    const drawerItems = [
      { name: "Home", icon: <HomeOutlined />, action:() => navigate("/") },
      { name: "Search Recipes", icon: <Search />, action:() => navigate("/") },
      { name: "New Recipe", icon: <Add />, action:() => navigate("/add-recipe") },
      { name: "Edit Recipe", icon: <Edit />, action:() => navigate("/edit-recipe") },
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
        </div>
      </div>
    )
}

export default ViewPage;