//Adding dependancies
const express = require("express"),
    Streamer = require("../models/streamer"),
    Comment = require("../models/comment"),
    middleware = require("../middleware"),
    router = express.Router({ mergeParams: true });

//Comments Routes
router.get("/new", middleware.isLoggedIn, (request, response) => {
    //Find Streamer by id
    Streamer.findById(request.params.id, (error, streamer) => {
        if (error || !streamer) {
            request.flash("error", "Streamer not found!");
            return response.redirect("/streamers");
        } else {
            response.render("comments/new", { streamer: streamer });
        };
    });
});

//Comments POST Route
router.post("/", middleware.isLoggedIn, (request, response) => {
    //Lookup for Streamer using ID
    Streamer.findById(request.params.id, (error, streamer) => {
        if (error) {
            console.log(error);
            response.redirect("/streamers");
        } else {
            //Create new Comment
            Comment.create(request.body.comment, (error, comment) => {
                if (error) {
                    request.flash("error", "Something went wrong!")
                } else {
                    //Add Username and ID to the Comment and saving it
                    comment.author.id = request.user._id;
                    comment.author.username = request.user.username;
                    comment.save();
                    //Connect new Comment to the Streamer
                    streamer.comments.push(comment);
                    streamer.save();
                    //Redirect to Streamer show page
                    request.flash("success", "Successfully added your comment.");
                    response.redirect("/streamers/" + request.params.id );
                };
            });
        };
    });
});

//Edit Comments Route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (request, response) => {
    //We check if streamer exists
    Streamer.findById(request.params.id, (error, foundStreamer) => {
        if (error || !foundStreamer) {
            request.flash("error", "Influencer not found!");
            return response.redirect("/streamers");
        };
        //If it exists, we proceed with the comment
        Comment.findById(request.params.comment_id, (error, foundComment) => {
            if (error) {
                response.redirect("back");
            } else {
                response.render("comments/edit", { streamer_id: request.params.id, comment: foundComment });
            };
        });
    });
});

//Update Comments Route
router.put("/:comment_id", middleware.checkCommentOwnership, (request, response) => {
    Comment.findByIdAndUpdate(request.params.comment_id, request.body.comment, (error, updatedComment) => {
        if (error) {
            response.redirect("back");
        } else {
            response.redirect("/streamers/" + request.params.id);
        };
    });
});

//Delete Comments Route
router.delete("/:comment_id", middleware.checkCommentOwnership, (request, response) => {
    //Find by ID and remove
    Comment.findByIdAndRemove(request.params.comment_id, (error) => {
        if (error) {
            response.redirect("back");
        } else {
            request.flash("success", "Comment deleted!");
            response.redirect("/streamers/" + request.params.id);
        };
    });
});

//We declare that we have to export router
module.exports = router;