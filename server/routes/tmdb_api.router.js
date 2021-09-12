const { default: axios } = require("axios");
const express = require("express");
const router = express.Router();
//use dotenv config to get API keys without uploading them to github
require("dotenv").config();

router.get("/configuration", (req, res) => {
  //doesn't change often; should only need to run once per session
  axios
    .get(
      `https://api.themoviedb.org/3/configuration?api_key=${process.env.TMDB_API_KEY}`
    )
    .then((response) => {
      res.send(response.data);
    })
    .catch((err) => {
      console.log(`error getting API configuration`, err);
      res.sendStatus(err);
    });
});

router.get("/details/:tmdbId", (req, res) => {
  const tmdbId = req.params.tmdbId;
  const searchType = req.query.searchType ? req.query.searchType : "movie";
  console.log("GET details from TMDB", tmdbId, searchType);

  axios
    .get(
      `https://api.themoviedb.org/3/${searchType}/${tmdbId}?api_key=${process.env.TMDB_API_KEY}&language=en-US&append_to_response=credits`
    )
    .then((response) => {
      console.log("GET details from API successful");
      let details = response.data;
      details.type = searchType;
      if (searchType === "person") {
        let tmdbIdList = [];
        const castList = details.credits.cast.map((element) => {
          return element.id;
        });
        const crewList = details.credits.crew.map((element) => {
          return element.id;
        });
        if (castList.length !== 0 || crewList.length !== 0) {
          tmdbIdList = tmdbIdList.concat(castList);
          tmdbIdList = tmdbIdList.concat(crewList);
          let uniqueTmdbIds = [...new Set(tmdbIdList)].join(",");
          details.tmdbIdList = uniqueTmdbIds;
        }
      } else {
        details.tmdbIdList = `${tmdbId}`;
      }
      res.send(details);
    })
    .catch((err) => {
      console.log(`error getting details from API`, err);
      res.sendStatus(err);
    });
});

router.get("/search", (req, res) => {
  console.log("in tmdb search");

  // What type of search? movie, tv, person, multi, keyword
  let searchType = req.query.type;
  // What are you searching for?
  let searchText = req.query.q;
  // Handle search result pagination
  let targetPage = req.query.page;

  axios
    .get(
      `https://api.themoviedb.org/3/search/${searchType}?api_key=${process.env.TMDB_API_KEY}&query=${searchText}&page=${targetPage}&include_adult=false`
    )
    .then((response) => {
      console.log("in search API", response.data.page);
      let searchResultObject = response.data;
      if (searchType === "movie" || searchType === "tv") {
        searchResultObject.results.map((element, index) => {
          element.media_type = searchType;
        });
      }

      res.status(201).send(searchResultObject);
    })
    .catch((err) => {
      console.log(`error performing ${searchType} search through API`, err);
      res.sendStatus(err);
    });
});

//attempt to find specific tmdb id using name and year
router.get("/searchSpecific", (req, res) => {
  console.log("in tmdb searchSpecific");

  // What type of search? movie, tv, person, multi, keyword
  let searchType = req.query.type;
  // name of movie I'm trying to find
  let searchText = req.query.q;
  // release year
  let year = req.query.year;
  // search result page
  let page = req.query.page;
  // initialize array to grab movies which match name and year
  let matchList = [];
  let mediaTypeList = [];

  axios
    .get(
      `https://api.themoviedb.org/3/search/${encodeURIComponent(
        searchType
      )}?api_key=${process.env.TMDB_API_KEY}&query=${encodeURIComponent(
        searchText
      )}&page=${encodeURIComponent(page)}&include_adult=false`
    )
    .then((response) => {
      console.log("searchSpecific API successful");
      let searchResultObject = response.data;
      if (searchType === "movie" || searchType === "tv") {
        searchResultObject.results.map((element, index) => {
          element.media_type = searchType;
        });
      }
      if (
        searchType === "movie" ||
        searchType === "tv" ||
        searchType === "multi"
      ) {
        let matches = searchResultObject.results.filter((element) => {
          if (element && element.release_date) {
            return element.release_date.indexOf(year) > -1;
          } else if (element && element.first_air_date) {
            return element.first_air_date.indexOf(year) > -1;
          }
        });
        for (const match of matches) {
          matchList.push(match.id);
          mediaTypeList.push(match.media_type);
        }
      }
      res
        .status(201)
        .send({
          tmdb_id: matchList,
          total_pages: searchResultObject.total_pages,
          mediaTypeList: mediaTypeList,
        });
    })
    .catch((err) => {
      console.log(`error searchSpecific through API`, err);
      res.sendStatus(err);
    });
});

router.get("/streamingOptions/:tmdbId", (req, res) => {
  const tmdbId = req.params.tmdbId;
  const tvOrMovie = req.query.tvOrMovie;
  console.log("GET streaming options from TMDB", tmdbId);

  axios
    .get(
      `https://api.themoviedb.org/3/${tvOrMovie}/${tmdbId}/watch/providers?api_key=${process.env.TMDB_API_KEY}`
    )
    .then((response) => {
      console.log(
        "GET streaming options from API successful",
        response.data.results.US
      );
      res.send(response.data.results.US);
    })
    .catch((err) => {
      console.log(`error getting streaming options from API`, err);
      res.sendStatus(err);
    });
});

module.exports = router;
