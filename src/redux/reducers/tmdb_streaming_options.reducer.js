const emptyStreamingOptionsObject = {
  link: "",
  buy: [{
    display_priority: -1,
    logo_path: "",
    provider_id: -1,
    provider_name: "",
  }],
  flatrate: [{
    display_priority: -1,
    logo_path: "",
    provider_id: -1,
    provider_name: "",
  }],
};
  
  
// Used to store movie streaming options from api
const tmdbStreamingOptionsReducer = (state = emptyStreamingOptionsObject, action) => {
  switch (action.type) {
      case 'SET_TMDB_STREAMING_OPTIONS':
          return action.payload;
      default:
          return state;
  }
}
  
export default tmdbStreamingOptionsReducer;