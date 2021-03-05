const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

const { DB_URI, PORT } = process.env;

const movieRoutes = require('./routes/movies.routes');
const authRoutes = require('./routes/auth.routes');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// set headers
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader(
		'Access-Control-Allow-Methods',
		'OPTIONS, GET, POST, PUT, PATCH, DELETE'
	);
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	next();
});

app.use(movieRoutes);
app.use(authRoutes);

// custom error
app.use((error, req, res, next) => {
	const statusCode = error.statusCode || 400;
	const message = error.message;
	res.status(statusCode).json({ message });
});

// database connection
mongoose
	.connect(DB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	})
	.then((result) =>
		app.listen(PORT, () => {
			console.log(`server running at port: ${PORT}`);
		})
	)
	.catch((err) => console.log(err));
