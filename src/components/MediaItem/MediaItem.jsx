import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from "@material-ui/core/styles";
import { useParams } from 'react-router-dom';
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import CardMedia from '@material-ui/core/CardMedia';
import MediaMovieItem from '../MediaMovieItem/MediaMovieItem';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import './MediaItem';

const useStyles = makeStyles((theme) => ({root: {flexGrow: 1},paper: {padding: theme.spacing(2), marginRight: "10px", width: "25%", textAlign: "center", color: theme.palette.text.secondary, justifyContent: "center", alignItems: "flex-end", float: "left" }})); // materialUI stuff

function MediaItem() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { mediaId } = useParams();
  const [carousel, setCarousel] = useState(0);
  const [pagination, setPagination] = useState(4);
  const mediaItemDetailsReducer = useSelector(store => store.mediaItemDetailsReducer);

  useEffect(() => {
    dispatch({ type: 'GET_MEDIA_ITEM_DETAILS', payload: {mediaId: mediaId} });
  }, []);

  console.log("mediaItemDetailsReducer", mediaItemDetailsReducer);
  return (
    <Grid item style={{height: "100%", width: "100%", padding: "20px 10px" }}>
      {mediaItemDetailsReducer === "empty" ? "" :
      <section>
        <Paper className={classes.paper}>
        <CardMedia
        style={{maxHeight: "95%", maxWidth: "95%" }}
        className={"media"}
        component="img"
        alt={mediaItemDetailsReducer.mediaDetails.item}
        src={`${mediaItemDetailsReducer.mediaDetails.cover_art}`}
        title={mediaItemDetailsReducer.mediaDetails.item}
            />
            <br />
        </Paper>
        <h2><em>{mediaItemDetailsReducer.mediaDetails.item}</em></h2>
        <p><a href={`${mediaItemDetailsReducer.mediaDetails.product_page}`}><b>Product page</b></a></p>
        <p>{mediaItemDetailsReducer.mediaDetails.description}</p>
        <FormControl className={classes.formControl}>
          <InputLabel id="demo-simple-select-label">Results per page</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={pagination}
            onChange={(event) => {setPagination(event.target.value); setCarousel(0);}}
          >
            <MenuItem value={4}>4</MenuItem>
            <MenuItem value={16}>16</MenuItem>
            <MenuItem value={mediaItemDetailsReducer.sqlMovieData.length}>All</MenuItem>
          </Select>
        </FormControl>
        <div>
          <Button disabled={carousel === 0} label="previous" onClick={() => setCarousel(carousel-1)} ><ArrowBackIosIcon /></Button>
          <Button disabled={(carousel+1) * pagination >= mediaItemDetailsReducer.sqlMovieData.length} label="next" onClick={() => setCarousel(carousel+1)} ><ArrowForwardIosIcon /></Button>
        </div>
        <br />
        <div style={{ alignItems: "flex-start", display : "flex", flexWrap: "wrap",  clear: "both", position: "relative"}}>
          {mediaItemDetailsReducer.sqlMovieData.filter((element, index) => {
            return (index >= carousel*pagination && index < (carousel+1)*pagination)
          }).map((element, index) => {
            return <MediaMovieItem key={index} movieIn={element}></MediaMovieItem>
          })}
        </div>
        <h2>SpecialFeatures</h2>
        <ul>
          {mediaItemDetailsReducer.mediaSpecialFeatures.map((element, index) => {
            return <li key={index}>{element.description}</li>
          })}
        </ul>
      </section>
      }
    </Grid>
  );
};

export default MediaItem;