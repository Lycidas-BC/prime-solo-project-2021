import { combineReducers } from "redux";
import errors from "./errors.reducer";
import user from "./user.reducer";
import tmdbSearchReducer from "./tmdb_search.reducer";
import tmdbConfigReducer from "./tmdb_config.reducer";
import tmdbDetailsReducer from "./tmdb_details.reducer";
import tmdbStreamingOptionsReducer from "./tmdb_streaming_options.reducer";
import mediaItem from "./media_item.reducer";
import mediaCollectionReducer from "./media_collection.reducer";
import mediaItemDetailsReducer from "./media_item_details.reducer";
import itemInCollection from "./item_in_collection.reducer";
import movieFramegrabs from "./movie_framegrab.reducer";

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
  tmdbDetailsReducer, //tmdb details
  tmdbStreamingOptionsReducer, //tmdb movie streaming options
  mediaItem, //web scrape reducer
  mediaCollectionReducer, //media collection reducer
  mediaItemDetailsReducer, //media item reducer
  itemInCollection, //item in collection reducer
  movieFramegrabs, //movie framegrabs reducer
});

export default rootReducer;
