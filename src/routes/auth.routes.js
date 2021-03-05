const express = require('express');
const { body } = require('express-validator');

const authController = require('../controllers/auth.controller');

const router = express.Router();

// POST endpoint (use netguru auth service)
router.post(
	'/auth/login',
	[
		body('username').trim().isLength({ min: 1 }),
		body('password').trim().isLength({ min: 1 }),
	],
	authController.login
);

module.exports = router;
