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
    const mediaItemDetails = yield axios.get(`/media_collection/media_details/${action.payload.mediaId}`);
    console.log("mediaItemDetails:", mediaItemDetails);
    yield put({ type: 'SET_MEDIA_ITEM_DETAILS', payload: mediaItemDetails.data });
  }
  catch (error) {
    console.log('Error in getMediaItemDetails:', error);
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
    console.log('Error in addNewMediaItem:', error);
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
    console.log('Error in addNewMediaItem:', error);
  };
};

  function* mediaCollectionSaga() {
    yield takeEvery('GET_COLLECTION', getMediaCollection);
    yield takeEvery('ADD_MEDIA_ITEM', addNewMediaItem);
    yield takeEvery('UPDATE_MEDIA_ITEM', updateMediaItem);
    yield takeEvery('DELETE_MEDIA_ITEM', deleteMediaItem);
    yield takeEvery('GET_MEDIA_ITEM_DETAILS', getMediaItemDetails);
  };

  export default mediaCollectionSaga;