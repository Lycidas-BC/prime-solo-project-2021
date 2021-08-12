import axios from 'axios';
import { put, takeEvery } from 'redux-saga/effects';

function* scrapeWebsite(action) {
  try {
    let scrape = yield axios.get(`/web_scraper/scrapeProductPage/?productUrl=${encodeURIComponent(action.payload.productUrl)}`);
    
    // attempt to get tmdb ids for each movie in set
    for (const index in scrape.data.movieList) {
      const searchResults = yield axios.get(`/api/tmdb/searchSpecific/?type=${encodeURIComponent("movie")}&q=${encodeURIComponent(scrape.data.movieList[index].movie)}&year=${encodeURIComponent(scrape.data.movieList[index].year)}`);
      if (searchResults.data.tmdb_id.length === 1){
        scrape.data.movieList[index].tmdb_id = searchResults.data.tmdb_id[0];
      } else if (searchResults.data.tmdb_id.length === 0){
        scrape.data.movieList[index].tmdb_id = "empty";
      } else {
      scrape.data.movieList[index].tmdb_id = searchResults.data.tmdb_id;
      }
    }
    console.log("scrape.data", scrape.data);
    yield put({ type: 'SET_WEB_SCRAPE', payload: scrape.data });
  }
  catch (error) {
    console.log('Error in scrapeWebsite:', error);
  };
};

function* webScraperSaga() {
  yield takeEvery('SCRAPE_WEBSITE', scrapeWebsite);
};

export default webScraperSaga;