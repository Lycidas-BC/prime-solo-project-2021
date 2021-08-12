import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from "@material-ui/core/styles";
import { useParams } from 'react-router-dom';
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import CardMedia from '@material-ui/core/CardMedia';
import './MediaItem';

const useStyles = makeStyles((theme) => ({root: {flexGrow: 1},paper: {padding: theme.spacing(2), width: "50%", textAlign: "center", color: theme.palette.text.secondary, justifyContent: "center", alignItems: "flex-end" }})); // materialUI stuff

function MediaItem() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { mediaId } = useParams();
  const mediaItemReducer = useSelector(store => store.mediaItemReducer);

  useEffect(() => {
    dispatch({ type: 'GET_MEDIA_ITEM_DETAILS', payload: {mediaId: mediaId} });
  }, []);

  console.log("mediaItemReducer", mediaItemReducer);
//   [
//     {
//         "id": 1,
//         "item": "Yojimbo/Sanjuro box set",
//         "distributor": "",
//         "product_page": null,
//         "format": "",
//         "cover_art": "https://s3.amazonaws.com/criterion-production/product_images/1833-4a969b083ea1f545f10fe7272f6660c0/W535Enjxkmy5elMh4mlvJwuwT2VHNT_large.jpg",
//         "description": "Thanks to perhaps the most indelible character in Akira Kurosawa’s oeuvre, Yojimbo surpassed even Seven Samurai in popularity when it was released. The masterless samurai Sanjuro, who slyly manipulates two warring clans to his own advantage in a small, dusty village, was so entertainingly embodied by the brilliant Toshiro Mifune that it was only a matter of time before he returned in a sequel. Made just one year later, Sanjuro matches Yojimbo’s storytelling dexterity yet adds layers of world-weary pragmatism that brings the two films to a thrilling and unforgettable conclusion. Criterion is proud to present these Kurosawa masterworks in new, high-definition digital transfers and Blu-ray editions.",
//         "dimensions": "",
//         "shelf": ""
//     }
// ]
//   {
//     "sqlMovieData": [
//         {
//             "movie_id": 1,
//             "name": "Yojimbo",
//             "tmdb_id": 11878,
//             "movie_or_tv": null
//         },
//         {
//             "movie_id": 2,
//             "name": "Sanjuro",
//             "tmdb_id": 11712,
//             "movie_or_tv": null
//         }
//     ],
//     "apiMovieData": [
//         {
//             "backdrop_path": "/zd7mu6dJKxkVtBdXqlEQ9W3msKl.jpg",
//             "belongs_to_collection": {
//                 "id": 627389,
//                 "name": "Sanjuro Collection",
//                 "poster_path": "/m0tDchfud5TslZXyCHO8NnEU2yr.jpg",
//                 "backdrop_path": "/ai4Q6RTjAxmEuD8NHB6d6Bkspp8.jpg"
//             },
//             "genres": [
//                 {
//                     "id": 18,
//                     "name": "Drama"
//                 },
//                 {
//                     "id": 53,
//                     "name": "Thriller"
//                 }
//             ],
//             "id": 11878,
//             "imdb_id": "tt0055630",
//             "original_language": "ja",
//             "original_title": "用心棒",
//             "overview": "A nameless ronin, or samurai with no master, enters a small village in feudal Japan where two rival businessmen are struggling for control of the local gambling trade. Taking the name Sanjuro Kuwabatake, the ronin convinces both silk merchant Tazaemon and sake merchant Tokuemon to hire him as a personal bodyguard, then artfully sets in motion a full-scale gang war between the two ambitious and unscrupulous men.",
//             "poster_path": "/tN7kYPjRhDolpui9sc9Eq9n5b2O.jpg",
//             "production_companies": [
//                 {
//                     "id": 882,
//                     "logo_path": "/fRSWWjquvzcHjACbtF53utZFIll.png",
//                     "name": "Toho Co.",
//                     "origin_country": "JP"
//                 }
//             ],
//             "production_countries": [
//                 {
//                     "iso_3166_1": "JP",
//                     "name": "Japan"
//                 }
//             ],
//             "release_date": "1961-04-25",
//             "runtime": 110,
//             "spoken_languages": [
//                 {
//                     "english_name": "Japanese",
//                     "iso_639_1": "ja",
//                     "name": "日本語"
//                 }
//             ],
//             "status": "Released",
//             "tagline": "Seven Samurai if it Was Just One Samurai!",
//             "title": "Yojimbo",
//             "credits": {
//                 "cast": [
//                     {
//                         "id": 7450,
//                         "known_for_department": "Acting",
//                         "name": "Toshirō Mifune",
//                         "original_name": "Toshirō Mifune",
//                         "popularity": 3.855,
//                         "profile_path": "/2GU6d2jm2J644FmYxxl4sbq52Bl.jpg",
//                         "cast_id": 1,
//                         "character": "Sanjuro Kuwabatake / The Samurai",
//                         "order": 0
//                     },
//                     {
//                         "id": 70131,
//                         "known_for_department": "Acting",
//                         "name": "Tatsuya Nakadai",
//                         "original_name": "Tatsuya Nakadai",
//                         "profile_path": "/2rx0P5YiINQvla6bsJoAyQKNOIz.jpg",
//                         "cast_id": 2,
//                         "character": "Unosuke, gunfighter",
//                         "order": 1
//                     }
//                 ],
//                 "crew": [
//                     {
//                         "id": 5026,
//                         "known_for_department": "Directing",
//                         "name": "Akira Kurosawa",
//                         "original_name": "Akira Kurosawa",
//                         "profile_path": "/uCFWmYXu0EqF5Bd6zWaOS4FxvEB.jpg",
//                         "department": "Writing",
//                         "job": "Screenplay"
//                     },
//                     {
//                         "id": 5026,
//                         "known_for_department": "Directing",
//                         "name": "Akira Kurosawa",
//                         "original_name": "Akira Kurosawa",
//                         "profile_path": "/uCFWmYXu0EqF5Bd6zWaOS4FxvEB.jpg",
//                         "department": "Directing",
//                         "job": "Director"
//                     }
//                 ]
//             },
//             "release_dates": {
//                 "results": [
//                     {
//                         "iso_3166_1": "US",
//                         "release_dates": [
//                             {
//                                 "certification": "NR",
//                                 "iso_639_1": "",
//                                 "note": "",
//                                 "release_date": "1961-09-13T00:00:00.000Z",
//                                 "type": 3
//                             },
//                             {
//                                 "certification": "NR",
//                                 "iso_639_1": "ja",
//                                 "note": "Home Vision #YOJ 020 (VHS)",
//                                 "release_date": "1999-01-01T00:00:00.000Z",
//                                 "type": 5
//                             }
//                         ]
//                     },
//                 ]
//             }
//         }
//     ],
//     "mediaSpecialFeatures": [
//         {
//             "description": "Documentaries on the making of Yojimbo and Sanjuro, created as part of the Toho Masterworks series Akira Kurosawa: It Is Wonderful to Create"
//         },
//         {
//             "description": "Audio commentaries by Kurosawa scholar Stephen Prince"
//         },
//         {
//             "description": "Stills galleries of behind-the-scenes photos"
//         },
//         {
//             "description": "Theatrical teasers and trailers"
//         },
//         {
//             "description": "Booklets featuring essays by film writers Alexander Sesonske and Michael Sragow and comments from Kurosawa and members of his cast and crew"
//         }
//     ]
// }
  return (
    <Grid item style={{height: "100%", width: "100%", padding: "20px 10px" }}>
      {mediaItemReducer === "empty" ? "" :
      <section>
        <Paper className={classes.paper}>
            <h2><em>{mediaItemReducer.mediaDetails.item}</em></h2>
        <CardMedia
        style={{maxHeight: "90%", maxWidth: "90%", margin: "auto"/*, padding: "10% 7% 10% 7%", backgroundImage: "url(images/frame.jpg)", backgroundRepeat: "no-repeat", backgroundSize: "100% 100%" */}}
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

      }
    </Grid>
  );
};

export default MediaItem;