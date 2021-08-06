import axios from 'axios';
import { put, takeEvery } from 'redux-saga/effects';

function* scrapeWebsite(action) {
  try {
    const scrape = yield axios.get(`/web_scraper/scrapeProductPage/?productUrl=${encodeURIComponent(action.payload.productUrl)}`);
    console.log("scrape:", scrape);
    yield put({ type: 'SET_WEB_SCRAPE', payload: scrape });
  }
  catch (error) {
    console.log('Error in scrapeWebsite:', error);
  };
};

function* webScraperSaga() {
  yield takeEvery('SCRAPE_WEBSITE', scrapeWebsite);
};

export default webScraperSaga;