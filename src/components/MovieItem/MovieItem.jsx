import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import CardMedia from "@material-ui/core/CardMedia";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import "./MovieItem";

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

function MovieItem({ movieIn, addMovieScreen, addMovieIcon }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [showDetails, setShowDetails] = useState(false);

  if (addMovieScreen) {
    movieIn = {
      cover_art: "/images/addImage.png",
    };
  }
  let itemStyle = { height: "100%", width: "24%", padding: "20px 10px" };
  if (addMovieIcon) {
    itemStyle = { height: "100%", width: "100%", padding: "20px 10px" };
  }

  console.log("movieItem", movieIn);
  return (
    <Grid item style={itemStyle}>
      <Paper className={classes.paper}>
        {addMovieScreen ? (
          ""
        ) : (
          <h2>
            <em>{movieIn.movie}</em> ({movieIn.year})
          </h2>
        )}
        <CardMedia
          style={{
            maxHeight: "95%",
            maxWidth: "95%",
            margin: "auto",
            padding: "5% 3% 5% 3%",
          }}
          className={movieIn.movie}
          component="img"
          alt={movieIn.movie}
          src={movieIn.cover_art}
          title={movieIn.movie}
        />
        <br />
        {addMovieScreen ? (
          ""
        ) : (
          <div>
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
          </div>
        )}
      </Paper>
    </Grid>
  );
}

export default MovieItem;
