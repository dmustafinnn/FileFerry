const jwt = require("jsonwebtoken");

function generateToken(user) {
	const token = jwt.sign(
		{ username: user.username, id: user._id },
		process.env.JWT_SECRET,
		{ expiresIn: "1h" }
	);
	return token;
}

module.exports = generateToken;
