import { combineReducers } from 'redux';
import errors from './errors.reducer';
import user from './user.reducer';
import tmdbSearchReducer from './tmdb_search.reducer';
import tmdbConfigReducer from './tmdb_config.reducer';
import tmdbMovieDetailsReducer from './tmdb_movie_details.reducer';
import tmdbStreamingOptionsReducer from './tmdb_streaming_options.reducer';
import webScrapeReducer from './web_scrape.reducer';
import mediaCollectionReducer from './media_collection.reducer';
import mediaItemReducer from './media_item.reducer';


// rootReducer is the primary reducer for our entire project
// It bundles up all of the other reducers so our project can use them.
// This is imported in index.js as rootSaga

// Lets make a bigger object for our store, with the objects from our reducers.
// This is what we get when we use 'state' inside of 'mapStateToProps'
const rootReducer = combineReducers({
  errors, // contains registrationMessage and loginMessage
  user, // will have an id and username if someone is logged in
  tmdbSearchReducer, // search results from tmdb api
  tmdbConfigReducer, // tmdb config
  tmdbMovieDetailsReducer, //tmdb movie details
  tmdbStreamingOptionsReducer, //tmdb movie streaming options
  webScrapeReducer, //web scrape reducer
  mediaCollectionReducer, //media collection reducer
  mediaItemReducer, //media item reducer
});

export default rootReducer;
