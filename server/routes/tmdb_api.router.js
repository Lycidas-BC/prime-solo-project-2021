const { default: axios } = require('axios');
const express = require('express');
const router = express.Router();
//use dotenv config to get API keys without uploading them to github
require('dotenv').config();
//initialize global
let resultsPage = 1;

router.get('/configuration', (req, res) => {
    //doesn't change often; should only need to run once per session
    axios.get(
        `https://api.themoviedb.org/3/configuration?api_key=${process.env.TMDB_API_KEY}`
    )
    .then(response => {
        console.log('in configuration API', response.data);
        res.send(response.data);
    })
    .catch(err => {
        console.log(`error getting API configuration`, err);
        res.sendStatus(err);
    })
})

router.get('/movieDetails/:tmdbId', (req, res) => {
    const tmdbId = req.params.tmdbId
    console.log('GET movie from TMDB', tmdbId);

    axios.get(
        `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${process.env.TMDB_API_KEY}&language=en-US&append_to_response=credits,release_dates`
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

router.post('/search', (req, res) => {
    console.log('in tmdb search', req.body);

    // What type of search? movie, tv, person, multi, keyword
    let searchType = encodeURIComponent(req.body.type);
    // What are you searching for?
    let searchText = encodeURIComponent(req.body.query);
    // Handle search result pagination
    switch (req.body.page) {
        case "next":
            // increment page
            resultsPage++;
            break;
        case "previous":
            // decrement page; make sure we don't fall below 1
            resultsPage = Math.max(1, resultsPage - 1)
            break;
        case "newSearch":
            // new search; reinitialize resultsPage
            resultsPage = 1;
            break;
        default:
            break;
    }

    axios.get(
        `https://api.themoviedb.org/3/search/${searchType}?api_key=${process.env.TMDB_API_KEY}&query=${searchText}&page=${resultsPage}&include_adult=false`
    )
    .then(response => {
        console.log('in search API', response.data);
        res.send(response.data);
    })
    .catch(err => {
        console.log(`error performing ${searchType} search through API`, err);
        res.sendStatus(err);
    })
})

router.get('/streamingOptions/:tmdbId', (req, res) => {
    const tmdbId = req.params.tmdbId
    console.log('GET streaming options from TMDB', tmdbId);

    axios.get(
        `https://api.themoviedb.org/3/movie/${tmdbId}/watch/providers?api_key=${process.env.TMDB_API_KEY}`
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