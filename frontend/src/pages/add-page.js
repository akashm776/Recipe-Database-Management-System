import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

const AddPage = () => {
    const navigate = useNavigate();

    return (
      <div>
        <Button variant="contained" onClick={() => navigate("/")}>Search Recipes</Button>
      </div>
    )
}

export default AddPage;