const { validationResult } = require('express-validator');
const AuthServices = require('../services/auth.services');

exports.login = (req, res, next) => {
	const errors = validationResult(req);
	// Errors on the request body
	if (!errors.isEmpty()) {
		return res.status(400).json({
			message: 'Invalid username or password',
			errors: errors.array(),
		});
	}
	const user = req.body;
	//console.log('user', user);

	const authenticate = async (user) => {
		try {
			const authResult = await AuthServices.callAuthService(user);
			res.status(200).json({ token: authResult });
		} catch (error) {
			res.status(407).json({
				message: error.message,
			});
		}
	};

	authenticate(user);
};
