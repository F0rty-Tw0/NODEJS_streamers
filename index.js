// CRUD                               // REST - (Pattern of defining the routes, way of mapping http routes)
// C - Create                         // RE   - Representational
// R - Read                           // S    - State
// U - Update                         // T    - Transfer
// D - Destroy

//Adding dependancies
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const methodOverride = require('method-override');
const User = require('./models/user');
// const seedDB = require('./seeds');

// https://api.twitch.tv/kraken/channels/29795919/follows?client_id=oym42p4eo4jn7i5si30e3trllf3vb0&api_version=5

//Requiring Dotenv
require('dotenv').config();

//Routes files locations
const commentRoutes = require('./routes/comments');
const streamersRoutes = require('./routes/streamers');
const authRoutes = require('./routes/index');

//Connect our Database
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

// mongoose.connect(process.env.DATABASEURL);
mongoose.connect(process.env.DATABASE_URL);

//Check if We have our Database connected
mongoose.connection.on('connected', function() {
	console.log('Database is connected');
});

//Using method ovveride
app.use(flash());

//Using method ovveride
app.use(methodOverride('_method'));

//Using a body parser
app.use(bodyParser.urlencoded({ extended: true }));

//Setting the view engine to read .ejs files
app.set('view engine', 'ejs');

//Adding the main directory of our CSS (serving everything in that directory)
app.use(express.static(__dirname + '/public'));

//Seeding our Database
// seedDB();

//Passport Configuration
app.use(
	require('express-session')({
		secret: process.env.SECRET,
		resave: false,
		saveUninitialized: false
	})
);
app.use(passport.initialize());
app.use(passport.session());

//This function is called on every single Route and shows the current User
app.use((request, response, next) => {
	response.locals.currentUser = request.user;
	response.locals.error = request.flash('error');
	response.locals.success = request.flash('success');
	next();
});

//Using the routes files and shortening the route declaration "/link"
app.use('/', authRoutes);
app.use('/streamers', streamersRoutes);
app.use('/streamers/:slug/comments', commentRoutes);

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Starting the server on Port 3000
app.listen(process.env.PORT, process.env.IP, () => {
	console.log('Our Secret Project Has Started!');
});
