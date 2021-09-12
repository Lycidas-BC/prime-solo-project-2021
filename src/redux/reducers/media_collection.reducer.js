// Used to current users media collection
const mediaCollectionReducer = (state = [], action) => {
  switch (action.type) {
    case "SET_COLLECTION":
      console.log("in media collection reducer", action.payload);
      return action.payload;
    default:
      return state;
  }
};

export default mediaCollectionReducer;
