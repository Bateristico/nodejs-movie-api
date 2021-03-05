const axios = require('axios');
const dotenv = require('dotenv').config();

const { NETGURU_SERVICE_URL } = process.env;

exports.callAuthService = async (user) => {
	try {
		const authResponse = await axios.post(NETGURU_SERVICE_URL, user);
		const token = authResponse.data.token;
		//console.log(token);
		return token;
	} catch (error) {
		//console.log(error.code);
		if (error.code === 'ECONNREFUSED') {
			throw new Error('Error connecting to the API');
		} else {
			throw new Error(error.response.data.error);
		}
	}
};
