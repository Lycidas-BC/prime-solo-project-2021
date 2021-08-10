import React from 'react';
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import CardMedia from '@material-ui/core/CardMedia';
import './MovieItem';

const useStyles = makeStyles((theme) => ({root: {flexGrow: 1},paper: {padding: theme.spacing(2), textAlign: "center", color: theme.palette.text.secondary, justifyContent: "center", alignItems: "flex-end" }})); // materialUI stuff

function MovieItem({movieIn, addMovieScreen, addMovieIcon}) {
    const classes = useStyles();

    if (addMovieScreen) {
      movieIn = {
        cover_art: "/images/addImage.png"
      }
    }
    let itemStyle = {height: "100%", width: "24%", padding: "20px 10px" };
    if (addMovieIcon) {
      itemStyle = {height: "100%", width: "100%", padding: "20px 10px" };
    }
    console.log("movieItem", movieIn);
    return (
      <Grid item style={itemStyle}>
        <Paper className={classes.paper}>
            {addMovieScreen ? "" : <h2><em>{movieIn.movie}</em> ({movieIn.year})</h2>}
        <CardMedia
        style={{maxHeight: "80%", maxWidth: "80%", margin: "auto", padding: "10% 7% 10% 7%", backgroundImage: "url(images/frame.jpg)", backgroundRepeat: "no-repeat", backgroundSize: "100% 100%" }}
        className={movieIn.movie}
        component="img"
        alt={movieIn.movie}
        src={movieIn.cover_art}
        title={movieIn.movie}
      />
      <br />
      <p>{movieIn.description}</p>
          {/* <br />
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
          } */}
        </Paper>
      </Grid>
    );
};

export default MovieItem;