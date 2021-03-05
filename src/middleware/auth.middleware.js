const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

const { JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
	const authHeader = req.get('Authorization');
	if (!authHeader) {
		const error = new Error('Not authenticated');
		error.statusCode = 401;
		throw error;
	}
	const token = req.get('Authorization').split(' ')[1]; // after Bearer
	let decodedToken;
	try {
		decodedToken = jwt.verify(token, JWT_SECRET);
	} catch (error) {
		error.statusCode = 401;
		throw error;
	}
	if (!decodedToken) {
		const error = new Error('Not authenticated');
		error.statusCode = 401;
		throw error;
	}

	req.userInfo = decodedToken;
	next();
};
