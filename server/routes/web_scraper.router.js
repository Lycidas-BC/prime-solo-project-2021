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

// get film length from film url
router.get('/scrapeLength', (req, res) => {
  const productUrl = String(decodeURIComponent(req.query.productUrl));
  if (isValidHttpUrl(productUrl)) {
    axios.get(
      `${productUrl}`
    )
    .then(response => {
      const $ = cheerio.load(response.data);
      let length = -1;
      $('.film-meta-list').find('li').each((_idx, el) => {
        if ($($(el).find('meta')).length > 0) {
           if ($($(el).find('meta')).attr('itemprop') === "duration"){
            length = $(el).text();
            length = length.substring(0,length.indexOf(" "));
            console.log("length", length);
          } 
        }
      });
      console.log(length);
      res.status(201).send(length);

    })
    .catch(err => {
      console.log(`error scraping product information from website`, err);
      res.sendStatus(err);    })
  } else {
    res.status(400).send('Not a valid HTTP or HTTPS url');
  }
})

//scrape data from Criterion film page
const scrapeCriterionFilmData = (siteHtml, productUrl) => {
  const $ = cheerio.load(siteHtml);
  const item = $('.header__primarytitle').text();
  const cover_art = $($('.product-box-art').children('img')[0]).attr('src');
  const description = $($('.product-summary').children('p')[0]).text();
  let year = "";
  let length = -1;
  const featuresList = [];
  $('.film-meta-list').find('li').each((_idx, el) => {
    if ($($(el).find('meta')).length > 0) {
      if ($($(el).find('meta')).attr('itemprop') === "datePublished"){
        year = $(el).text();
      } else if ($($(el).find('meta')).attr('itemprop') === "duration"){
        length = $(el).text();
        length = length.substring(0,length.indexOf(" "));
      } 
    }
  });
  // console.log('ul', $('.product-features-list').find('ul'));
  $('.product-features-list').last().find('li').each((_idx, el) => {
    const featureText = $(el).text();
    featuresList.push(featureText);
  });
  // console.log('cover_art', cover_art);
  // console.log('metaList', metaList);
  // console.log('featuresList', featuresList);
  const filmScrapeObject = {
    type: "film",
    distributor: "Criterion Collection",
    format: "Blu-ray",
    dimensions: "",
    shelf: "",
    item: item,
    description: description,
    cover_art: cover_art,
    movieList: [{
      movie: item,
      year: year,
      length: length,
      cover_art: cover_art,
      description: description,
      product_url: productUrl
    }],
    featuresList: featuresList,
  }
  return filmScrapeObject;
}

//scrape data from Criterion box set page
const scrapeCriterionSetData = (siteHtml) => {
  const $ = cheerio.load(siteHtml);
  const item = $('.header__primarytitle').text();
  const cover_art = $($('.product-box-art').children('img')[0]).attr('src');
  const description = $($('.product-summary').children('p')[0]).text();
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
    const cover_art = $($(el).find('img')).attr('src');
    const description = $($(el).find('.film-set-descrip')).text().trim();
    const product_url = $($(el).parents()).attr('href');

    movieList.push({
      movie: movie,
      year: year,
      length: -1,
      cover_art: cover_art,
      description: description,
      product_url: product_url
    });
  });
  
  const setScrapeObject = {
    type: "set",
    item: item,
    distributor: "Criterion Collection",
    format: "Blu-ray",
    dimensions: "",
    shelf: "",
    description: description,
    movieList: movieList,
    cover_art: cover_art,
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
          res.status(201).send(scrapeCriterionFilmData(response.data, productUrl));
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