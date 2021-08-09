const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const tmdbRouter = require('./routes/tmdb_api.router.js');
const webScraperRouter = require('./routes/web_scraper.router.js');
const mediaCollectionRouter = require('./routes/media_collection.router');

const app = express();

const sessionMiddleware = require('./modules/session-middleware');
const passport = require('./strategies/user.strategy');

// Route includes
const userRouter = require('./routes/user.router');

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Passport Session Configuration //
app.use(sessionMiddleware);

// start up passport sessions
app.use(passport.initialize());
app.use(passport.session());

/* Routes */
app.use('/api/user', userRouter);
app.use('/api/tmdb', tmdbRouter);
app.use('/web_scraper', webScraperRouter);
app.use('/media_collection', mediaCollectionRouter);

// Serve static files
app.use(express.static('build'));

// App Set //
const PORT = process.env.PORT || 5000;

/** Listen * */
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
