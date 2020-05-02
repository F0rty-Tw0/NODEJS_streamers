const mongoose = require("mongoose"),
    Comment = require("./comment");

//Streamer Schema setup
const streamerSchema = new mongoose.Schema({
    name: String,
    logo: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

streamerSchema.pre("remove", async (next) => {
    try {
        //Removing the comments associated with that Streamer
        await Comment.deleteMany({
            "_id": {
                $in: this.comments
            }
        });
        next();
    } catch (error) {
        next(error);
    };
});

module.exports = mongoose.model("Streamer", streamerSchema);
