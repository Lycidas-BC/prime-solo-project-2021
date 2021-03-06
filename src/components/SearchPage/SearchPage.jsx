import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import SearchItem from '../SearchItem/SearchItem';
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import SearchItem from "../SearchItem/SearchItem";

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
}));

//supported types for typeList
// const typeList = [
//'multi'
//'movie'
//'tv'
//'person'
//'keyword'
// ];

function SearchPage({ addResultToMedia, typeList, genericSearch }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("multi");
  const searchObject = useSelector((store) => store.tmdbSearchReducer);

  const handleChange = (event) => {
    setSearchType(event.target.value);
  };

  const handlePageChange = (pageNavigation) => {
    console.log(
      "***** pageNavigation *****",
      pageNavigation,
      searchType,
      searchTerm
    );
    console.log(
      "page:",
      searchObject.page,
      "total pages:",
      searchObject.total_pages,
      "min:",
      Math.min(Number(searchObject.page) + 1, Number(searchObject.total_pages))
    );
    console.log(
      "page:",
      Number(searchObject.page),
      "total pages:",
      searchObject.total_pages,
      "min:",
      Math.min(Number(searchObject.page) + 1, Number(searchObject.total_pages))
    );
    console.log(
      "page:",
      searchObject.page,
      "total pages:",
      searchObject.total_pages,
      "max:",
      Math.max(Number(searchObject.page) - 1, 1)
    );

    let targetPage =
      pageNavigation === "next"
        ? Math.min(
            Number(searchObject.page) + 1,
            Number(searchObject.total_pages)
          )
        : pageNavigation === "previous"
        ? Math.max(Number(searchObject.page) - 1, 1)
        : Number(searchObject.page);
    dispatch({
      type: "API_SEARCH",
      payload: {
        type: searchType,
        query: searchTerm,
        page: targetPage,
      },
    });
  };

  const search = () => {
    dispatch({
      type: "API_SEARCH",
      payload: {
        type: searchType,
        query: searchTerm,
        page: 1,
      },
    });
  };

  console.log("searchObject:", searchObject);
  console.log("searchType:", searchType);
  console.log("searchTerm:", searchTerm);
  return (
    <>
      <TextField
        style={{ width: "400px" }}
        id="outlined-search"
        label="Search"
        type="search"
        variant="outlined"
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
      />
      <FormControl component="fieldset">
        <FormLabel component="legend">Search type</FormLabel>
        <RadioGroup
          row
          aria-label="searchType"
          name="searchType1"
          value={searchType}
          onChange={handleChange}
        >
          {typeList.map((element, index) => {
            return (
              <FormControlLabel
                key={index}
                value={element}
                control={<Radio />}
                label={element}
              />
            );
          })}
        </RadioGroup>
      </FormControl>
      <Button
        style={{ width: "150px", height: "55px" }}
        variant="contained"
        color="primary"
        onClick={search}
      >
        Search
      </Button>
      <Grid container spacing={2} style={{ alignItems: "flex-end" }}>
        {searchObject.results.map((responseItem, index) => {
          return (
            <SearchItem
              key={index}
              responseItem={responseItem}
              addResultToMedia={addResultToMedia}
              genericSearch={genericSearch}
            ></SearchItem>
          );
        })}
      </Grid>
      <BottomNavigation
        style={{ width: "100%", position: "fixed", bottom: 0 }}
        showLabels
        className={classes.root}
      >
        <BottomNavigationAction
          disabled={Number(searchObject.page) === 1}
          label="previous"
          onClick={() => handlePageChange("previous")}
          icon={<NavigateBeforeIcon />}
        />
        <BottomNavigationAction
          disabled={searchObject.page === searchObject.total_pages}
          label="next"
          onClick={() => handlePageChange("next")}
          icon={<NavigateNextIcon />}
        />
      </BottomNavigation>
    </>
  );
}

export default SearchPage;
