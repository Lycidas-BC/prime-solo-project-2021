import React from 'react';
import { useState, useEffect } from 'react';
import './AddMedia';
import AddBoxIcon from '@material-ui/icons/AddBox';
import { useDispatch, useSelector } from 'react-redux';

function AddMedia() {
  const [movieArray, setMovieArray] = useState([]);
  const [newItem, setSetNewItem] = useState("");
  const [addItemToMedia, setAddItemToMedia] = useState(false);
  const [type, setType] = useState("");
  const dispatch = useDispatch();
  const webScrape = useSelector(store => store.webScrapeReducer);
  
  const search = () => {
      dispatch({
          type: 'API_SEARCH',
          payload: {
              type: type,
              query: searchTerm,
              page: 1
          }
      });
  };

  useEffect(() => {
    dispatch({ type: 'TEST'});
  }, []);

  console.log('webScrape', webScrape);
  return (
    <>
    <button onClick={() => setAddItemToMedia(!addItemToMedia)}>
      {addItemToMedia ?
      <span><AddBoxIcon />Adding Item</span>:
      <AddBoxIcon />}
      </button>
    </>
  );
};

export default AddMedia;