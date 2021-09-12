import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import CardMedia from "@material-ui/core/CardMedia";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import SaveIcon from "@material-ui/icons/Save";
import Button from "@material-ui/core/Button";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import TextField from "@material-ui/core/TextField";
import "./FramegrabsAndComparisons";

//material-ui functions
const useStyles = makeStyles((theme) => ({
  button: {
    display: "block",
    marginTop: theme.spacing(2),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  root: {
    width: 500,
  },
  table: {
    minWidth: 700,
  },
}));

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

function BrowseSearchResults() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const { tmdbId } = useParams();
  const framegrabReducer = useSelector((store) => store.movieFramegrabs);
  const [showItemArt, setShowItemArt] = useState(false);
  const [showMovieArt, setShowMovieArt] = useState(false);
  const [showFramegrabs, setShowFramegrabs] = useState(false);
  const [addFramegrabSelector, setAddFramegrabSelector] = useState(-1);
  const [framegrabUrl, setFramegrabUrl] = useState("");
  const [framegrabHours, setFramegrabHours] = useState(0);
  const [framegrabMinutes, setFramegrabMinutes] = useState(0);
  const [framegrabSeconds, setFramegrabSeconds] = useState(0);
  const [framegrabDataArray, setFramegrabDataArray] = useState([]);

  useEffect(() => {
    dispatch({ type: "GET_MOVIE_FRAMEGRABS", payload: { tmdb_id: tmdbId } });
  }, []);

  const getMovieDetails = () => {
    dispatch({ type: "SET_TMDB_DETAILS", payload: "empty" });
    history.push(
      `/search/1/${framegrabReducer[0].content_type}/${framegrabReducer[0].tmdb_id}`
    );
  };

  const mediaDetailsScreen = (mediaId) => {
    history.push(`/media_details/${mediaId}`);
  };

  const uploadFramegrab = (media_movie_id) => {
    let timestamp =
      Number(framegrabHours) * 60 * 60 +
      Number(framegrabMinutes) * 60 +
      Number(framegrabSeconds);
    console.log(
      "timestamp",
      timestamp,
      framegrabHours,
      framegrabMinutes,
      framegrabSeconds
    );
    console.log("uploadFramegrab", framegrabUrl, timestamp, media_movie_id);
    dispatch({
      type: "ADD_MOVIE_FRAMEGRAB",
      payload: {
        media_movie_id: media_movie_id,
        path: framegrabUrl,
        timestamp: timestamp,
        tmdb_id: framegrabReducer[0].tmdb_id,
      },
    });
  };

  const toggleArt = (artType) => {
    console.log("media_movie_id", artType, showItemArt, showMovieArt);
    if (artType === "media" && showItemArt) {
      setShowItemArt(false);
      setShowMovieArt(false);
    } else if (artType === "movie" && showMovieArt) {
      setShowItemArt(false);
      setShowMovieArt(false);
    } else if (artType === "media" && !showItemArt) {
      setShowItemArt(true);
      setShowMovieArt(false);
    } else if (artType === "movie" && !showMovieArt) {
      setShowItemArt(false);
      setShowMovieArt(true);
    }
  };

  console.log("framegrabReducer", framegrabReducer);

  // format array of uniform objects containing all framegrabs sorted by timestamp
  const organizeFramegrabLists = () => {
    // make sure framegrabReducer isn't empty
    if (framegrabReducer === "empty") {
      return [];
    }

    //identify length of longest framegrab array
    let maxLength = -1;
    for (const movieObject of framegrabReducer) {
      maxLength =
        movieObject.framegrab_list.length > maxLength
          ? movieObject.framegrab_list.length
          : maxLength;
    }

    //combine arrays, construct uniform objects
    let combinedObjectArray = [];
    for (let i = 0; i < framegrabReducer.length; i++) {
      for (let j = 0; j < maxLength; j++) {
        if (
          j < framegrabReducer[i].framegrab_list.length &&
          framegrabReducer[i].framegrab_list[j] != null
        ) {
          combinedObjectArray.push({
            media_movie_id: framegrabReducer[i].media_movie_id,
            item: framegrabReducer[i].item,
            name: framegrabReducer[i].name,
            product_page: framegrabReducer[i].product_page,
            distributor: framegrabReducer[i].distributor,
            format: framegrabReducer[i].format,
            framegrab_url: framegrabReducer[i].framegrab_list[j].split(" ")[0],
            timestamp: framegrabReducer[i].framegrab_list[j].split(" ")[1],
            pretty_timestamp: `${new Date(
              Number(framegrabReducer[i].framegrab_list[j].split(" ")[1]) * 1000
            )
              .toISOString()
              .substr(11, 8)}`,
          });
        }
      }
    }

    // sort
    combinedObjectArray = combinedObjectArray.sort((a, b) =>
      a.timestamp > b.timestamp ? 1 : b.timestamp > a.timestamp ? -1 : 0
    );

    // write to framegrabDataArray state
    setFramegrabDataArray(combinedObjectArray);
    console.log(framegrabDataArray);
  };

  return (
    <>
      {framegrabReducer === "empty" ? (
        ""
      ) : (
        <section>
          <h1>
            <em>{framegrabReducer[0].name}</em>
            <Button style={{ marginLeft: "20px" }} onClick={getMovieDetails}>
              <MoreHorizIcon />
              Get Movie Details
            </Button>
            <Button
              style={{ marginLeft: "20px" }}
              onClick={() => toggleArt("media")}
            >
              {showItemArt ? "Hide media cover art" : "Show media cover art"}
            </Button>
            <Button
              style={{ marginLeft: "20px" }}
              onClick={() => toggleArt("movie")}
            >
              {showMovieArt ? "Hide media movie art" : "Show media movie art"}
            </Button>
            <Button
              style={{ marginLeft: "20px" }}
              onClick={() => {
                organizeFramegrabLists();
                setShowFramegrabs(!showFramegrabs);
              }}
            >
              {showFramegrabs ? "Hide framegrabs" : "Show framegrabs"}
            </Button>
          </h1>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="left">Edition title</StyledTableCell>
                  <StyledTableCell align="left">Distributor</StyledTableCell>
                  <StyledTableCell align="left">Format</StyledTableCell>
                  <StyledTableCell align="left">Length</StyledTableCell>
                  <StyledTableCell align="left">Add Framegrab?</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {framegrabReducer.map((element, index) => {
                  return (
                    <StyledTableRow key={index}>
                      <StyledTableCell align="left" width="300px">
                        <Button
                          onClick={() => mediaDetailsScreen(element.media_id)}
                        >
                          <MoreHorizIcon />
                        </Button>
                        {element.item}
                        {showItemArt ? (
                          <div>
                            <CardMedia
                              style={{ maxHeight: "80%", maxWidth: "80%" }}
                              className={element.item}
                              component="img"
                              alt={element.item}
                              src={element.media_cover_art}
                              title={element.item}
                            />
                          </div>
                        ) : showMovieArt ? (
                          <div>
                            <CardMedia
                              style={{ maxHeight: "80%", maxWidth: "80%" }}
                              className={element.item}
                              component="img"
                              alt={element.item}
                              src={element.media_movie_cover_art}
                              title={element.item}
                            />
                          </div>
                        ) : (
                          ""
                        )}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        <a href={element.product_page}>{element.distributor}</a>
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {element.format}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {`${new Date(Number(element.length) * 60 * 1000)
                          .toISOString()
                          .substr(11, 5)}`.replace(":", "h ")}
                        m
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {addFramegrabSelector === element.media_movie_id ? (
                          <section>
                            <div>
                              <Button
                                onClick={() => setAddFramegrabSelector(-1)}
                              >
                                <RemoveIcon />
                              </Button>
                              <Button
                                onClick={() =>
                                  uploadFramegrab(element.media_movie_id)
                                }
                              >
                                <SaveIcon />
                              </Button>
                            </div>
                            <div>
                              <TextField
                                style={{ width: "300px", marginBottom: "10px" }}
                                id={`framegrab_url_${index}`}
                                label="url"
                                variant="outlined"
                                value={framegrabUrl}
                                onChange={(event) =>
                                  setFramegrabUrl(event.target.value)
                                }
                              />
                            </div>
                            <div>
                              <TextField
                                style={{ width: "100px" }}
                                id={`framegrab_timestamp_h_${index}`}
                                label="hours"
                                variant="outlined"
                                value={framegrabHours}
                                onChange={(event) =>
                                  setFramegrabHours(Number(event.target.value))
                                }
                              />
                              <TextField
                                style={{ width: "100px" }}
                                id={`framegrab_timestamp_m_${index}`}
                                label="minutes"
                                variant="outlined"
                                value={framegrabMinutes}
                                onChange={(event) =>
                                  setFramegrabMinutes(
                                    Number(event.target.value)
                                  )
                                }
                              />
                              <TextField
                                style={{ width: "100px" }}
                                id={`framegrab_timestamp_s_${index}`}
                                label="seconds"
                                variant="outlined"
                                value={framegrabSeconds}
                                onChange={(event) =>
                                  setFramegrabSeconds(
                                    Number(event.target.value)
                                  )
                                }
                              />
                            </div>
                          </section>
                        ) : (
                          <Button
                            onClick={() => {
                              setAddFramegrabSelector(element.media_movie_id);
                              setFramegrabUrl("");
                            }}
                          >
                            <AddIcon />
                          </Button>
                        )}
                      </StyledTableCell>
                    </StyledTableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          {showFramegrabs ? (
            framegrabDataArray.length === 0 ? (
              <div>No associated framegrabs</div>
            ) : (
              <div>
                {framegrabDataArray.map((element, index) => {
                  return (
                    <section key={index} style={{ marginBottom: "25px" }}>
                      <img
                        src={element.framegrab_url}
                        style={{ maxWidth: "960", maxHeight: "530" }}
                      ></img>
                      <div>
                        ({element.distributor} {element.format}) {element.name}{" "}
                        from edition {element.name} at timestamp{" "}
                        {element.pretty_timestamp}
                      </div>
                    </section>
                  );
                })}
              </div>
            )
          ) : (
            ""
          )}
        </section>
      )}
    </>
  );
}

export default BrowseSearchResults;
