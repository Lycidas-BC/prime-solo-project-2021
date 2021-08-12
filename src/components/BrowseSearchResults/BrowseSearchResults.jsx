import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from "@material-ui/core/styles";
import { useParams } from 'react-router-dom';
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import CardMedia from '@material-ui/core/CardMedia';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import SearchItem from '../SearchItem/SearchItem';
import './BrowseSearchResults';


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(2),
    width: "50%",
    textAlign: "center",
    color: theme.palette.text.secondary,
    justifyContent: "center",
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

function BrowseSearchResults() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { type, tmdbId } = useParams();
  const tmdbDetailsReducer = useSelector(store => store.tmdbDetailsReducer);
  const [role, setRole] = React.useState("Acting");
  let uniqueRoles = [];

  useEffect(() => {
    dispatch({ type: 'API_DETAILS', payload: {tmdbId: tmdbId, searchType: type} });
  }, []);

  const getDetails = (type) => {
    console.log('in getDetails', type, responseItem.id);
    history.push(`/search/${type}/${responseItem.id}`);
  };
//   {
//     
//     "biography": "William Bradley Pitt is an American actor and film producer. He has received multiple awards, including two Golden Globe Awards and an Academy Award for his acting, in addition to another Academy Award and a Primetime Emmy Award as producer under his production company, Plan B Entertainment.\n\nPitt first gained recognition as a cowboy hitchhiker in the road movie Thelma & Louise (1991). His first leading roles in big-budget productions came with the drama films A River Runs Through It (1992) and Legends of the Fall (1994), and the horror film Interview with the Vampire (1994). He gave critically acclaimed performances in the crime thriller Seven (1995) and the science fiction film 12 Monkeys (1995), the latter earning him a Golden Globe Award for Best Supporting Actor and an Academy Award nomination.\n\nHe starred in Fight Club (1999) and the heist film Ocean's Eleven (2001), as well as its sequels, Ocean's Twelve (2004) and Ocean's Thirteen (2007). His greatest commercial successes have been Ocean's Eleven (2001), Troy (2004), Mr. & Mrs. Smith (2005), World War Z (2013), and Once Upon a Time in Hollywood (2019), for which he won a second Golden Globe Award and the Academy Award for Best Supporting Actor. Pitt's other Academy Award nominated performances were in The Curious Case of Benjamin Button (2008) and Moneyball (2011). He produced The Departed (2006) and 12 Years a Slave (2013), both of which won the Academy Award for Best Picture, and also The Tree of Life (2011), Moneyball (2011), and The Big Short (2015), all of which were nominated for Best Picture.\n\nAs a public figure, Pitt has been cited as one of the most influential and powerful people in the American entertainment industry. For a number of years, he was cited as the world's most attractive man by various media outlets, and his personal life is the subject of wide publicity. From 2000 to 2005, he was married to the actress Jennifer Aniston, and from 2014 to 2019, he was married to the actress Angelina Jolie. Pitt and Jolie have six children together, three of whom were adopted internationally.",
//     "birthday": "1963-12-19",
//     "deathday": null,
//     "id": 287,
//     "imdb_id": "nm0000093",
//     "known_for_department": "Acting",
//     "name": "Brad Pitt",
//     "place_of_birth": "Shawnee, Oklahoma, USA",
//     "profile_path": "/oTB9vGIBacH5aQNS0pUM74QSWuf.jpg",
//     "credits": {
//         "cast": [
//             {
//                 "backdrop_path": "/xYI72IVRK7MTQpENTdt4L20Aa2I.jpg",
//                 "id": 297,
//                 "original_title": "Meet Joe Black",
//                 "overview": "When the grim reaper comes to collect the soul of megamogul Bill Parrish, he arrives with a proposition: Host him for a \"vacation\" among the living in trade for a few more days of existence. Parrish agrees, and using the pseudonym Joe Black, Death begins taking part in Parrish's daily agenda and falls in love with the man's daughter. Yet when Black's holiday is over, so is Parrish's life.",
//                 "poster_path": "/fDPAjvfPMomkKF7cMRmL5Anak61.jpg",
//                 "release_date": "1998-11-12",
//                 "title": "Meet Joe Black",
//                 "character": "Joe Black / Young Man in Coffee Shop",
//             }
//         ],
//         "crew": [
//             {
//                 "title": "The Departed",
//                 "original_title": "The Departed",
//                 "poster_path": "/kWWAt2FMRbqLFFy8o5R4Zr8cMAb.jpg",
//                 "overview": "To take down South Boston's Irish Mafia, the police send in one of their own to infiltrate the underworld, not realizing the syndicate has done likewise. While an undercover cop curries favor with the mob kingpin, a career criminal rises through the police ranks. But both sides soon discover there's a mole among them.",
//                 "release_date": "2006-10-05",
//                 "id": 1422,
//                 "backdrop_path": "/9RuC3UD6mNZ0p1J6RbfJDUkQ03i.jpg",
//                 "department": "Production",
//                 "job": "Producer"
//             }
//         ]
//     }
// }
if (tmdbDetailsReducer !== "empty" && type === "person") {
  uniqueRoles = [...new Set(tmdbDetailsReducer.credits.crew.map(item => item.department))];
  if (tmdbDetailsReducer.credits.cast.length > 0 ) {
    uniqueRoles.unshift("Acting");
  }
  console.log("uniqueRoles", uniqueRoles);
}
  console.log("tmdbDetailsReducer", tmdbDetailsReducer);
  return (
    <section>
    {tmdbDetailsReducer === "empty" ? "" :
    <section>
    { type === "person" ?
    <section>
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
      <Grid item style={{height: "100%", width: "100%", padding: "20px 10px" }}>
        {
          role === "Acting" ? 
          <div>
            <Grid container spacing={2} style={{ alignItems: "flex-end" }}>
              {tmdbDetailsReducer.credits.cast.sort((a, b) => {return b.popularity - a.popularity;}).map((item,index) => {
                  return (
                      <SearchItem key={index} responseItem={item} genericSearch={true} manualType={"movie"}></SearchItem>
                  )
              })}
          </Grid>
          </div>:
          <div>
            <Grid container spacing={2} style={{ alignItems: "flex-end" }}>
              {tmdbDetailsReducer.credits.crew.filter((object) => object.department === role).sort((a, b) => {return b.popularity - a.popularity;}).map((item,index) => {
                  return (
                      <SearchItem key={index} responseItem={item} genericSearch={true} manualType={"movie"}></SearchItem>
                  )
              })}
          </Grid>
          </div>
        }
        {/* {mediaItemReducer === "empty" ? "" :
        <section>
          <Paper className={classes.paper}>
              <h2><em>{mediaItemReducer.mediaDetails.item}</em></h2>
          <CardMedia
          style={{maxHeight: "90%", maxWidth: "90%", margin: "auto"}}
          className={"media"}
          component="img"
          alt={mediaItemReducer.mediaDetails.item}
          src={`${mediaItemReducer.mediaDetails.cover_art}`}
          title={mediaItemReducer.mediaDetails.item}
              />
              <br />
          </Paper>
          <p>{mediaItemReducer.mediaDetails.description}</p>
        </section>
        } */}
      </Grid>
    </section> :
    ""}
    </section>}
  </section>
  );
};

export default BrowseSearchResults;