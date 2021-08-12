import React from 'react';
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import CardMedia from '@material-ui/core/CardMedia';
import './SearchItem';
import AddIcon from '@material-ui/icons/Add';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';

const useStyles = makeStyles((theme) => ({root: {flexGrow: 1},paper: {padding: theme.spacing(2), textAlign: "center", color: theme.palette.text.secondary, justifyContent: "center", alignItems: "flex-end" }})); // materialUI stuff

function SearchItem({responseItem, addResultToMedia, genericSearch, manualType, role}) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const itemType = (responseItem.media_type ? responseItem.media_type : manualType);
    const configObject = useSelector(store => store.tmdbConfigReducer);

    const getDetails = (type) => {
      console.log('in getDetails', type, responseItem.id);
      history.push(`/search/${type}/${responseItem.id}`);
    };
    
    return (
      <>{ configObject === "empty" ? "" : <>
      {itemType === "movie" ?
        <Grid item style={{height: "100%", width: "24%", padding: "20px 10px" }}>
          <Paper className={classes.paper}>
              {genericSearch? "" : <Button onClick={() => addResultToMedia(responseItem)}><AddIcon /></Button>}
              <h2><em>{responseItem.title}</em> ({responseItem.release_date}) </h2>
            <CardMedia
              style={{maxHeight: "80%", maxWidth: "80%", margin: "auto", padding: "10% 7% 10% 7%" }}
              className={responseItem.title}
              component="img"
              alt={responseItem.title}
              src={responseItem.poster_path === null ? "images/noImage.jpeg" : `${configObject.images.base_url}${configObject.images.poster_sizes[2]}${responseItem.poster_path}`}
              title={responseItem.title}
              onDoubleClick={() => getDetails("movie")}
            />
            <Button onClick={() => getDetails("movie")}><MoreHorizIcon /></Button>
          </Paper>
        </Grid> : itemType === "tv" ?
        <Grid item style={{height: "100%", width: "24%", padding: "20px 10px" }}>
          <Paper className={classes.paper}>
          {genericSearch ? "" : <Button onClick={() => addResultToMedia(responseItem)}><AddIcon /></Button>}
              <h2><em>{responseItem.name}</em> ({responseItem.first_air_date})</h2>
            <CardMedia
              style={{maxHeight: "80%", maxWidth: "80%", margin: "auto", padding: "10% 7% 10% 7%" }}
              className={responseItem.name}
              component="img"
              alt={responseItem.name}
              src={responseItem.poster_path === null ? "images/noImage.jpeg" : `${configObject.images.base_url}${configObject.images.poster_sizes[2]}${responseItem.poster_path}`}
              title={responseItem.name}
              onDoubleClick={() => getDetails("tv")}
            />
          <Button onClick={() => getDetails("tv")}><MoreHorizIcon /></Button>
        </Paper>
      </Grid> : 
      <Grid item style={{height: "100%", width: "24%", padding: "20px 10px" }}>
          <Paper className={classes.paper}>
              <h2><em>{responseItem.name}</em> <div>{ manualType === "" ? `(${responseItem.known_for_department})` : `(${role})` }</div></h2>
            <CardMedia
              style={{maxHeight: "80%", maxWidth: "80%", margin: "auto", padding: "10% 7% 10% 7%"}}
              className={responseItem.name}
              component="img"
              alt={responseItem.name}
              src={responseItem.profile_path === null ? "images/noImage.jpeg" :`${configObject.images.base_url}${configObject.images.poster_sizes[2]}${responseItem.profile_path}`}
              title={responseItem.name}
              onDoubleClick={() => getDetails("person")}
            />
          <Button onClick={() => getDetails("person")}><MoreHorizIcon /></Button>
        </Paper>
      </Grid>
      }</>}
      </>
    );
};

export default SearchItem;