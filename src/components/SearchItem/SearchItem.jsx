import React from 'react';
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import CardMedia from '@material-ui/core/CardMedia';
import './SearchItem';
import AddIcon from '@material-ui/icons/Add';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';

const useStyles = makeStyles((theme) => ({root: {flexGrow: 1},paper: {padding: theme.spacing(2), textAlign: "center", color: theme.palette.text.secondary, justifyContent: "center", alignItems: "flex-end" }})); // materialUI stuff

function SearchItem({responseItem, configObject, addResultToMedia, getDetails}) {
    const classes = useStyles();
    const itemType = responseItem.media_type;

    return (
      <>
      {itemType === "movie"?
        <Grid item style={{height: "100%", width: "24%", padding: "20px 10px" }}>
          <Paper className={classes.paper}>
              <Button onClick={() => addResultToMedia(responseItem)}><AddIcon /></Button>
              <h2><em>{responseItem.title}</em> ({responseItem.release_date}) </h2>
            <CardMedia
              style={{maxHeight: "80%", maxWidth: "80%", margin: "auto", padding: "10% 7% 10% 7%", backgroundImage: "url(images/frame.jpg)", backgroundRepeat: "no-repeat", backgroundSize: "100% 100%" }}
              className={responseItem.title}
              component="img"
              alt={responseItem.title}
              src={`${configObject.images.base_url}${configObject.images.poster_sizes[2]}${responseItem.poster_path}`}
              title={responseItem.title}
            />
            <br />
            <p>{responseItem.overview}</p>
            <Button onClick={() => getDetails(responseItem)}><MoreHorizIcon /></Button>
          </Paper>
        </Grid> :
        <Grid item style={{height: "100%", width: "24%", padding: "20px 10px" }}>
          <Paper className={classes.paper}>
              <Button onClick={() => addResultToMedia(responseItem)}><AddIcon /></Button>
              <h2><em>{responseItem.name}</em> ({responseItem.first_air_date})</h2>
            <CardMedia
              style={{maxHeight: "80%", maxWidth: "80%", margin: "auto", padding: "10% 7% 10% 7%", backgroundImage: "url(images/frame.jpg)", backgroundRepeat: "no-repeat", backgroundSize: "100% 100%" }}
              className={responseItem.name}
              component="img"
              alt={responseItem.name}
              src={`${configObject.images.base_url}${configObject.images.poster_sizes[2]}${responseItem.poster_path}`}
              title={responseItem.name}
            />
          <br />
          <p>{responseItem.overview}</p>
          <Button onClick={() => getDetails(responseItem)}><MoreHorizIcon /></Button>
        </Paper>
      </Grid>
      }
      </>
    );
};

export default SearchItem;