// Used to store api search results
const webScrapeReducer = (state = "blank", action) => {
  switch (action.type) {
      case 'SET_WEB_SCRAPE':
          return action.payload.data;
      default:
          return state;
  }
}
  
export default webScrapeReducer;