import React from 'react';
import { useState, useEffect } from 'react';
import './AddMedia';
import AddBoxIcon from '@material-ui/icons/AddBox';
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { useDispatch, useSelector } from 'react-redux';
import MovieItem from '../MovieItem/MovieItem';

function AddMedia() {
  const [productUrl, setProductUrl] = useState([]);
  const [addItemToMedia, setAddItemToMedia] = useState(false);
  const [displayProduct, setDisplayProduct] = useState(false);
  const dispatch = useDispatch();
  const webScrape = useSelector(store => store.webScrapeReducer);
  
  // box set urls for testing
  // https://www.criterion.com/boxsets/2648-godzilla-the-showa-era-films-1954-1975
  // https://www.criterion.com/boxsets/1427-ingmar-bergman-s-cinema
  // https://www.criterion.com/boxsets/4117-world-of-wong-kar-wai
  // https://www.criterion.com/boxsets/1554-police-story-police-story-2
  // https://www.criterion.com/boxsets/3432-the-complete-films-of-agn-s-varda
  // https://www.criterion.com/boxsets/825-eclipse-series-28-the-warped-world-of-koreyoshi-kurahara

  // movie urls for testing
  // https://www.criterion.com/films/29081-after-life
  // https://www.criterion.com/films/27755-godzilla
  const scrape = () => {
    dispatch({
      type: 'SCRAPE_WEBSITE',
      payload: {productUrl: productUrl}
  });

  };

  console.log('webScrape', webScrape);
  return (
    <section style={{margin: "5%"}}>
    <TextField style={{ width: "400px" }} id="product-url" label="productUrl" type="productUrl" variant="outlined" value={productUrl} onChange={(event) => setProductUrl(event.target.value)}/>
    <Button style={{ width: "150px", height: "55px" }} variant="contained" color="primary" onClick={scrape}>Pull data from website</Button>
    {
      // check if we have a webscrape object
      webScrape !== "blank" ? 
        // identify type of webscrape object and render accordingly
        webScrape.type = "criterion set" ? 
          // object is a Criterion box set
          <div>
            <h2 className={"primaryTitle"}>{webScrape.primaryTitle}</h2>
            <section className={"coverArt"}>
              <img src={webScrape.boxArt} alt={webScrape.primaryTitle} width="500" height="600"></img>
            </section>
            <section>
              <p>{webScrape.productSummary}</p>
            </section>
            <section className="movies" style={{ alignItems: "flex-end", display : "flex", flexWrap: "wrap" }}>
              {webScrape.movieList.map((element,index) => {
                return (
                  <MovieItem key={index} movieIn={element} addMovieScreen={false} ></MovieItem>
                )
              })}
              <MovieItem movieIn={"none"} addMovieScreen={true} ></MovieItem>
            </section>
            <section className={"specialFeatures"}>
              <h3>Special Features</h3>
              <ul>
                {webScrape.featuresList.map((element, index) => {
                  return (
                    <li key={index}>{element}</li>
                  )
                })}
              </ul>
            </section>
          </div> :
          webScrape.type = "criterion film" ? 
          // object is a Criterion film
          <div>
            <h2 className={"primaryTitle"}>{webScrape.primaryTitle}</h2>
            <section className={"coverArt"}>
              <img src={webScrape.boxArt} alt={webScrape.primaryTitle} width="500" height="600"></img>
            </section>
            <section>
              <p>{webScrape.productSummary}</p>
            </section>
            <section className={"specialFeatures"}>
              <h3>Special Features</h3>
              <ul>
                {webScrape.featuresList.map((element, index) => {
                  return (
                    <li key={index}>{element}</li>
                  )
                })}
              </ul>
            </section>
          </div> :
        // object is neither a criterion box set nor a criterion film
        <div></div> :
      //object is blank
      <div></div>
    }
    {/* <div>
      <button onClick={() => setAddItemToMedia(!addItemToMedia)}>
        {addItemToMedia ?
        <span><AddBoxIcon />Adding Item</span>:
        <AddBoxIcon />}
      </button>
    </div> */}
    </section>
  );
};

export default AddMedia;