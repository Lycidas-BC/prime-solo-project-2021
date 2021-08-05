// Used to store api search results
const webScrapeReducer = (state = [], action) => {
  switch (action.type) {
      case 'SET_WEB_SCRAPE':
          return action.payload;
      default:
          return state;
  }
}
  
export default webScrapeReducer;