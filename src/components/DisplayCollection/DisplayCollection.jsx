import React from 'react';
import { useState, useEffect } from 'react';
import './DisplayCollection';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from "@material-ui/core/styles";
import DisplayCollectionItem from '../DisplayCollectionItem/DisplayCollectionItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Button from "@material-ui/core/Button";
import SortByAlphaTwoToneIcon from '@material-ui/icons/SortByAlphaTwoTone';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
})); // materialUI stuff

function DisplayCollection() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [orderBy, setOrderBy] = useState(`"media"."id"`);
  const [direction, setDirection] = useState("DESC");
  const mediaCollection = useSelector(store => store.mediaCollectionReducer);
  
  useEffect(() => {
    dispatch({ type: 'GET_COLLECTION', payload: {order: `${orderBy} ${direction}`} });
}, []);

  const updateOrder = () => {
    dispatch({ type: 'GET_COLLECTION', payload: {order: `${orderBy} ${direction}`} });
  }

  console.log('mediaCollection', mediaCollection);
  return (
    <section>
      <section style={{ alignItems: "flex-end", display : "flex", flexWrap: "wrap" }}>
        <FormControl className={classes.formControl}>
          <InputLabel id="demo-simple-select-label">Order</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={orderBy}
            onChange={(event) => {setOrderBy(event.target.value)}}
          >
            <MenuItem value={`"media"."id"`}>Date added</MenuItem>
            <MenuItem value={`"media"."item"`}>Name</MenuItem>
            <MenuItem value={`"media"."distributor"`}>Distributor</MenuItem>
            <MenuItem value={`"media"."format"`}>Format</MenuItem>
          </Select>
        </FormControl>
        <FormControl className={classes.formControl}>
          <InputLabel id="demo-simple-select-label">Direction</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={direction}
            onChange={(event) => {setDirection(event.target.value)}}
          >
            <MenuItem value={"DESC"}>Descending</MenuItem>
            <MenuItem value={"ASC"}>Ascending</MenuItem>
          </Select>
        </FormControl>
        <Button onClick={updateOrder}><SortByAlphaTwoToneIcon /></Button>
      </section>
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
    </section>
  );
};

export default DisplayCollection;