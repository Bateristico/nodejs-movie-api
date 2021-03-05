const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const movieSchema = new Schema(
	{
		title: {
			type: String,
			required: [true, 'Please enter the movie title'],
			unique: true,
			lowercase: true,
			minlength: [3, 'Movie name must be larger than 3 characters'],
		},
		released: {
			type: String,
			required: true,
		},
		genre: {
			type: String,
			required: true,
			lowercase: true,
		},
		director: {
			type: String,
			required: true,
			lowercase: true,
		},
		creator: {
			type: Object,
			required: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Movie', movieSchema);
