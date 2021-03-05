const { validationResult } = require('express-validator');
const MoviesService = require('../services/movies.services');

exports.getMovies = (req, res, next) => {
	const currentPage = req.query.page;
	const perPage = req.query.perPage || 3; // fixed amount if perPage doesnt come in the request

	const getMovies = async (currentPage, perPage) => {
		try {
			const moviesResult = await MoviesService.getMovies(currentPage, perPage);
			res
				.status(200)
				.json({ message: 'Movies fetched successfully', movies: moviesResult });
		} catch (error) {
			res.status(400).json({
				message: error.message,
			});
		}
	};

	getMovies(currentPage, perPage);
};

exports.getMovie = (req, res, next) => {
	const title = req.params.title;

	const getMovie = async (title) => {
		let movieResult;
		try {
			movieResult = await MoviesService.getMovie(title);
			if (movieResult === null) {
				res.status(404).json({
					message: 'Movie not found in the collection',
				});
			} else {
				res.status(200).json({
					message: 'Movie fetched successfully',
					movie: movieResult,
				});
			}
		} catch (error) {
			res.status(400).json({
				message: error.message,
			});
		}
	};

	getMovie(title);
};

exports.postMovie = (req, res, next) => {
	const errors = validationResult(req);
	// Errors on the request body
	if (!errors.isEmpty()) {
		return res.status(422).json({
			message: 'movie title cannot have less than 3 characters',
			errors: errors.array(),
		});
	}

	const title = req.body.title;
	const userInfo = req.userInfo;
	const addMovie = async (title, userInfo) => {
		try {
			const movieResult = await MoviesService.saveMovie(title, userInfo);
			res.status(201).json({
				message: `Movie ${title} succesfully added to the collection`,
			});
		} catch (error) {
			res.status(400).json({
				message: error.message,
			});
		}
	};

	addMovie(title, userInfo);
};

exports.deleteMovie = (req, res, next) => {
	const title = req.params.title;
	const deleteMovie = async (title) => {
		let deleteResult;
		try {
			deleteResult = await MoviesService.deleteMovie(title);
			if (deleteResult === null) {
				res.status(404).json({ message: 'Movie not found in the collection' });
			} else {
				res.status(200).json({
					message: 'Movie deleted successfully',
				});
			}
		} catch (error) {
			res.status(400).json({
				message: error.message,
			});
		}
	};

	deleteMovie(title);
};
