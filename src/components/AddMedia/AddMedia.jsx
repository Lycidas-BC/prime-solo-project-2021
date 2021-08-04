import React from 'react';
import { useState } from 'react';
import './AddMedia';
import AddBoxIcon from '@material-ui/icons/AddBox';

function AddMedia() {
  const [movieArray, setMovieArray] = useState([]);
  const [newItem, setSetNewItem] = useState("");
  const [addItemToMedia, setAddItemToMedia] = useState(false);
  const [type, setType] = useState("");
  
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