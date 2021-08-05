const { default: axios } = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const router = express.Router();
//use dotenv config to get API keys without uploading them to github
require('dotenv').config();


router.get('/test', (req, res) => {
    //doesn't change often; should only need to run once per session
    axios.get(
        `https://www.criterion.com/films/29144-blue-velvet`
    )
    .then(response => {
      const $ = cheerio.load(response.data);
      const boxArt = $($('.product-box-art').children('img')[0]).attr('src');
      const metaList = [];
      const featuresList = [];
      $('.film-meta-list').children().each((_idx, el) => {
        const metaText = $(el).html().trim();
        metaList.push(metaText);
      });
      $('.product-features-list').children().each((_idx, el) => {
        const featureText = $(el).text();
        featuresList.push(featureText);
      });
      console.log('boxArt', boxArt);
      console.log('metaList', metaList);
      console.log('featuresList', featuresList);
      const webScrapeObject = {
        boxArt: boxArt,
        metaList: metaList,
        featuresList: featuresList,
      }
      res.status(201).send(webScrapeObject);
    })
    .catch(err => {
        console.log(`error getting API configuration`, err);
        res.sendStatus(err);
    })
})

module.exports = router;