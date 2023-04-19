import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import "./index.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./Components/LoginPage";
import Dashboard from "./Components/Dashboard";
import isAuthenticated from "./utils/isAuthenticated";
import UploadFile from "./Components/UploadFile";

const root = ReactDOM.createRoot(document.getElementById("root"));

const PrivateRoute = ({ path, element }) => {
	return isAuthenticated() ? (
		element
	) : (
		<Navigate to="/login" replace state={{ from: path }} />
	);
};

const AppRoutes = () => (
	<Routes>
		<Route path="/login" element={<LoginPage />} />
		<Route path="/" element={<PrivateRoute element={<Dashboard />} />} />
		<Route path="/files" element={<PrivateRoute element={<UploadFile />} />} />
	</Routes>
);

root.render(
	<React.StrictMode>
		<BrowserRouter>
			<AppRoutes />
		</BrowserRouter>
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
