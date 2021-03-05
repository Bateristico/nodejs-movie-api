const express = require('express');
const { body } = require('express-validator');

const movieController = require('../controllers/movies.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// GET (all movies)
router.get('/movies', authMiddleware, movieController.getMovies);

// GET (single movie)
router.get('/movie/:title', authMiddleware, movieController.getMovie);

// POST (create movie)
router.post(
	'/movies',
	authMiddleware,
	[body('title').trim().isLength({ min: 3 })],
	movieController.postMovie
);

// DELETE (delete movie)
router.delete(
	'/movie/:title',
	[body('title').trim().isLength({ min: 3 })],
	authMiddleware,
	movieController.deleteMovie
);

module.exports = router;
