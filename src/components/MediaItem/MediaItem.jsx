import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from "@material-ui/core/styles";
import { useParams } from 'react-router-dom';
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import CardMedia from '@material-ui/core/CardMedia';
import './MediaItem';

const useStyles = makeStyles((theme) => ({root: {flexGrow: 1},paper: {padding: theme.spacing(2), textAlign: "center", color: theme.palette.text.secondary, justifyContent: "center", alignItems: "flex-end" }})); // materialUI stuff

function MediaItem() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { mediaId } = useParams();
  const mediaItemReducer = useSelector(store => store.mediaItemReducer);

  useEffect(() => {
    dispatch({ type: 'GET_MEDIA_ITEM_DETAILS', payload: {mediaId: mediaId} });
  }, []);

  console.log("mediaItemReducer", mediaItemReducer);
  return (
    <Grid item style={{height: "100%", width: "24%", padding: "20px 10px" }}>
      {/* <Paper className={classes.paper}>
          <h2><em>{mediaIn.movie}</em> ({mediaIn.year})</h2>
      <CardMedia
      style={{maxHeight: "80%", maxWidth: "80%", margin: "auto", padding: "10% 7% 10% 7%", backgroundImage: "url(images/frame.jpg)", backgroundRepeat: "no-repeat", backgroundSize: "100% 100%" }}
      className={mediaIn.movie}
      component="img"
      alt={mediaIn.movie}
      src={mediaIn.image}
      title={mediaIn.movie}
    />
    <br />
    <p>{mediaIn.description}</p>
        <br />
        {
          addMovieScreen ?
          <Button
          style={{ width: "90%" }}
          variant="contained"
          color="primary"
          onClick={() => addMovie()}
        >
          Add movie
        </Button> :
        <Button
          style={{ width: "90%" }}
          variant="contained"
          color="primary"
          onClick={() => movieDetails()}
        >
          See movie details
        </Button>
        }
      </Paper> */}
    </Grid>
  );
};

export default MediaItem;