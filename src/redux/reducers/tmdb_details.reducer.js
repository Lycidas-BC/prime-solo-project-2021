// Used to store api search results
const tmdbDetailsReducer = (state = "empty", action) => {
  switch (action.type) {
      case 'SET_TMDB_DETAILS':
          return action.payload;
      default:
          return state;
  }
}
  
export default tmdbDetailsReducer;