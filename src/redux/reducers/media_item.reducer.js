// Used to current users media collection
const mediaItemReducer = (state = "empty", action) => {
  switch (action.type) {
    case 'SET_MEDIA_ITEM_DETAILS':
      return action.payload;
    default:
      return state;
  }
}
  
export default mediaItemReducer;