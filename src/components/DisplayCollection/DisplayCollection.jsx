import React from 'react';
import { useState, useEffect } from 'react';
import './DisplayCollection';
import { useDispatch, useSelector } from 'react-redux';
import DisplayCollectionItem from '../DisplayCollectionItem/DisplayCollectionItem';

function DisplayCollection() {
  const dispatch = useDispatch();
  const mediaCollection = useSelector(store => store.mediaCollectionReducer);
  
  useEffect(() => {
    dispatch({ type: 'GET_COLLECTION' });
}, []);

  console.log('mediaCollection', mediaCollection);
  return (
    <section className="media" style={{ alignItems: "flex-end", display : "flex", flexWrap: "wrap" }}>
      <DisplayCollectionItem mediaIn={"none"} addMedia={true} ></DisplayCollectionItem>
      {mediaCollection.map((element,index) => {
        return (
            element.columnHeaders === undefined ?
            <DisplayCollectionItem key={index} mediaIn={element} addMedia={false} ></DisplayCollectionItem> :
            ""
        )
      })}
    </section>
  );
};

export default DisplayCollection;