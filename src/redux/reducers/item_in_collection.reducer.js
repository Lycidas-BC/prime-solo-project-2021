// returns array of media ids if movie is found in collection
const itemInCollection = (state = [], action) => {
  switch (action.type) {
    case 'ITEM_IN_COLLECTION':
      return action.payload;
    default:
      return state;
  }
}
  
export default itemInCollection;