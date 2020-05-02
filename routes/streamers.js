//Adding dependancies
const express = require("express"),
    Streamer = require("../models/streamer"),
    Comment = require("../models/comment"),
    middleware = require("../middleware"),
    router = express.Router();

//Rendering Streamers page
router.get("/", (request, response) => {
    //Getting all the streamers from Database
    Streamer.find({}, (error, allStreamers) => {
        if (error) {
            console.log(error);
        } else {
            //Renders all the streamers and also contains the information of currently loged user
            response.render("streamers/streamers", { streamers: allStreamers });
        };
    });
});

//Making a RESTful convention
router.get("/new", middleware.isLoggedIn, (request, response) => {
    response.render("streamers/new");
});

//Posting Data from an input to our Streamers page
router.post("/", middleware.isLoggedIn, (request, response) => {
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
            response.redirect("/streamers");
        };
    });
});

//Showing the Streamer individually with more info
router.get("/:id", (request, response) => {
    //Find the Streamer with provided ID
    Streamer.findById(request.params.id).populate("comments").exec((error, foundStreamer) => {
        if (error) {
            console.log(error);
        } else {
            //Render show the template with that Streamer
            response.render("streamers/show", { streamer: foundStreamer });
        };
    });
});

//Edit Streamer Route
router.get("/:id/edit", middleware.checkStreamerOwnership, (request, response) => {
    Streamer.findById(request.params.id, (error, foundStreamer) => {
        response.render("streamers/edit", { streamer: foundStreamer });
    });
});

//Update Streamer Route
router.put("/:id", middleware.checkStreamerOwnership, (request, response) => {
    //Find and update the correct Streamer
    Streamer.findByIdAndUpdate(request.params.id, request.body.streamer, (error, updatedStreamer) => {
        if (error) {
            response.redirect("/streamers");
        } else {
            //Redirect back to the Show Page
            response.redirect("/streamers/" + request.params.id);
        };
    });
});

//Destroy Streamer Route
router.delete("/:id", middleware.checkStreamerOwnership, (request, response, next) => {
    Streamer.findById(request.params.id, (error, streamer) => {
        //Removing the comments associated with that Streamer
        Comment.deleteMany({
            "_id": {
                $in: streamer.comments
            }
        }, (error) => {
            if (error) return next(error);
            request.flash("success", "Streamer deleted!");
            streamer.remove();
            response.redirect("/streamers");
        });
    });
});


//We declare that we have to export router
module.exports = router;