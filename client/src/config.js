import axios from "axios";

const axios_instance = axios.create({
	baseURL: "http://localhost:5000", // replace with your API URL and default port
});

axios_instance.interceptors.request.use((config) => {
	const token = localStorage.getItem("token");
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

export default axios_instance;
