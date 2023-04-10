import jwtDecode from "jwt-decode";

const isAuthenticated = () => {
	const token = localStorage.getItem("token");
	console.log(token);
	if (!token) {
		return false;
	}

	try {
		const decodedToken = jwtDecode(token);

		if (decodedToken.exp < Date.now() / 1000) {
			return false;
		}

		return true;
	} catch (err) {
		return false;
	}
};

export default isAuthenticated;
