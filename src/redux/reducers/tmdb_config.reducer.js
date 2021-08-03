const emptyConfigObject = {
  images: [{
        base_url: '/',
        secure_base_url: '/',
        backdrop_sizes: [],
        logo_sizes: [],
        poster_sizes: [],
        profile_sizes: [],
        still_sizes: []
      }],
  };

// Used to store api search results
const tmdbConfigReducer = (state = emptyConfigObject, action) => {
  switch (action.type) {
      case 'SET_TMDB_CONFIG':
          return action.payload;
      default:
          return state;
  }
}
  
export default tmdbConfigReducer;