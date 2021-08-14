import axios from 'axios';
import { put, takeEvery } from 'redux-saga/effects';

function* scrapeWebsite(action) {
  try {
    let scrape = yield axios.get(`/web_scraper/scrapeProductPage/?productUrl=${encodeURIComponent(action.payload.productUrl)}`);
    // attempt to get tmdb ids for each movie in set (may require checking multiple pages of results)
    let page = 1;
    let total_pages = 5;
    let endWhileLoopNow = false;
    put({ type: 'SET_WEB_SCRAPE', payload: scrape.data });
    for (const index in scrape.data.movieList) {
      //initialize while loop controls at beginning of each for loop
      page = 1;
      total_pages = 5;
      endWhileLoopNow = false;
      // if the word television is mentioned in the description, include tv in search results
      const searchType = (scrape.data.movieList[index].description.match(/television/i) ? "multi" : "movie");
      // if there's a ":" in the item name, exclude what's after
      const searchTerm = scrape.data.movieList[index].movie.substring(0, scrape.data.movieList[index].movie.indexOf(':') === -1 ? scrape.data.movieList[index].movie.length : scrape.data.movieList[index].movie.indexOf(':'));
      while (page <= total_pages && !endWhileLoopNow ) {
        const searchResults = yield axios.get(`/api/tmdb/searchSpecific/?type=${encodeURIComponent(searchType)}&q=${encodeURIComponent(searchTerm)}&year=${encodeURIComponent(scrape.data.movieList[index].year)}&page=${encodeURIComponent(page)}`);
        if (searchResults.data.tmdb_id.length === 1){
          scrape.data.movieList[index].tmdb_id = searchResults.data.tmdb_id[0];
          scrape.data.movieList[index].media_type = searchResults.data.mediaTypeList[0];
          endWhileLoopNow = true;
        } else if (searchResults.data.tmdb_id.length === 0){
          scrape.data.movieList[index].tmdb_id = "empty";
          scrape.data.movieList[index].media_type = "empty";
        } else {
        scrape.data.movieList[index].tmdb_id = searchResults.data.tmdb_id;
        scrape.data.movieList[index].media_type = searchResults.data.mediaTypeList[0];
        endWhileLoopNow = true;
      }
        total_pages = searchResults.data.total_pages;
        page++;
      }
      const scrapeLength = yield axios.get(`/web_scraper/scrapeLength/?productUrl=${encodeURIComponent(scrape.data.movieList[index].product_url)}`);
      scrape.data.movieList[index].length = scrapeLength.data;
    }
    scrape.data.progress = "COMPLETE";
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