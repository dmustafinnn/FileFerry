import { Button, Grid, Paper, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React from "react";
import axios_instance from "../config";
import { useNavigate } from "react-router-dom";
import { useState } from "react";




const RegistrationPage = () => {
    const navigate = useNavigate();

     // Define state variables for password and confirm password fields
     const [password, setPassword] = useState('');
     const [confirmPassword, setConfirmPassword] = useState('');
     const [validPassword, setValidPassword] = useState(false);
 
    const handleSubmit = (event) => {
        event.preventDefault();
        validatePassword();
        console.log(validPassword)
        // password === confirmPassword
        if(password === confirmPassword) {
            const data = new FormData(event.currentTarget);
            axios_instance.post('/auth/register', {
                name: data.get('name'),
                email: data.get('email'),
                username: data.get('email'),
                password: data.get('password')
            }).then(response => {
                if(response.data.success === true){
                    navigate('/dashboard');
                    localStorage.setItem('user',JSON.stringify(response.data));
                }
            })
        }
    };

    // Define event handlers for password and confirm password fields
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    // Define function to validate the confirm password field
    const validatePassword = () => {
        setValidPassword(password === confirmPassword);
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
                    <img src={'/logo.png'} alt={``}/>
                    <img src={'/name.png'} alt={``}/>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1, maxWidth:'500px' }}>
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
                            value={password}
                            onChange={handlePasswordChange}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="conformPassword"
                            label="Confirm Password"
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
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