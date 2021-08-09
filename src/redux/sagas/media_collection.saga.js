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

  function* mediaCollectionSaga() {
    yield takeEvery('GET_COLLECTION', getMediaCollection);
    yield takeEvery('ADD_MEDIA_ITEM', addNewMediaItem);

  };

  export default mediaCollectionSaga;