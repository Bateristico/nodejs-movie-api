const ApiServices = require('../services/api.services');

const Movie = require('../models/movie.model');

exports.getMovies = async (currentPage, perPage) => {
	// pagination logic
	if (currentPage) {
		try {
			let totalItems;
			const count = await Movie.find().countDocuments();
			totalItems = count;
			try {
				const result = await Movie.find()
					.skip((currentPage - 1) * perPage)
					.limit(parseInt(perPage));
				return result;
			} catch (error) {
				error.statusCode = 404;
				throw new Error(error);
			}
		} catch (error) {
			error.statusCode = 400;
			throw new Error(error);
		}
	} else {
		// no pagination
		try {
			const result = await Movie.find();
			return result;
		} catch (error) {
			error.statusCode = 400;
			throw new Error(error);
		}
	}
};

exports.getMovie = async (title) => {
	if (!title) {
		const error = new Error('Movie not specified');
		error.statusCode = 400;
		return new Error(error);
	}
	try {
		const result = await Movie.findOne({ title });
		return result;
	} catch (error) {
		error.statusCode = 500;
		throw new Error(error);
	}
};

exports.saveMovie = async (title, userInfo) => {
	// check if movie exists
	const exists = await Movie.find({ title });
	if (exists.length) {
		const error = new Error(
			`The movie ${title} already exists in the database`
		);
		error.statusCode = 400;
		throw new Error(error);
	}

	const { userId, role } = userInfo;
	const dateTo = new Date(),
		dateFrom = new Date(+new Date() - 2678400000); // rest one month

	// basic user restriction (5 movies per month)
	if (role === 'basic') {
		const occurrences = await Movie.find({
			'creator.id': userId,
			createdAt: {
				$gte: dateFrom,
				$lte: dateTo,
			},
		}).countDocuments();
		if (occurrences >= 5) {
			const error = new Error(
				'user reached the maximum amount of movies per month. Please update to a premium plan'
			);
			error.statusCode = 400;
			throw new Error(error);
		}
	}

	let movieDetailsPayload;
	// call movie api
	try {
		movieDetailsPayload = await ApiServices.callMovieApi(title);
		if (movieDetailsPayload.data.Error) {
			const error = movieDetailsPayload.data.Error;
			error.statusCode = 407;
			throw new Error(error);
		}
	} catch (error) {
		error.statusCode = 400;
		throw new Error(error);
	}

	const movie = new Movie({
		title: movieDetailsPayload.data.Title,
		released: movieDetailsPayload.data.Released,
		genre: movieDetailsPayload.data.Genre,
		director: movieDetailsPayload.data.Director,
		creator: { id: userInfo.userId, name: userInfo.name, role: userInfo.role },
	});
	// save the movie
	try {
		const result = await movie.save();
		return result;
	} catch (error) {
		throw new Error(error);
	}
};

exports.deleteMovie = async (title) => {
	if (!title) {
		return new Error('Movie not specified');
	}
	try {
		let result = await Movie.find({ title });
		if (!result[0]) {
			return (result = null);
		} else {
			const movieId = result[0]._id;
			result = await Movie.findByIdAndRemove(movieId);
		}
		return result;
	} catch (error) {
		throw new Error(error);
	}
};

exports.pagination = async (currentPage, totalPerPage) => {
	let totalItems;
	try {
		const count = await Movie.find();
	} catch (error) {
		throw new Error(error);
	}
};
