let blankMediaItemObject = {
  item: "",
  product_page: "",
  distributor: "",
  format: "Blu-ray",
  cover_art: "",
  description: "",
  dimensions: "",
  shelf: "",
  movieList: [],
  featuresList: [],
  progress: "Initiating data retrieval",
};

const mediaItem = (state = blankMediaItemObject, action) => {
  switch (action.type) {
    case "SET_WEB_SCRAPE":
      return action.payload;
    case "SET_ITEM":
      return { ...state, item: action.payload };
    case "SET_PRODUCT_PAGE":
      return { ...state, product_page: action.payload };
    case "SET_DISTRIBUTOR":
      return { ...state, distributor: action.payload };
    case "SET_FORMAT":
      return { ...state, format: action.payload };
    case "SET_COVER_ART":
      return { ...state, cover_art: action.payload };
    case "SET_DESCRIPTION":
      return { ...state, description: action.payload };
    case "SET_DIMENSIONS":
      return { ...state, dimensions: action.payload };
    case "SET_SHELF":
      return { ...state, shelf: action.payload };
    case "SET_MOVIELIST":
      return { ...state, movieList: action.payload };
    case "ADD_TO_MOVIELIST":
      return { ...state, movieList: [...state.movieList, action.payload] };
    case "SET_FEATURESLIST":
      return { ...state, featuresList: action.payload };
    case "ADD_TO_FEATURESLIST":
      return {
        ...state,
        featuresList: [...state.featuresList, action.payload],
      };
    default:
      return state;
  }
};

export default mediaItem;
