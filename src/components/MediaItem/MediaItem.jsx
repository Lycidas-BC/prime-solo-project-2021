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
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import './MediaItem';

const useStyles = makeStyles((theme) => ({root: {flexGrow: 1},paper: {padding: theme.spacing(2), marginRight: "10px", width: "25%", textAlign: "center", color: theme.palette.text.secondary, justifyContent: "center", alignItems: "flex-end", float: "left" }})); // materialUI stuff

function MediaItem() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { mediaId } = useParams();
  const [carousel, setCarousel] = useState(0);
  const mediaItemDetailsReducer = useSelector(store => store.mediaItemDetailsReducer);

  useEffect(() => {
    dispatch({ type: 'GET_MEDIA_ITEM_DETAILS', payload: {mediaId: mediaId} });
  }, []);

//   {
//     "id": 1,
//     "item": "Ingmar Bergman’s Cinema",
//     "distributor": "Criterion Collection",
//     "product_page": null,
//     "format": "Blu-ray",
//     "cover_art": "https://s3.amazonaws.com/criterion-production/product_images/1929-4d592bff5abc636d45619dfd6d997edd/tKFKOgGoH5bF64n2r7YLfezGOkZBvO_large.jpg",
//     "description": "In honor of Ingmar Bergman’s one hundredth birthday, the Criterion Collection is proud to present the most comprehensive collection of his films ever released on home video. One of the most revelatory voices to emerge from the postwar explosion of international art-house cinema, Bergman was a master storyteller who startled the world with his stark intensity and naked pursuit of the most profound metaphysical and spiritual questions. The struggles of faith and morality, the nature of dreams, and the agonies and ecstasies of human relationships—Bergman explored these subjects in films ranging from comedies whose lightness and complexity belie their brooding hearts to groundbreaking formal experiments and excruciatingly intimate explorations of family life.",
//     "dimensions": "",
//     "shelf": ""
// }
//special features
//   [
//     {
//         "description": "Digital restorations of the films, including a new 4K restoration of The Seventh Seal and new 2K restorations of Crisis, Persona, Fanny and Alexander, and many others, with uncompressed monaural and stereo soundtracks"
//     }
// ]
//   
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
        <p>{mediaItemDetailsReducer.mediaDetails.description}</p>
        <br />
        <div style={{ alignItems: "flex-start", display : "flex", flexWrap: "wrap",  clear: "both", position: "relative"}}>
          {mediaItemDetailsReducer.sqlMovieData.filter((element, index) => {
            return (index >= carousel*4 && index < (carousel+1)*4)
          }).map((element, index) => {
            return <MediaMovieItem key={index} movieIn={element}></MediaMovieItem>
          })}
        </div>
        <BottomNavigation 
            style={{width: '100%', position: 'fixed', bottom: 0}}
            showLabels
            className={classes.root}
            >
            <BottomNavigationAction disabled={carousel === 0} label="previous" onClick={() => setCarousel(carousel-1)} icon={<ArrowBackIosIcon />} />
            <BottomNavigationAction disabled={(carousel+1) * 4 >= mediaItemDetailsReducer.sqlMovieData.length} label="next" onClick={() => setCarousel(carousel+1)} icon={<ArrowForwardIosIcon />} />
        </BottomNavigation>
        <h2>SpecialFeatures</h2>
        <ul>
          {mediaItemDetailsReducer.mediaSpecialFeatures.map(element => {
            return <li>{element.description}</li>
          })}
        </ul>
      </section>
      }
    </Grid>
  );
};

export default MediaItem;