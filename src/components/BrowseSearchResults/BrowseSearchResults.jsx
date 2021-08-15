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
      </Grid>
      { show === "cast" ?
      <div>
        <div>
          <Button disabled={carousel === 0} label="previous" onClick={() => setCarousel(carousel-1)} ><ArrowBackIosIcon /></Button>
          <Button disabled={(carousel+1) * 4 >= tmdbDetailsReducer.credits.cast.length} label="next" onClick={() => setCarousel(carousel+1)} ><ArrowForwardIosIcon /></Button>
        </div>
        <h2>Cast:</h2>
        <Grid container spacing={2} style={{ alignItems: "flex-end" }}>
          {tmdbDetailsReducer.credits.cast.filter((element, index) => {
            return (index >= carousel*4 && index < (carousel+1)*4)
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
          <Button disabled={(carousel+1) * 4 >= tmdbDetailsReducer.credits.crew.length} label="next" onClick={() => setCarousel(carousel+1)} ><ArrowForwardIosIcon /></Button>
        </div>
        <h2>Crew:</h2>
        <Grid container spacing={2} style={{ alignItems: "flex-end" }}>
          {tmdbDetailsReducer.credits.crew.filter((element, index) => {
            return (index >= carousel*4 && index < (carousel+1)*4)
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

//     "backdrop_path": "/kZGaVeXSkkvrpMYvD97sxHj291k.jpg"
//     "id": 539,
//     "imdb_id": "tt0054215",
//     "original_language": "en",
//     "original_title": "Psycho",
//     "overview": "When larcenous real estate clerk Marion Crane goes on the lam with a wad of cash and hopes of starting a new life, she ends up at the notorious Bates Motel, where manager Norman Bates cares for his housebound mother.",
//     "popularity": 32.534,
//     "poster_path": "/nR4LD4ZJg2n6LZQpcOrLFdMq0cD.jpg",
//     "release_date": "1960-06-22",
//     "runtime": 109,
//     "tagline": "A new—and altogether different—screen excitement!",
//     "title": "Psycho",
//     "credits": {
//         "cast": [
//             {
//                 "adult": false,
//                 "gender": 2,
//                 "id": 7301,
//                 "known_for_department": "Acting",
//                 "name": "Anthony Perkins",
//                 "original_name": "Anthony Perkins",
//                 "popularity": 3.983,
//                 "profile_path": "/7FipKwmg2woHNvt5ATeXLBirHXs.jpg",
//                 "cast_id": 4,
//                 "character": "Norman Bates",
//                 "credit_id": "52fe424fc3a36847f8014213",
//                 "order": 1
//             }
//         ],
//         "crew": [
//             {
//                 "adult": false,
//                 "gender": 2,
//                 "id": 2636,
//                 "known_for_department": "Directing",
//                 "name": "Alfred Hitchcock",
//                 "original_name": "Alfred Hitchcock",
//                 "popularity": 4.961,
//                 "profile_path": "/108fiNM6poRieMg7RIqLJRxdAwG.jpg",
//                 "credit_id": "52fe424ec3a36847f8014203",
//                 "department": "Directing",
//                 "job": "Director"
export default BrowseSearchResults;