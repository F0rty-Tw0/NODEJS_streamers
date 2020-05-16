//Adding dependancies
const express = require('express'),
	Streamer = require('../models/streamer'),
	Comment = require('../models/comment'),
	middleware = require('../middleware'),
	router = express.Router();

//Rendering Streamers page
router.get('/', (request, response) => {
	var perPage = 8;
	var pageQuery = parseInt(request.query.page);
	var pageNumber = pageQuery ? pageQuery : 1;
	if (request.query.search) {
		const regex = new RegExp(escapeRegex(request.query.search), 'gi');
		//Getting all the streamers from Database
		Streamer.find({ name: regex })
			.skip(perPage * pageNumber - perPage)
			.limit(perPage)
			.exec((error, allStreamers) => {
				Streamer.countDocuments({ name: regex }).exec((error, count) => {
					if (error) {
						console.log(error);
						response.redirect('/streamers');
					} else {
						if (allStreamers.length < 1) {
							request.flash('error', 'No streamer found from your search');
							return response.redirect('/streamers');
						}
						//Renders all the streamers and also contains the information of currently loged user
						response.render('streamers/streamers', {
							streamers: allStreamers,
							current: pageNumber,
							pages: Math.ceil(count / perPage),
							search: request.query.search
						});
					}
				});
			});
	} else {
		//Getting all the streamers from Database
		Streamer.find({}).skip(perPage * pageNumber - perPage).limit(perPage).exec((error, allStreamers) => {
			Streamer.countDocuments().exec((error, count) => {
				if (error) {
					console.log(error);
				} else {
					//Renders all the streamers and also contains the information of currently loged user
					response.render('streamers/streamers', {
						streamers: allStreamers,
						current: pageNumber,
						pages: Math.ceil(count / perPage),
						search: false
					});
				}
			});
		});
	}
});

//Making a RESTful convention
router.get('/new', middleware.isLoggedIn, (request, response) => {
	response.render('streamers/new');
});

//Posting Data from an input to our Streamers page
router.post('/', middleware.isLoggedIn, (request, response) => {
	//Get data from a form and add it to streamers array
	const name = request.body.name;
	const logo = request.body.logo;
	const desc = request.body.description;
	const author = {
		id: request.user._id,
		username: request.user.username
	};
	const newStreamer = { name: name, logo: logo, description: desc, author: author };
	//Create a new Streamer and save it to Database
	Streamer.create(newStreamer, (error, newlyCreatedStreamer) => {
		if (error) {
			console.log(error);
		} else {
			//Redirect back to the Streamers page
			response.redirect('/streamers');
		}
	});
});

//Showing the Streamer individually with more info
router.get('/:slug', (request, response) => {
	//Find the Streamer with provided ID
	Streamer.findOne({ slug: request.params.slug }).populate('comments').exec((error, foundStreamer) => {
		if (error || !foundStreamer) {
			request.flash('error', 'Influencer not found!');
			response.redirect('/streamers');
		} else {
			//Render show the template with that Streamer
			response.render('streamers/show', { streamer: foundStreamer });
		}
	});
});

//Edit Streamer Route
router.get('/:slug/edit', middleware.checkStreamerOwnership, (request, response) => {
	Streamer.findOne({ slug: request.params.slug }, (error, foundStreamer) => {
		if (error) {
			console.log(error);
		}
		response.render('streamers/edit', { streamer: foundStreamer });
	});
});

//Update Streamer Route
router.put('/:slug', middleware.checkStreamerOwnership, (request, response) => {
	//Find and update the correct Streamer
	Streamer.findOne({ slug: request.params.slug }, (error, streamer) => {
		if (error) {
			response.redirect('/streamers');
		} else {
			streamer.name = request.body.streamer.name;
			streamer.description = request.body.streamer.description;
			streamer.logo = request.body.streamer.logo;
			streamer.save(function(error) {
				if (error) {
					console.log(error);
					res.redirect('/streamers');
				} else {
					//Redirect back to the Show Page
					response.redirect('/streamers/' + streamer.slug);
				}
			});
		}
	});
});

//Destroy Streamer Route
router.delete('/:slug', middleware.checkStreamerOwnership, (request, response, next) => {
	Streamer.findOne({ slug: request.params.slug }, (error, streamer) => {
		//Removing the comments associated with that Streamer
		Comment.deleteMany(
			{
				_id: {
					$in: streamer.comments
				}
			},
			(error) => {
				if (error) return next(error);
				request.flash('success', 'Streamer deleted!');
				streamer.remove();
				response.redirect('/streamers');
			}
		);
	});
});

//Making a fuzzy search
function escapeRegex(text) {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

//We declare that we have to export router
module.exports = router;
