// Used to store api search results
const tmdbConfigReducer = (state = "empty", action) => {
  switch (action.type) {
    case "SET_TMDB_CONFIG":
      return action.payload;
    default:
      return state;
  }
};

export default tmdbConfigReducer;
