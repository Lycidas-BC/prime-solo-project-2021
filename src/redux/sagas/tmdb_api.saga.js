import axios from 'axios';
import { put, takeEvery } from 'redux-saga/effects';


function* searchTmdb(action) {
    try {
      const searchResults = yield axios.post(`/api/tmdb/search`, action.payload);
      console.log(searchResults);
      yield put({ type: 'SET_TMDB_SEARCH', payload: searchResults.data });
    }
    catch (error) {
      console.log('Error in searchTmdb:', error);
    };
  };

  function* tmdbSaga() {
    yield takeEvery('API_SEARCH', searchTmdb);
  };

  export default tmdbSaga;