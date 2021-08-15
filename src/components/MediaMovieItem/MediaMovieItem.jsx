import React from 'react';
import { useState, useEffect } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import CardMedia from '@material-ui/core/CardMedia';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import AddIcon from '@material-ui/icons/Add';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import './MediaMovieItem';

const useStyles = makeStyles((theme) => ({root: {flexGrow: 1},paper: {padding: theme.spacing(2), textAlign: "center", color: theme.palette.text.secondary, justifyContent: "center", alignItems: "flex-end" }})); // materialUI stuff

function MediaMovieItem({movieIn}) {
  const history = useHistory();
  const classes = useStyles();
  const dispatch = useDispatch();
  const [showDetails, setShowDetails] = useState(false);

  const getMovieDetails = () => {
    dispatch({ type: 'SET_TMDB_DETAILS', payload: "empty" });
    history.push(`/search/1/${movieIn.media_type}/${movieIn.tmdb_id}`);
  };

  let itemStyle = {height: "100%", width: "24%", padding: "20px 10px" };

  {
    //     "movie_id": 32,
    //     "name": "Autumn Sonata",
    //     "tmdb_id": 12761,
    //     "description": "Autumn Sonata was the only collaboration between cinema’s two great Bergmans: Ingmar and Ingrid, the monumental star of Casablanca. The grande dame, playing an icy concert pianist, is matched beat for beat in ferocity by the filmmaker’s recurring lead Liv Ullmann, as her eldest daughter. Over the course of a day and a long, painful night that the two spend together after an extended separation, they finally confront the bitter discord of their relationship. This cathartic pas de deux, evocatively shot in burnished harvest colors, ranks among the director’s major dramatic works.",
    //     "length": 93,
    //     "media_type": "movie",
    //     "product_url": "https://www.criterion.com/films/605-autumn-sonata"
    //      cover_art
    // }
  return (
    <Grid item style={itemStyle}>
      <Paper className={classes.paper}>
          {<h4><em>{movieIn.name}</em> </h4>}
      <CardMedia
      style={{maxHeight: "95%", maxWidth: "95%", margin: "auto"}}
      className={movieIn.name}
      component="img"
      onDoubleClick={getMovieDetails}
      alt={movieIn.name}
      src={movieIn.cover_art}
      title={movieIn.name}
    />
    <br />
    <Button onClick={getMovieDetails}><MoreHorizIcon /></Button>
    <Button onClick={() => setShowDetails(!showDetails)}><ExpandMoreIcon /></Button>
    {showDetails ? 
      <section>
        <p><em>({movieIn.length} minutes, <a href={`${movieIn.product_url}`}>website</a>)</em> {movieIn.description}</p>
      </section> : ""}
      </Paper>
    </Grid>
  );
};
}

export default MediaMovieItem;