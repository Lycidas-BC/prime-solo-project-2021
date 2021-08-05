import axios from 'axios';
import { put, takeEvery } from 'redux-saga/effects';

function* getTmdbConfiguration() {
  try {
    const tmdbConfig = yield axios.get(`/api/tmdb/configuration`);
    console.log("tmdbConfig:", tmdbConfig);
    yield put({ type: 'SET_TMDB_CONFIG', payload: tmdbConfig.data });
  }
  catch (error) {
    console.log('Error in getTmdbConfiguration:', error);
  };
};

function* getTmdbMovieDetails(action) {
  try {
    const movieDetails = yield axios.get(`/api/tmdb/movieDetails/${action.payload}/?tvOrMovie=${encodeURIComponent(action.payload.tvOrMovie)}`);
    console.log("movieDetails:", movieDetails);
    yield put({ type: 'SET_TMDB_MOVIE_DETAILS', payload: movieDetails.data });
  }
  catch (error) {
    console.log('Error in getTmdbMovieDetails:', error);
  };
};

function* getTmdbStreamingOptions(action) {
  try {
    const streamingOptions = yield axios.get(`/api/tmdb/streamingOptions/${action.payload.id}/?tvOrMovie=${encodeURIComponent(action.payload.tvOrMovie)}`);
    console.log("streamingOptions:", streamingOptions);
    yield put({ type: 'SET_TMDB_STREAMING_OPTIONS', payload: streamingOptions.data });
  }
  catch (error) {
    console.log('Error in getTmdbStreamingOptions:', error);
  };
};

function* searchTmdb(action) {
    try {
      console.log('in searchTMDB saga', action.payload);
      const searchResults = yield axios.get(`/api/tmdb/search/?type=${encodeURIComponent(action.payload.type)}&q=${encodeURIComponent(action.payload.query)}&page=${encodeURIComponent(action.payload.page)}`);
      yield put({ type: 'SET_TMDB_SEARCH', payload: searchResults.data });
    }
    catch (error) {
      console.log('Error in searchTmdb:', error);
    };
  };

  function* tmdbSaga() {
    yield takeEvery('INITIALIZE_TMDB', getTmdbConfiguration);
    yield takeEvery('API_SEARCH', searchTmdb);
    yield takeEvery('API_MOVIE_DETAILS', getTmdbMovieDetails);
    yield takeEvery('API_STREAMING_OPTIONS', getTmdbStreamingOptions);

  };

  export default tmdbSaga;