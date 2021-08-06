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
  // box set urls for testing
  // https://www.criterion.com/boxsets/2648-godzilla-the-showa-era-films-1954-1975
  // https://www.criterion.com/boxsets/1427-ingmar-bergman-s-cinema
  // https://www.criterion.com/boxsets/4117-world-of-wong-kar-wai
  // https://www.criterion.com/boxsets/1554-police-story-police-story-2
  // https://www.criterion.com/boxsets/3432-the-complete-films-of-agn-s-varda
  // https://www.criterion.com/boxsets/825-eclipse-series-28-the-warped-world-of-koreyoshi-kurahara
  useEffect(() => {
    dispatch({
      type: 'SCRAPE_WEBSITE',
      payload: {productUrl: `https://www.criterion.com/films/29081-after-life`}
  });
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