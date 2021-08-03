const { default: axios } = require('axios');
const express = require('express');
const router = express.Router();
//use dotenv config to get API keys without uploading them to github
require('dotenv').config();

let resultsPage = 1;

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

module.exports = router;