import React from "react";
import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import CardMedia from "@material-ui/core/CardMedia";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import CameraAltOutlinedIcon from "@material-ui/icons/CameraAltOutlined";
import AddIcon from "@material-ui/icons/Add";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import "./MediaMovieItem";

const useStyles = makeStyles((theme) => ({
  root: { flexGrow: 1 },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
    justifyContent: "center",
    alignItems: "flex-end",
  },
})); // materialUI stuff

function MediaMovieItem({ movieIn }) {
  const history = useHistory();
  const classes = useStyles();
  const dispatch = useDispatch();
  const [showDetails, setShowDetails] = useState(false);

  const getMovieDetails = () => {
    dispatch({ type: "SET_TMDB_DETAILS", payload: "empty" });
    history.push(`/search/1/${movieIn.media_type}/${movieIn.tmdb_id}`);
  };

  const getMovieComparison = () => {
    dispatch({ type: "SET_FRAMEGRABS", payload: "empty" });
    history.push(`/compareVersions/${movieIn.tmdb_id}`);
  };

  let itemStyle = { height: "100%", width: "24%", padding: "20px 10px" };

  {
    return (
      <Grid item style={itemStyle}>
        <Paper className={classes.paper}>
          {
            <h4>
              <em>{movieIn.name}</em>{" "}
            </h4>
          }
          <CardMedia
            style={{ maxHeight: "95%", maxWidth: "95%", margin: "auto" }}
            className={movieIn.name}
            component="img"
            onDoubleClick={getMovieDetails}
            alt={movieIn.name}
            src={movieIn.cover_art}
            title={movieIn.name}
          />
          <br />
          <Button onClick={getMovieDetails}>
            <MoreHorizIcon />
          </Button>
          <Button onClick={getMovieComparison}>
            <CameraAltOutlinedIcon />
          </Button>
          <Button onClick={() => setShowDetails(!showDetails)}>
            <ExpandMoreIcon />
          </Button>
          {showDetails ? (
            <section>
              <p>
                <em>
                  ({movieIn.length} minutes,{" "}
                  <a href={`${movieIn.product_url}`}>website</a>)
                </em>{" "}
                {movieIn.description}
              </p>
            </section>
          ) : (
            ""
          )}
        </Paper>
      </Grid>
    );
  }
}

export default MediaMovieItem;
