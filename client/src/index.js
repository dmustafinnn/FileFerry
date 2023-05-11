import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import "./index.css";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import LoginPage from "./Components/LoginPage";
import Dashboard from "./Components/Dashboard";
import Header from "./Components/Header";
import isAuthenticated from "./utils/isAuthenticated";
import RegistrationPage from "./Components/RegistrationPage";
import Whitelist from "./Components/Whitelist";
import Profile from "./Components/Profile";
import {createTheme, ThemeProvider} from "@mui/material";

const root = ReactDOM.createRoot(document.getElementById("root"));

const PrivateRoute = ({ path, element }) => {
	return isAuthenticated() ? (
		element
	) : (
		<Navigate to="/login" replace state={{ from: path }} />
	);
};

const theme = createTheme({
	palette: {
		primary: {
			main: '#206189',
		},
		secondary: {
			main: '#b5e1ee',
		},
	},
});

const AppRoutes = () => {
	const location = useLocation();

	return (
		<>
			{isAuthenticated() && location.pathname !== '/login' && location.pathname !== '/registration' && <Header />}
			< Routes >
				<Route path="/login" element={<LoginPage />} />
				<Route path="/" element={<PrivateRoute element={<Dashboard />} />} />
				<Route path="/registration" element={<RegistrationPage />} />
				<Route path="/whitelist" element={<PrivateRoute element={<Whitelist />} />} />
				<Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
			</Routes >
		</>
	)
};

root.render(
	<React.StrictMode>
		<BrowserRouter>
			<ThemeProvider theme={theme}>
				<AppRoutes />
			</ThemeProvider>
		</BrowserRouter>
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
