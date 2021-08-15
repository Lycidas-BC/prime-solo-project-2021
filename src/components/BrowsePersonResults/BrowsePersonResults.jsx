import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from "@material-ui/core/styles";
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import Grid from "@material-ui/core/Grid";
import CardMedia from '@material-ui/core/CardMedia';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import SearchItem from '../SearchItem/SearchItem';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import './BrowsePersonResults';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(2),
    width: "50%",
    textAlign: "left",
    color: theme.palette.text.secondary,
    justifyContent: "left",
    alignItems: "flex-end" 
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
})); // materialUI stuff

function BrowsePersonResults() {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const { type, tmdbId } = useParams();
  const tmdbDetailsReducer = useSelector(store => store.tmdbDetailsReducer);
  const [role, setRole] = useState("Acting");
  // show all movies, only movies in your collection, only movies not in your collection
  const [carousel, setCarousel] = useState(0);
  const [show, setShow] = useState("all");
  const freshLoad = tmdbDetailsReducer.type === type;
  const [triggerRefresh, setTriggerRefresh] = useState(freshLoad);
  const configObject = useSelector(store => store.tmdbConfigReducer);
  let uniqueRoles = [];

  useEffect(() => {
    dispatch({ type: 'API_DETAILS', payload: {tmdbId: tmdbId, searchType: type} });
  }, []);

  if (type !== "person") {
    history.push(`/search/1/${type}/${tmdbId}`);
  }

  const filterShownItems = (movieIn) => {
    if (show === "inCollection" && tmdbDetailsReducer.mediaList) {
      let idList = [].concat.apply([], tmdbDetailsReducer.mediaList.map(element => element.tmdb_id_list));
      return idList.indexOf(movieIn.id) >= 0;
    } else if (show === "notInCollection"  && tmdbDetailsReducer.mediaList) {
      let idList = [].concat.apply([], tmdbDetailsReducer.mediaList.map(element => element.tmdb_id_list));
      return idList.indexOf(movieIn.id) < 0;
    } else {
      return true;
    }
  }

  if (tmdbDetailsReducer !== "empty" && type === "person" ) {
    uniqueRoles = [...new Set(tmdbDetailsReducer.credits.crew.map(item => item.department))];
    if (tmdbDetailsReducer.credits.cast.length > 0 ) {
      uniqueRoles.unshift("Acting");
    }
  }

  if ( tmdbDetailsReducer.type === type && !triggerRefresh ) {
    setRole(uniqueRoles[0]);
    setTriggerRefresh(true);
  }


  const mediaDetailsScreen = (mediaId) => {
    history.push(`/media_details/${mediaId}`);
  }
  
  console.log("tmdbDetailsReducer", tmdbDetailsReducer);
  return (
    <section>{tmdbDetailsReducer === "empty" || !triggerRefresh ? "" :
    <section>
    { type === "person" ?
    <section>
      <Grid item style={{height: "100%", width: "100%", padding: "20px 10px" }}>
        <h1>{tmdbDetailsReducer.name} ({tmdbDetailsReducer.birthday} - {tmdbDetailsReducer.deathday})</h1>
        <CardMedia
          style={{maxHeight: "25%", maxWidth: "25%", padding: "0% 3% 0% 0%", float: "left" }}
          className={"moviePoster"}
          component="img"
          alt={tmdbDetailsReducer.name}
          src={tmdbDetailsReducer.profile_path === null || configObject === "empty" ? "images/noImage.jpeg" : `${configObject.images.base_url}${configObject.images.poster_sizes[4]}${tmdbDetailsReducer.profile_path}`}
          title={tmdbDetailsReducer.name}
        />
        <p><b>Bio: </b>{tmdbDetailsReducer.biography}</p>
        <p><b>IMDB page:</b> <a href={`https://www.imdb.com/name/${tmdbDetailsReducer.imdb_id}`}>{`https://www.imdb.com/name/${tmdbDetailsReducer.imdb_id}`}</a></p>
        {tmdbDetailsReducer.mediaList.length === 0 ?
          <div>
            <b style={{paddingRight: "5px"}}>Movies in your collection?</b>
            <CancelIcon />
          </div> :
          <div>
            <b style={{paddingRight: "5px"}}>Movies in your collection?</b>
            <CheckCircleIcon />
            <div>
              <ul>
                {
                  tmdbDetailsReducer.mediaList.map((item, index) => {
                    return (
                      <li key={index}>{item.item}, ({item.format}, {item.distributor}) <button onClick={() => mediaDetailsScreen(item.media_id)}>See details</button></li>
                    )
                  })
                }
              </ul>
            </div>
          </div>}
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-simple-select-label">Role</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={role}
          onChange={(event) => {setRole(event.target.value); setCarousel(0);}}
        >
          {
            uniqueRoles.map((element,index) => {
              return (<MenuItem key={index} value={element}>{element}</MenuItem>)
            })
          }
        </Select>
      </FormControl>
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-simple-select-label">Role</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={show}
          onChange={(event) => {setShow(event.target.value); setCarousel(0);}}
        >
          <MenuItem value={"all"}>Show all movies</MenuItem>
          <MenuItem value={"inCollection"}>Show movies in my collection</MenuItem>
          <MenuItem value={"notInCollection"}>Show movies <b style={{paddingLeft: "2px", paddingRight: "2px"}}> not </b> in my collection</MenuItem>
        </Select>
      </FormControl>
      </Grid>
      <Grid item style={{height: "100%", width: "100%", padding: "20px 10px" }}>
        {
          role === "Acting" ? 
          <div>
            <div>
              <Button disabled={carousel === 0} label="previous" onClick={() => setCarousel(carousel-1)} ><ArrowBackIosIcon /></Button>
              <Button disabled={(carousel+1) * 4 >= tmdbDetailsReducer.credits.cast.filter((element) => filterShownItems(element)).length} label="next" onClick={() => setCarousel(carousel+1)} ><ArrowForwardIosIcon /></Button>
            </div>
            <Grid container spacing={2} style={{ alignItems: "flex-end" }}>
              {tmdbDetailsReducer.credits.cast.filter((element) => {
                return filterShownItems(element)
              }).sort((a, b) => {return b.popularity - a.popularity;}).filter((element, index) => {
                return (index >= carousel*4 && index < (carousel+1)*4)
              }).map((item,index) => {
                  return (
                      <SearchItem key={index} responseItem={item} genericSearch={true} manualType={"movie"}></SearchItem>
                  )
              })}
          </Grid>
          </div>:
          <div>
            <div>
              <Button disabled={carousel === 0} label="previous" onClick={() => setCarousel(carousel-1)} ><ArrowBackIosIcon /></Button>
              <Button disabled={(carousel+1) * 4 >= tmdbDetailsReducer.credits.crew.filter((object) => object.department === role).filter( (element) => filterShownItems(element)).length} label="next" onClick={() => setCarousel(carousel+1)} ><ArrowForwardIosIcon /></Button>
            </div>
            <Grid container spacing={2} style={{ alignItems: "flex-end" }}>
              {tmdbDetailsReducer.credits.crew.filter((object) => {
                return object.department === role
              }).filter((element) => {
                return filterShownItems(element)
              }).sort((a, b) => {return b.popularity - a.popularity;}).filter((element, index) => {
                return (index >= carousel*4 && index < (carousel+1)*4)
              }).map((item,index) => {
                  return (
                      <SearchItem key={index} responseItem={item} genericSearch={true} manualType={"movie"}></SearchItem>
                  )
              })}
          </Grid>
          </div>
        }
      </Grid>
    </section> :
    ""}
    </section>}
  </section>
  );
};

export default BrowsePersonResults;