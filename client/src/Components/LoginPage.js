import { Button, Grid, Paper, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React, { useEffect } from "react";
import axios_instance from "../config";
import { useNavigate } from "react-router-dom";

// Login Page is written using MUI open source template
// https://github.com/mui/material-ui/blob/v5.11.15/docs/data/material/getting-started/templates/sign-in-side/SignInSide.js
const LoginPage = () => {
	const navigate = useNavigate();

	useEffect(() => {
		// TODO: Call logout api and invalidate the jwt token
		localStorage.clear();
	});

	const handleSubmit = (event) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		axios_instance
			.post("/auth/login", {
				username: data.get("email"),
				password: data.get("password"),
			})
			.then((response) => {
				if (response.data.success === true) {
					navigate("/");
					localStorage.setItem("token", response.data.token);
					localStorage.setItem("user", JSON.stringify(response.data));
				}
			});
	};

	return (
		<Grid container component="main" sx={{ height: "100vh", padding: 0 }}>
			<Grid
				item
				xs={false}
				sm={4}
				md={7}
				sx={{
					backgroundImage: "url(https://source.unsplash.com/NTYYL9Eb9y8)",
					backgroundRepeat: "no-repeat",
					backgroundColor: (t) =>
						t.palette.mode === "light"
							? t.palette.grey[50]
							: t.palette.grey[900],
					backgroundSize: "cover",
					backgroundPosition: "center",
					justifyContent: "center",
					alignItems: "center",
				}}
			/>
			<Grid item xs={12} sm={8} md={5} component={Paper} elevation={2} square>
				<Box
					sx={{
						my: 8,
						mx: 4,
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}
				>
					<img src={'/logo.png'} alt={``}/>
					<img src={'/name.png'} alt={``}/>

					<Typography component="h1" variant="h5">
						Sign in
					</Typography>
					<Box
						component="form"
						noValidate
						onSubmit={handleSubmit}
						sx={{ mt: 1 }}
					>
						<TextField
							margin="normal"
							required
							fullWidth
							id="email"
							label="Email Address"
							name="email"
							autoComplete="email"
							autoFocus
						/>
						<TextField
							margin="normal"
							required
							fullWidth
							name="password"
							label="Password"
							type="password"
							id="password"
							autoComplete="current-password"
						/>
						<Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
							Sign In
						</Button>
						<Grid container>
							<Grid item>
							<Button variant="text"
                                onClick={()  => {
                                    navigate("/registration")
                                }}>Don't have an account? Sign Up</Button>
							</Grid>
						</Grid>
					</Box>
				</Box>
			</Grid>
		</Grid>
	);
};

export default LoginPage;
