// Used to store api search results
const tmdbDetailsReducer = (state = "empty", action) => {
  switch (action.type) {
      case 'SET_TMDB_DETAILS':
        console.log("in SET_TMDB_DETAILS", action.payload);
          return action.payload;
      default:
          return state;
  }
}
  
export default tmdbDetailsReducer;