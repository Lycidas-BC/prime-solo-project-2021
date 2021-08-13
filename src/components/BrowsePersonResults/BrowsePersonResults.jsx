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
          onChange={(event) => setRole(event.target.value)}
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
          onChange={(event) => setShow(event.target.value)}
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
            <Grid container spacing={2} style={{ alignItems: "flex-end" }}>
              {tmdbDetailsReducer.credits.cast.filter( (element) => filterShownItems(element) ).sort((a, b) => {return b.popularity - a.popularity;}).map((item,index) => {
                  return (
                      <SearchItem key={index} responseItem={item} genericSearch={true} manualType={"movie"}></SearchItem>
                  )
              })}
          </Grid>
          </div>:
          <div>
            <Grid container spacing={2} style={{ alignItems: "flex-end" }}>
              {tmdbDetailsReducer.credits.crew.filter((object) => object.department === role).filter( (element) => filterShownItems(element) ).sort((a, b) => {return b.popularity - a.popularity;}).map((item,index) => {
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

//   "biography": "Humphrey DeForest Bogart (December 25, 1899 – January 14, 1957) was an American actor. He is widely regarded as a cultural icon. The American Film Institute ranked Bogart as the greatest male star in the history of American cinema.\n\nAfter trying various jobs, Bogart began acting in 1921 and became a regular in Broadway productions in the 1920s and 1930s. When the stock market crash of 1929 reduced the demand for plays, Bogart turned to film. His first great success was as Duke Mantee in The Petrified Forest (1936), and this led to a period of typecasting as a gangster with films such as Angels with Dirty Faces (1938) and B-movies like The Return of Doctor X (1939).\n\nHis breakthrough as a leading man came in 1941, with High Sierra and The Maltese Falcon. The next year, his performance in Casablanca raised him to the peak of his profession and, at the same time, cemented his trademark film persona, that of the hard-boiled cynic who ultimately shows his noble side. Other successes followed, including To Have and Have Not (1944), The Big Sleep (1946), Dark Passage (1947) and Key Largo (1948), with his wife Lauren Bacall; The Treasure of the Sierra Madre (1948); The African Queen (1951), for which he won his only Academy Award; Sabrina (1954) and The Caine Mutiny (1954). His last movie was The Harder They Fall (1956). During a film career of almost thirty years, he appeared in 75 feature films.\n\nDescription above from the Wikipedia article Humphrey Bogart, licensed under CC-BY-SA, full list of contributors on Wikipedia.",
//   "birthday": "1899-12-25",
//   "deathday": "1957-01-14",
//   "id": 4110,
//   "imdb_id": "nm0000007",
//   "known_for_department": "Acting",
//   "name": "Humphrey Bogart",
//   "place_of_birth": "New York City, New York, USA",
//   "popularity": 6.106,
//   "profile_path": "/dXGs7F5ezehcofe6j7Kz7wIhmV6.jpg"
export default BrowsePersonResults;