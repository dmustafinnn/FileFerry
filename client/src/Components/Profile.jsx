import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Paper from '@mui/material/Paper';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Avatar from '@mui/material/Avatar';
import axios_instance from "../config";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Profile = () => {
    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
      });
    
      useEffect(() => {
        // You can fetch the user data here and update the state accordingly
        axios_instance.get('/users/').then((response) => {
            const data = response.data;
            setUser({
                firstName: data.name,
                email: data.email,
            })
        })
      }, []);
    
    //const steps = ['Profile form', 'Edit from'];
    const [activeStep, setActiveStep] = React.useState(0);
    
    // function getStepContent(step) {
    //     switch (step) {
    //         case 0:
    //             return <ProfileForm />;
    //         case 1:
    //             return <EditForm />;
    //         default:
    //             throw new Error('Unknown step');
    //     }
    // }

    const handleEdit = () => {
        //setActiveStep(activeStep + 1);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({
          ...prevUser,
          [name]: value,
        }));
      };
    
    
    const handleUpdate = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        axios_instance.patch('users/${userId}', {
            name: data.get('name'),
            email: data.get('email'),
            password: data.get('password')
        }).then(response => {
            if(response.data.success === true) {
                //setActiveStep(active - 1);
                localStorage.setItem('user',JSON.stringify(response.data));
                //setActiveStep(activeStep - 1);
            }
        })
    };
    
    const handleCancel = () => {
        //setActiveStep(activeStep - 1);
    };

    
    return (
        <Container component="main" maxwidth="sm" sx={{mb: 4}}>
            <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 }, ml: '250px' }}>
              <Typography component="h1" variant="h4" align="center">
                Profile Information
              </Typography>
              {/* <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
                </Stepper> */}
              <React.Fragment>
                <Grid container spacing={3} align="center">
                    <Grid item xs={12}>
                        <Avatar
                            alt="Profile Avatar"
                            sx={{ width: 120, height: 120}}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                        disabled
                            required
                            id="firstName"
                            name="firstName"
                            label="First name"
                            fullWidth
                            autoComplete="given-name"
                            variant="standard"
                            value={user.firstName}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                        disabled
                            required
                            id="lastName"
                            name="lastName"
                            label="Last name"
                            fullWidth
                            autoComplete="family-name"
                            variant="standard"
                            value={user.lastName}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                        disabled
                            required
                            id="email"
                            name="email"
                            label="Email"
                            fullWidth
                            autoComplete="email"
                            variant="standard"
                            value={user.email}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                        disabled
                            id="password"
                            name="password"
                            label="Password"
                            fullWidth
                            autoComplete="password"
                            variant="standard"
                            value={user.password}
                            onChange={handleChange}
                        />
                    </Grid>
                <Grid item xs={12}>
            {/* <Button variant="contained" 
                onClick={handleUpdate} sx={{ mt: 2 }}>
                Edit
            </Button> */}
             <Button variant="contained" 
                sx={{ mt: 2 }}>
                Edit
            </Button>
            </Grid>
          </Grid>
        </React.Fragment>
            </Paper>
        </Container>
    );

};

export default Profile;
