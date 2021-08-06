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
      $('.film-meta-list').find('li').each((_idx, el) => {
        console.log(_idx, 'html', $(el).html().trim());
        if ($($(el).find('span')).length > 0) {
          console.log('span text:', $($(el).find('span')).text().trim());
          console.log('span itemprop:', $($(el).find('span')).attr('itemprop'));
        }
        if ($($(el).find('meta')).length > 0) {
          console.log('meta text:', $($(el).find('meta')).text().trim());
          console.log('meta itemprop:', $($(el).find('meta')).attr('itemprop'));
          console.log('meta content:', $($(el).find('meta')).attr('content'));
        }
        // console.log(_idx, 'html', $(el).html().trim(), $($(el).find('span')).length, $($(el).find('meta')).length);
        const metaText = $(el).html().trim();
        metaList.push(metaText);
      });
      // console.log('ul', $('.product-features-list').find('ul'));
      $('.product-features-list').last().find('li').each((_idx, el) => {
        const featureText = $(el).text();
        featuresList.push(featureText);
      });
      // console.log('boxArt', boxArt);
      console.log('metaList', metaList);
      // console.log('featuresList', featuresList);
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