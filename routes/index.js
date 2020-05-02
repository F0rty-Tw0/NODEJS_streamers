//Adding dependancies
const express = require("express"),
    passport = require("passport"),
    User = require("../models/user"),
    router = express.Router();

//Rendering Index page
router.get("/", (request, response) => {
    response.render("index");
});

//Auth Routes

//Show the Register form
router.get("/register", (request, response) => {
    response.render("register");
});

//Route to handle Sign Up logic
router.post("/register", (request, response) => {
    const newUser = new User({ username: request.body.username });
    //We dont save the password to database, but instead we save the #Hash of that password encoded
    User.register(newUser, request.body.password, (error, user) => {
        if (error) {
            request.flash("error", error.message);
            return response.redirect("/register");
        };
        //Logs the user in and cares everything in the session. Can be modifed to "facebook", "twitter"
        passport.authenticate("local")(request, response, () => {
            request.flash("success", "Welcome to our Influencers page " + user.username);
            response.redirect("/streamers");
        });
    });
});

//Show the Login form
router.get("/login", (request, response) => {
    response.render("login");
});

//Handeling Login logic (Middleware)
//Checks your credentials and compares it to the login and #Hashed password
router.post("/login", passport.authenticate("local", {
    successRedirect: "/streamers",
    failureRedirect: "/login"
}), (request, response) => {
});

//Logout Route Logic
router.get("/logout", (request, response) => {
    request.logout();
    request.flash("success", "You are logged out.");
    response.redirect("/streamers");
});

//We declare that we have to export router
module.exports = router;