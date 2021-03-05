const axios = require('axios');
const dotenv = require('dotenv').config();

const { OMDBAPI_KEY, OMBDAPI_BASE_URL } = process.env;

exports.callMovieApi = async (title) => {
	try {
		const movieDetails = await axios(
			`${OMBDAPI_BASE_URL}${OMDBAPI_KEY}&t=${title}`
		);
		return movieDetails;
	} catch (error) {
		error.statusCode = 400;
		throw new Error('Error on movie API');
	}
};

/*
exports.callAuthApi = async (req) => {
	try {
		console.log('call api');
	} catch (error) {
		throw new Error('Error on authentication API');
	}
};
*/
