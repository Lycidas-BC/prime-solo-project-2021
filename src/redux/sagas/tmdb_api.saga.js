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

function* searchTmdb(action) {
    try {
      console.log('in searchTMDB saga', action.payload);
      const searchResults = yield axios.post(`/api/tmdb/search`, action.payload);
      yield put({ type: 'SET_TMDB_SEARCH', payload: searchResults.data });
    }
    catch (error) {
      console.log('Error in searchTmdb:', error);
    };
  };

  function* tmdbSaga() {
    yield takeEvery('INITIALIZE_TMDB', getTmdbConfiguration);
    yield takeEvery('API_SEARCH', searchTmdb);
    // yield takeEvery('API_SEARCH', searchTmdb);
    // yield takeEvery('API_SEARCH', searchTmdb);

  };

  export default tmdbSaga;