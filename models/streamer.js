const mongoose = require('mongoose'),
	Comment = require('./comment');

//Streamer Schema setup
const streamerSchema = new mongoose.Schema({
	name: {
		type: String,
		required: 'Streamer name cannot be blank.'
	},
	logo: String,
	description: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		},
		username: String
	},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Comment'
		}
	],
	slug: {
		type: String,
		unique: true
	}
});

streamerSchema.pre('remove', async (next) => {
	try {
		//Removing the comments associated with that Streamer
		await Comment.deleteMany({
			_id: {
				$in: this.comments
			}
		});
		next();
	} catch (error) {
		next(error);
	}
});

//Adding a slug before the streamer gets saved to the database
streamerSchema.pre('save', async function(next) {
	try {
		//Check if a new streamer is being saved, or if the streamer name is being modified
		if (this.isNew || this.isModified('name')) {
			this.slug = await generateUniqueSlug(this._id, this.name);
		}
		next();
	} catch (error) {
		next(error);
	}
});

var Streamer = mongoose.model('Streamer', streamerSchema);
module.exports = Streamer;

//Generating a unique slug based on the streamer name
async function generateUniqueSlug(id, streamerName, slug) {
	try {
		//Generate the initial slug
		if (!slug) {
			slug = slugify(streamerName);
		}
		//Check if a streamer with the slug already exists
		var streamer = await Streamer.findOne({ slug: slug });
		//Check if a streamer was found or if the found streamer is the current streamer
		if (!streamer || streamer._id.equals(id)) {
			return slug;
		}
		//If not unique, generate a new slug
		var newSlug = slugify(streamerName);
		//Check again by calling the function recursively
		return await generateUniqueSlug(id, streamerName, newSlug);
	} catch (error) {
		throw new Error(error);
	}
}

function slugify(text) {
	var slug = text
		.toString()
		.toLowerCase()
		.replace(/\s+/g, '-') //Replace spaces with -
		.replace(/[^\w\-]+/g, '') //Remove all non-word chars
		.replace(/\-\-+/g, '-') //Replace multiple - with single -
		.replace(/^-+/, '') //Trim - from start of text
		.replace(/-+$/, '') //Trim - from end of text
		.substring(0, 75); //Trim at 75 characters
	return slug + '-' + Math.floor(1000 + Math.random() * 9000); //Add 4 random digits to improve uniqueness
}
