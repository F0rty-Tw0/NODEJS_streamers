const mongoose = require("mongoose"),
    Streamer = require("./models/streamer"),
    Comment = require("./models/comment"),
    seeds = [
        {
            name: "Kripparian",
            logo: "https://static-cdn.jtvnw.net/jtv_user_pictures/401068e0-820a-4d9f-9e7c-1e5563398458-profile_image-300x300.png",
            description: 'Octavian Morosan (born June 30, 1987) better known by his online username Kripparrian, is a Romanian-Canadian Twitch streamer, YouTuber and Video game personality. He is known for his achievements on Diablo III, World of Warcraft and Hearthstone, winning the "Favorite Hearthstone Stream" and Most "Engaged" Viewers categories, and coming second in the "Highest Stream View Average" category at the Blizzard Stream Awards in 2014. In June 2017 he achieved over one million followers on Twitch and as of December 2019, he is sitting at over 1.3 million followers.',
            author: {
                id: "588c2e092403d111454fff76",
                username: "Jack"
            }
        },
        {
            name: "Ninja",
            logo: "https://static-cdn.jtvnw.net/jtv_user_pictures/cef31105-8a6e-4211-a74b-2f0bbd9791fb-profile_image-300x300.png",
            description: 'Richard Tyler Blevins (born June 5, 1991), better known by his online alias Ninja, is an American streamer, YouTuber, professional gamer, and Internet personality. Blevins had gotten his start into streaming through participating in several esports teams in competitive play for Halo 3, but his popularity started to increase when he and a lot of other streamers began playing Fortnite Battle Royale in October 2017; and when Fortnite blew up into the mainstream in early 2018, Blevins popularity took off. Blevins increase in popularity fed back to help make Fortnite more popular. Prior to retiring his Twitch profile of streaming in favor of Mixer on August 1, 2019, Blevins had over 14 million followers and was the most-followed active Twitch channel.',
            author: {
                id: "588c2e092403d111454fff71",
                username: "Jill"
            }
        },
        {
            name: "Nugiyen",
            logo: "https://static-cdn.jtvnw.net/jtv_user_pictures/abfc65fb53b0c44d-profile_image-300x300.png",
            description: 'Dan has been gaming for the last 25years, and started out playing Diablo at his local library. He has played pretty much everything from CS & Quake to WoW, Diablo and now Path of Exile. He is a perfectionist and strives to be the best in every game he plays.',
            author: {
                id: "588c2e092403d111454fff77",
                username: "Jane"
            }
        }
    ];

async function seedDB() {
    try {
        //Removing all the Streamers
        await Streamer.deleteMany({});
        console.log("Removed all the Streamers");
        //Removing all Comments
        await Comment.deleteMany({});
        console.log("Removed all the Comments");

        for (const seed of seeds) {
            //Add few streamers
            let streamer = await Streamer.create(seed);
            console.log("Streamer Created");
            //Create a comment
            let comment = await Comment.create(
                {
                    text: "One of my favorite streamers",
                    author: {
                        id: "588c2e092403d111454fff76",
                        username: "Art"
                    }
                }
            );
            console.log("Comment Created");
            streamer.comments.push(comment);
            streamer.save();
            console.log("Comment added to a Streamer");
        };
    } catch (error) {
        console.log(error);
    };
};

module.exports = seedDB;


console.log("Removed all the Streamers");