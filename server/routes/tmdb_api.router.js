const { default: axios } = require('axios');
const express = require('express');
const router = express.Router();
//use dotenv config to get API keys without uploading them to github
require('dotenv').config();

router.get('/configuration', (req, res) => {
    //doesn't change often; should only need to run once per session
    axios.get(
        `https://api.themoviedb.org/3/configuration?api_key=${process.env.TMDB_API_KEY}`
    )
    .then(response => {
        res.send(response.data);
    })
    .catch(err => {
        console.log(`error getting API configuration`, err);
        res.sendStatus(err);
    })
})

router.get('/movieDetails/:tmdbId', (req, res) => {
    const tmdbId = req.params.tmdbId;
    const tvOrMovie = req.query.tvOrMovie;
    console.log('GET movie from TMDB', tmdbId);

    axios.get(
        `https://api.themoviedb.org/3/${tvOrMovie}/${tmdbId}?api_key=${process.env.TMDB_API_KEY}&language=en-US&append_to_response=${tvOrMovie==="movie" ? "credits,release_dates" : "credits"}`
    )
    .then(response => {
        console.log('GET movie details from API successful', response.data);
        res.send(response.data);
    })
    .catch(err => {
        console.log(`error getting movie details from API`, err);
        res.sendStatus(err);
    })
})

router.get('/search', (req, res) => {
    console.log('in tmdb search', req.query);

    // What type of search? movie, tv, person, multi, keyword
    let searchType = req.query.type;
    // What are you searching for?
    let searchText = req.query.q;
    // Handle search result pagination
    let targetPage = req.query.page;

    axios.get(
        `https://api.themoviedb.org/3/search/${searchType}?api_key=${process.env.TMDB_API_KEY}&query=${searchText}&page=${targetPage}&include_adult=false`
    )
    .then(response => {
        console.log('in search API', response.data.page);
        let searchResultObject = response.data;
        if (searchType === 'movie' || searchType === 'tv') {
            searchResultObject.results.map((element, index) => {
                element.media_type = searchType
            });
        }
        res.send(response.data);
    })
    .catch(err => {
        console.log(`error performing ${searchType} search through API`, err);
        res.sendStatus(err);
    })
})

router.get('/streamingOptions/:tmdbId', (req, res) => {
    const tmdbId = req.params.tmdbId;
    const tvOrMovie = req.query.tvOrMovie;
    console.log('GET streaming options from TMDB', tmdbId);

    axios.get(
        `https://api.themoviedb.org/3/${tvOrMovie}/${tmdbId}/watch/providers?api_key=${process.env.TMDB_API_KEY}`
    )
    .then(response => {
        console.log('GET streaming options from API successful', response.data.results.US);
        res.send(response.data.results.US);
    })
    .catch(err => {
        console.log(`error getting streaming options from API`, err);
        res.sendStatus(err);
    })
})

module.exports = router;