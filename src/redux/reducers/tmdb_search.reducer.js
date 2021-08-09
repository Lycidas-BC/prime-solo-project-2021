const emptySearchResultObject = {
  page: -1,
  results: [],
  total_pages: -1,
  total_results: -1
};
  
// Used to store api search results
const tmdbSearchReducer = (state = emptySearchResultObject, action) => {
  switch (action.type) {
    case 'SET_TMDB_SEARCH':
      console.log('in search tmdb reducer', action.payload);
      return action.payload;
    default:
      return state;
  }
}
  
export default tmdbSearchReducer;