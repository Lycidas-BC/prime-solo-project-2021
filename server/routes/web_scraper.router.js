const { default: axios } = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const router = express.Router();
//use dotenv config to get API keys without uploading them to github
require('dotenv').config();

// validate url
const isValidHttpUrl = (string) => {
  let url;
  
  try {
    url = new URL(string);
  } catch (_) {
    return false;  
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

//scrape data from Criterion film page
const scrapeCriterionFilmData = (siteHtml) => {
  const $ = cheerio.load(siteHtml);
  const primaryTitle = $('.header__primarytitle').text();
  const boxArt = $($('.product-box-art').children('img')[0]).attr('src');
  const productSummary = $($('.product-summary').children('p')[0]).text();
  const metaList = [];
  const featuresList = [];
  $('.film-meta-list').find('li').each((_idx, el) => {
    // console.log(_idx, 'html', $(el).html().trim());
    // initialize array to collect data from film-met-list
    const elementArray = [];

    elementArray.push(_idx);
    if ($(el).attr('itemtype') !== undefined) {
      elementArray.push($(el).attr('itemtype'))
    }
    if ($($(el).find('span')).length > 0) {
      elementArray.push($($(el).find('span')).attr('itemprop'));
      elementArray.push($($(el).find('span')).text().trim());
    }
    if ($($(el).find('meta')).length > 0) {
      elementArray.push($($(el).find('meta')).attr('itemprop'));
      elementArray.push($(el).text());
    }
    if ($($(el).find('b')).length > 0) {
      elementArray.push($($(el).find('b')).html().trim());
    }
    if ($(el).children().length === 0) {
      elementArray.push($(el).html().trim());
    }
    metaList.push(elementArray);
  });
  // console.log('ul', $('.product-features-list').find('ul'));
  $('.product-features-list').last().find('li').each((_idx, el) => {
    const featureText = $(el).text();
    featuresList.push(featureText);
  });
  // console.log('boxArt', boxArt);
  // console.log('metaList', metaList);
  // console.log('featuresList', featuresList);
  const filmScrapeObject = {
    type: "criterion film",
    primaryTitle: primaryTitle,
    productSummary: productSummary,
    boxArt: boxArt,
    metaList: metaList,
    featuresList: featuresList,
  }
  return filmScrapeObject;
}

//scrape data from Criterion box set page
const scrapeCriterionSetData = (siteHtml) => {
  const $ = cheerio.load(siteHtml);
  const primaryTitle = $('.header__primarytitle').text();
  const boxArt = $($('.product-box-art').children('img')[0]).attr('src');
  const productSummary = $($('.product-summary').children('p')[0]).text();
  const movieList = [];
  const metaList = [];
  const featuresList = [];
  $('.film-meta-list').find('li').each((_idx, el) => {
    // console.log(_idx, 'html', $(el).html().trim());
    const elementArray = [];

    elementArray.push(_idx);
    if ($(el).attr('itemtype') !== undefined) {
      elementArray.push($(el).attr('itemtype'))
    }
    if ($($(el).find('span')).length > 0) {
      elementArray.push($($(el).find('span')).attr('itemprop'));
      elementArray.push($($(el).find('span')).text().trim());
    }
    if ($($(el).find('meta')).length > 0) {
      elementArray.push($($(el).find('meta')).attr('itemprop'));
      elementArray.push($(el).text());
    }
    if ($($(el).find('b')).length > 0) {
      elementArray.push($($(el).find('b')).html().trim());
    }
    if ($(el).children().length === 0) {
      elementArray.push($(el).html().trim());
    }
    metaList.push(elementArray);
  });
  // console.log('ul', $('.product-features-list').find('ul'));
  $('.product-features').last().find('li').each((_idx, el) => {
    const featureText = $(el).text();
    featuresList.push(featureText);
  });
  $('.film-setlist').last().find('li').each((_idx, el) => {
    const movie = $($(el).find('.film-set-title')).text();
    const year = $($(el).find('.film-set-year')).text();
    const image = $($(el).find('img')).attr('src');
    const description = $($(el).find('.film-set-descrip')).text();
    const url = $($(el).parents()).attr('href');


    movieList.push({
      movie: movie,
      year: year,
      image: image,
      description: description,
      url: url
    });
  });
  
  // console.log('boxArt', boxArt);
  // console.log('metaList', metaList);
  // console.log('featuresList', featuresList);
  // console.log('movieList', movieList);
  const setScrapeObject = {
    type: "criterion set",
    primaryTitle: primaryTitle,
    productSummary: productSummary,
    movieList: movieList,
    boxArt: boxArt,
    metaList: metaList,
    featuresList: featuresList,
  }

  return setScrapeObject;
}

router.get('/scrapeProductPage', (req, res) => {
  const productUrl = String(decodeURIComponent(req.query.productUrl));
  if (isValidHttpUrl(productUrl)) {
    axios.get(
      `${productUrl}`
    )
    .then(response => {
      if (productUrl.toLowerCase().includes('criterion.com')) {
        if (productUrl.toLowerCase().includes('/films/')) {
          res.status(201).send(scrapeCriterionFilmData(response.data));
        } else if (productUrl.toLowerCase().includes('/boxsets/')) {
          res.status(201).send(scrapeCriterionSetData(response.data));
        } else {
          res.status(400).send("Send me that link and I'll try to figure out why it didn't work");
        }
      } else {
        res.status(400).send("web scraping only enabled for certain distributors");
      }
    })
    .catch(err => {
        console.log(`error scraping product information from website`, err);
        res.sendStatus(err);
    })
  } else {
    res.status(400).send('Not a valid HTTP or HTTPS url');
  }
})

module.exports = router;