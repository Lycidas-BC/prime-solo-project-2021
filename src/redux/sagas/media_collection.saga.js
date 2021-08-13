import axios from 'axios';
import { put, takeEvery } from 'redux-saga/effects';

function* getMediaCollection() {
  try {
    const mediaCollection = yield axios.get(`/media_collection`);
    console.log("mediaCollection:", mediaCollection);
    yield put({ type: 'SET_COLLECTION', payload: mediaCollection.data });
  }
  catch (error) {
    console.log('Error in getMediaCollection:', error);
  };
};

function* getMediaItemDetails(action) {
  try {
    let mediaItemDetails = {};
    const apiMovieData = [];
    const mediaDetails = yield axios.get(`/media_collection/${action.payload.mediaId}`);
    mediaItemDetails.mediaDetails = mediaDetails.data[0];
    const sqlMovieData = yield axios.get(`/media_collection/media_movies/${action.payload.mediaId}`);
    for (const movie of sqlMovieData.data) {
      const apiResponse = yield axios.get(`/api/tmdb/details/${encodeURIComponent(movie.tmdb_id)}/?searchType=${encodeURIComponent(movie.tv_show ? "tv" : "movie")}`);
      apiMovieData.push(apiResponse.data);
    }
    mediaItemDetails.sqlMovieData = sqlMovieData.data;
    mediaItemDetails.apiMovieData = apiMovieData;
    const mediaSpecialFeatures = yield axios.get(`/media_collection/media_specialfeatures/${action.payload.mediaId}`);
    mediaItemDetails.mediaSpecialFeatures = mediaSpecialFeatures.data;

    yield put({ type: 'SET_MEDIA_ITEM_DETAILS', payload: mediaItemDetails });
  }
  catch (error) {
    console.log('Error in getMediaItemDetails:', error);
  };
};
///searchCollection/:tmdbId - not sure if I still need this
function* searchMediaCollection(action) {
  try {
    const mediaIdList = yield axios.get(`/media_collection/searchCollection/${action.payload.tmdbId}`);
    yield put({ type: 'ITEM_IN_COLLECTION', payload: mediaIdList.data });
  }
  catch (error) {
    console.log('Error in searchMediaCollection:', error);
  };
};

function* addNewMediaItem(action) {
  try {
    const newItemResponse = yield axios.post(`/media_collection/media`, action.payload);
    console.log("newItemResponse:", newItemResponse);
    let newItemId = newItemResponse.data.newMediaId;
    yield axios.post(`/media_collection/movie/${newItemId}`, action.payload);
    yield axios.post(`/media_collection/specialfeature/${newItemId}`, action.payload);
    yield put({ type: 'GET_COLLECTION' });
  }
  catch (error) {
    console.log('Error in addNewMediaItem:', error);
  };
};

function* deleteMediaItem(action) {
  try {
    yield axios.delete(`/media_collection/${action.payload.media_id}`);
    yield put({ type: 'GET_COLLECTION' });
  }
  catch (error) {
    console.log('Error in deleteMediaItem:', error);
  };
};

function* updateMediaItem(action) {
  try {
    const newItemResponse = yield axios.post(`/media_collection/media`, action.payload);
    console.log("newItemResponse:", newItemResponse);
    let newItemId = newItemResponse.data.newMediaId;
    yield axios.post(`/media_collection/movie/${newItemId}`, action.payload);
    yield axios.post(`/media_collection/specialfeature/${newItemId}`, action.payload);
    yield put({ type: 'GET_COLLECTION' });
  }
  catch (error) {
    console.log('Error in updateMediaItem:', error);
  };
};

  function* mediaCollectionSaga() {
    yield takeEvery('GET_COLLECTION', getMediaCollection);
    yield takeEvery('SEARCH_COLLECTION', searchMediaCollection);
    yield takeEvery('ADD_MEDIA_ITEM', addNewMediaItem);
    yield takeEvery('UPDATE_MEDIA_ITEM', updateMediaItem);
    yield takeEvery('DELETE_MEDIA_ITEM', deleteMediaItem);
    yield takeEvery('GET_MEDIA_ITEM_DETAILS', getMediaItemDetails);
  };

  export default mediaCollectionSaga;