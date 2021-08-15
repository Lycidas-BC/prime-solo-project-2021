const movieFramegrabs = (state = "empty", action) => {
  switch (action.type) {
        case 'SET_FRAMEGRABS':
            return action.payload;
        default:
            return state;
  }
}
  
export default movieFramegrabs;