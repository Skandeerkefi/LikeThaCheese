import axios from "axios";

const api = axios.create({
	// baseURL: "https://misterteedata.onrender.com",
	baseURL: "likethacheesedata.railway.internal",
	// Your backend URL
});

export default api;
