import axios from 'axios';
import { put, takeEvery } from 'redux-saga/effects';

function* testWebScrape() {
  try {
    const scrape = yield axios.get(`/web_scraper/test`);
    console.log("scrape:", scrape);
    yield put({ type: 'SET_WEB_SCRAPE', payload: scrape });
  }
  catch (error) {
    console.log('Error in testScrape:', error);
  };
};

function* webScraperSaga() {
  yield takeEvery('TEST', testWebScrape);
};

export default webScraperSaga;