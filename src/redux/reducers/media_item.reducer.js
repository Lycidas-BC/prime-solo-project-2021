// Used to current users media collection
const mediaItemReducer = (state = [], action) => {
  switch (action.type) {
    case 'SET_MEDIA_ITEM_DETAILS':
      console.log('in media item reducer', action.payload);
      return action.payload;
    default:
      return state;
  }
}
  
export default mediaItemReducer;