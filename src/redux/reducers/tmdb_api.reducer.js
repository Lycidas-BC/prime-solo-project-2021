const emptySearchResultObject = {
  page: 0,
  results: [{
        adult: false,
        backdrop_path: '/',
        genre_ids: [Array],
        id: -1,
        media_type: 'movie',
        original_language: 'en',
        original_title: '',
        overview: "",
        popularity: -1,
        poster_path: '/',
        release_date: '',
        title: '',
        video: -1,
        vote_average: -1,
        vote_count: -1
      }],
    total_pages: 0,
    total_results: 0
  };

// Used to store api search results
const tmdbSearchReducer = (state = emptySearchResultObject, action) => {
  switch (action.type) {
      case 'SET_TMDB_SEARCH':
          return action.payload;
      default:
          return state;
  }
}
  
export default tmdbSearchReducer;