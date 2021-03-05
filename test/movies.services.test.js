const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const { DB_TEST_URI } = process.env;

const Movie = require('../src/models/movie.model');
const MovieServices = require('../src/services/movies.services');

describe('# Movie Services', function () {
	// connect to the database for integration tests
	before(function (done) {
		mongoose
			.connect(DB_TEST_URI, {
				useNewUrlParser: true,
				useUnifiedTopology: true,
				useCreateIndex: true,
			})
			.then((result) => {
				// dummy movie
				const movie = new Movie({
					title: 'test movie',
					released: '01 Mar 1993',
					genre: 'fantasy',
					director: 'test director',
					creator: { id: 321, name: 'tester user', role: 'tester' },
				});

				return movie.save();
			})
			.then(() => {
				done();
			})
			.catch((error) => {
				console.log(error);
			});
	});

	it('Should create a movie in the database', function (done) {
		const title = '12 Angry Men';
		const userInfo = {
			userId: 434,
			name: 'Premium Jim',
			role: 'premium',
			iat: 1614631899,
			iss: 'https://www.netguru.com/',
			sub: '434',
		};

		MovieServices.saveMovie(title, userInfo)
			.then((movieSaved) => {
				//console.log(movieSaved);
				expect(movieSaved).to.have.property('title');
				expect(movieSaved.title).to.be.equal('12 angry men');
				expect(movieSaved.creator.id).to.be.equal(434);
				expect(movieSaved.creator.name).to.be.equal('Premium Jim');
				expect(movieSaved.creator.role).to.be.equal('premium');
				done();
			})
			.catch((error) => {
				console.log(error);
			});
	});

	it('Should delete a movie from the database', function (done) {
		const title = '12 angry Men';
		MovieServices.deleteMovie(title).then((deletedMovie) => {
			//console.log(deletedMovie);
			expect(deletedMovie).to.have.property('title', '12 angry men');
			expect(deletedMovie).to.have.property('released', '10 Apr 1957');
			expect(deletedMovie).to.have.property('genre', 'crime, drama');
			expect(deletedMovie).to.have.property('director', 'sidney lumet');
			done();
		});
	});

	it('Should throw an error if movie title is not given', function (done) {
		MovieServices.deleteMovie().then((result) => {
			//console.log(result);
			expect(result).to.be.an('error', 'Error: Movie not specified');
			done();
		});
	});

	it('Should throw an error if there is no movie title in the request ', function (done) {
		MovieServices.getMovie().then((result) => {
			//console.log(result);
			expect(result).to.be.an('error', 'Error: Movie not specified');
			done();
		});
	});

	it('Should find the movie one the database and return the information', function (done) {
		const title = 'test movie';
		MovieServices.getMovie(title).then((movieSaved) => {
			//console.log(movieSaved);
			expect(movieSaved).to.have.property('title', 'test movie');
			expect(movieSaved).to.have.property('released', '01 Mar 1993');
			expect(movieSaved).to.have.property('genre', 'fantasy');
			expect(movieSaved).to.have.property('director');
			done();
		});
	});

	it('Should return a collection of movies', function (done) {
		MovieServices.getMovies().then((resultMovies) => {
			//console.log(resultMovies[0]);
			expect(resultMovies).to.be.an('Array');
			expect(resultMovies[0]).to.have.property('title');
			expect(resultMovies[0]).to.have.property('genre');
			done();
		});
	});

	// clears the database and closes the db connection
	after(function (done) {
		Movie.deleteMany({})
			.then(() => {
				return mongoose.disconnect();
			})
			.then(() => {
				done();
			});
	});
});
