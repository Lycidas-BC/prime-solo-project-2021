import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import CardMedia from '@material-ui/core/CardMedia';
import SearchItem from '../SearchItem/SearchItem';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

import './BrowseSearchResults';

//material-ui functions
const useStyles = makeStyles((theme) => ({
  button: {
    display: 'block',
    marginTop: theme.spacing(2),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  root: {
      width: 500,
      },
}));

function BrowseSearchResults() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const [carousel, setCarousel] = useState(0);
  const [show, setShow] = useState("cast");
  const [pagination, setPagination] = useState(4);
  const { type, tmdbId } = useParams();
  const tmdbDetailsReducer = useSelector(store => store.tmdbDetailsReducer);
  const configObject = useSelector(store => store.tmdbConfigReducer);
  const itemInCollection = useSelector(store => store.itemInCollection);

  useEffect(() => {
    dispatch({ type: 'API_DETAILS', payload: {tmdbId: tmdbId, searchType: type} });
    dispatch({ type: 'SEARCH_COLLECTION', payload: {tmdbId: tmdbId} });
  }, []);

  if (type === "person") {
    history.push(`/search/0/${type}/${tmdbId}`);
  }
  
  const mediaDetailsScreen = (mediaId) => {
    history.push(`/media_details/${mediaId}`);
  }

  console.log("tmdbDetailsReducer", tmdbDetailsReducer);
  console.log("itemInCollection", itemInCollection);
  return (
    <section>{tmdbDetailsReducer === "empty" ? "" :
    <section>
    { type === "movie" ? 
    <section>
      <Grid item style={{height: "100%", width: "100%", padding: "20px 10px" }}>
        <h1>{tmdbDetailsReducer.title} ({tmdbDetailsReducer.release_date.substring(0,4)})</h1>
        <CardMedia
          style={{maxHeight: "20%", maxWidth: "20%", padding: "0% 3% 0% 0%", float: "left" }}
          className={"moviePoster"}
          component="img"
          alt={tmdbDetailsReducer.title}
          src={tmdbDetailsReducer.poster_path === null || configObject === "empty" ? "images/noImage.jpeg" : `${configObject.images.base_url}${configObject.images.poster_sizes[4]}${tmdbDetailsReducer.poster_path}`}
          title={tmdbDetailsReducer.title}
        />
        <p><b>Length:</b> {tmdbDetailsReducer.runtime} mins</p>
        <p><b>Overview: </b>{tmdbDetailsReducer.overview}</p>
        <p><b>IMDB page:</b> <a href={`https://www.imdb.com/title/${tmdbDetailsReducer.imdb_id}`}>{`https://www.imdb.com/title/${tmdbDetailsReducer.imdb_id}`}</a></p>
        {itemInCollection[0].item === undefined ?
          <p>
            <b style={{paddingRight: "5px"}}>In your collection?</b>
            <CancelIcon />
          </p> :
          <div>
            <b style={{paddingRight: "5px"}}>In your collection?</b>
            <CheckCircleIcon />
            <div>
              <ul>
                {
                  itemInCollection.map((item, index) => {
                    return (
                      <li key={index}>{item.item}, ({item.format}, {item.distributor}) <button onClick={() => mediaDetailsScreen(item.media_id)}>See details</button></li>
                    )
                  })
                }
              </ul>
            </div>
          </div>}
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">Show</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={show}
              onChange={(event) => {setShow(event.target.value); setCarousel(0);}}
            >
              <MenuItem value={"cast"}>Cast</MenuItem>
              <MenuItem value={"crew"}>Crew</MenuItem>
            </Select>
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">Results per page</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={pagination}
              onChange={(event) => {setPagination(event.target.value); setCarousel(0);}}
            >
              <MenuItem value={4}>4</MenuItem>
              <MenuItem value={8}>8</MenuItem>
              <MenuItem value={32}>32</MenuItem>
              <MenuItem value={100}>100</MenuItem>
            </Select>
          </FormControl>
      </Grid>
      { show === "cast" ?
      <div>
        <div>
          <Button disabled={carousel === 0} label="previous" onClick={() => setCarousel(carousel-1)} ><ArrowBackIosIcon /></Button>
          <Button disabled={(carousel+1) * pagination >= tmdbDetailsReducer.credits.cast.length} label="next" onClick={() => setCarousel(carousel+1)} ><ArrowForwardIosIcon /></Button>
        </div>
        <h2>Cast:</h2>
        <Grid container spacing={2} style={{ alignItems: "flex-end" }}>
          {tmdbDetailsReducer.credits.cast.filter((element, index) => {
            return (index >= carousel*pagination && index < (carousel+1)*pagination)
          }).map((item,index) => {
              return (
                  <SearchItem key={index} responseItem={item} genericSearch={true} manualType={"person"} role={item.character}></SearchItem>
              )
          })}
      </Grid>
      </div> :
      <div>
        <div>
          <Button disabled={carousel === 0} label="previous" onClick={() => setCarousel(carousel-1)} ><ArrowBackIosIcon /></Button>
          <Button disabled={(carousel+1) * pagination >= tmdbDetailsReducer.credits.crew.length} label="next" onClick={() => setCarousel(carousel+1)} ><ArrowForwardIosIcon /></Button>
        </div>
        <h2>Crew:</h2>
        <Grid container spacing={2} style={{ alignItems: "flex-end" }}>
          {tmdbDetailsReducer.credits.crew.filter((element, index) => {
            return (index >= carousel*pagination && index < (carousel+1)*pagination)
          }).map((item,index) => {
              return (
                  <SearchItem key={index} responseItem={item} genericSearch={true} manualType={"person"} role={item.job}></SearchItem>
              )
          })}
      </Grid>
      </div>
          }

    </section> :
    ""}
    </section>}
  </section>
  );
};

export default BrowseSearchResults;