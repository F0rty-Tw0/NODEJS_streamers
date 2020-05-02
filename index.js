// CRUD                               // REST - (Pattern of defining the routes, way of mapping http routes)
// C - Create                         // RE   - Representational
// R - Read                           // S    - State
// U - Update                         // T    - Transfer
// D - Destroy


//Adding dependancies
const express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    flash = require("connect-flash"),
    passport = require("passport"),
    LocalStrategy = require("passport-local").Strategy,
    methodOverride = require("method-override"),
    User = require("./models/user"),
    seedDB = require("./seeds");

//Routes files locations
const commentRoutes = require("./routes/comments"),
    streamersRoutes = require("./routes/streamers"),
    authRoutes = require("./routes/index");

//Connect our Database
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.DATABASEURL);

console.dir(process.env.DATABASE_URL)
//Check if We have our Database connected
mongoose.connection.on("connected", function () {c
    console.log("Database is connected");
});

//Using method ovveride
app.use(flash());

//Using method ovveride
app.use(methodOverride("_method"));

//Using a body parser
app.use(bodyParser.urlencoded({ extended: true }));

//Setting the view engine to read .ejs files
app.set("view engine", "ejs");

//Adding the main directory of our CSS (serving everything in that directory)
app.use(express.static(__dirname + "/public"));

//Seeding our Database
seedDB();

//Passport Configuration
app.use(require("express-session")({
    secret: "*This can be any text to make secret work*",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

//This function is called on every single Route and shows the current User
app.use((request, response, next) => {
    response.locals.currentUser = request.user;
    response.locals.error = request.flash("error");
    response.locals.success = request.flash("success");
    next();
});

//Using the routes files and shortening the route declaration "/link"
app.use("/", authRoutes);
app.use("/streamers/:id/comments", commentRoutes);
app.use("/streamers", streamersRoutes);

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


























//Starting the server on Port 3000
app.listen(process.env.PORT || 3000, process.env.IP, () => {
    console.log("Our Secret Project Has Started!");
});