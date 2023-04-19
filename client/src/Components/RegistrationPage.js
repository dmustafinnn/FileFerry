import { Avatar, Button, Grid, Link, Paper, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import React from "react";
import axios_instance from "../config";
import { useNavigate } from "react-router-dom";

const RegistrationPage = () => {
    const navigate = useNavigate();
    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        axios_instance.post('/auth/registration', {
            firstname: data.get('name'),
            username: data.get('email'),
            password: data.get('password'),
            confirmPassword: data.get('confirmPassword')
        }).then(response => {
            if(response.data.success === true){
                navigate('/dashboard');
                localStorage.setItem('user',JSON.stringify(response.data));
            }
        })
    };

    const validatePasswords = e => {
        
    }

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
                        Sign in
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
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="new-password"
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="conformPassword"
                            label="Confirm Password"
                            type="password"
                            id="confirmPassword"
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign Up
                        </Button>
                        <Grid container>
                            <Grid item>
                                <Button variant="text"
                                onClick={()  => {
                                    navigate("/login")
                                }}>Already have an account? Sign in</Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    );
}

export default RegistrationPage;