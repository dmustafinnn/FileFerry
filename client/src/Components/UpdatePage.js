import { Avatar, Button, Grid, Link, Paper, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import React from "react";
import axios_instance from "../config";
import { useNavigate } from "react-router-dom";
import { useState } from "react";


const UpdatePage = ({ userId }) => {
    const navigate = useNavigate();

    const handleNameChange = (event) => {
        setName(event.target.value);
      };
    
      const handleEmailChange = (event) => {
        setEmail(event.target.value);
      };


      const handleUpdateUser = async (event) => {
        event.preventDefault();
        try {
          const response = await axios.put(`/users/${userId}`, { username, name, email, password});
          console.log(response.data); // log updated user data
        } catch (error) {
          console.error(error);
        }
    };


  return (
        <Grid container component="main" sx={{ height: '100vh', padding: 0 }}>
            <Grid
                item
                xs={false}
                sm={4}
                md={7}
                sx={{
                    backgroundImage: 'url(https://source.unsplash.com/NTYYL9Eb9y8)',
                    backgroundRepeat: 'no-repeat',
                    backgroundColor: (t) =>
                        t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={2} square>
                <Box
                    sx={{
                        my: 8,
                        mx: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Update Information
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="name"
                            label="Name"
                            name="name"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoFocus
                            autoComplete="email"
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="New Password"
                            type="password"
                            id="password"
                            autoComplete="new-password"
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="conformPassword"
                            label="Confirm New Password"
                            type="password"
                            id="confirmPassword"
                        />
                        <Button type="submit" 
                        variant="contained"
                            sx={{ mt: 3, mb: 2 }}>
                            Update Information
                        </Button>
                        <Grid container>
                        </Grid>
                    </Box>
                </Box>
            </Grid>
        </Grid>
  );
}

export default UpdatePage;