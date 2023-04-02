import axios from 'axios';

const axios_instance = axios.create({
    baseURL: 'http://localhost:5000' // replace with your API URL and default port
});

export default axios_instance;