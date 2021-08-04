const emptyMovieObject = {
  backdrop_path: "",
  budget: -1,
  genres:  [{
    id: -1,
    name: "",
  }],
  homepage: "",
  id: -1,
  imdb_id: "tt0000000",  //pattern: ^tt[0-9]{7}, e.g. https://www.imdb.com/title/tt4139588/
  original_language: "",
  original_title: "",
  overview: "",
  popularity: -1,
  poster_path: "",
  production_companies: [{
    name: "",
    id: -1,
    logo_path: "",
    origin_country: "",
  }],
  production_countries: [{
    iso_3166_1: "",
    name: "",
  }],
  release_date: "",
  revenue: -1,
  runtime: -1,
  spoken_languages: [{
    iso_639_1: "",
    name: "",
  }],
  status: "", //Allowed Values: Rumored, Planned, In Production, Post Production, Released, Canceled
  tagline: "",
  title: "",
  video: false,
  vote_average: -1,
  vote_count: -1,
};
  
  
// Used to store api search results
const tmdbMovieDetailsReducer = (state = emptyMovieObject, action) => {
  switch (action.type) {
      case 'SET_TMDB_MOVIE_DETAILS':
          return action.payload;
      default:
          return state;
  }
}
  
export default tmdbMovieDetailsReducer;