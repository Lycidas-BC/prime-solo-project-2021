import React from 'react';
import { useState, useEffect } from 'react';
import './AddMedia';
import AddIcon from '@material-ui/icons/Add';
import CancelIcon from '@material-ui/icons/Cancel';
import DeleteIcon from '@material-ui/icons/Delete';
import DoneIcon from '@material-ui/icons/Done';
import EditIcon from '@material-ui/icons/Edit';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import RemoveIcon from '@material-ui/icons/Remove';
import AddBoxIcon from '@material-ui/icons/AddBox';
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { useDispatch, useSelector } from 'react-redux';
import MovieItem from '../MovieItem/MovieItem';
import Checkbox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import SearchPage from '../SearchPage/SearchPage';

function AddMedia() {
  const [productUrl, setProductUrl] = useState("");
  const [addMovie, setAddMovie] = useState(false);
  const [displayProduct, setDisplayProduct] = useState(false);
  const dispatch = useDispatch();
  const webScrape = useSelector(store => store.webScrapeReducer);
  const [format, setFormat] = React.useState('DVD');
  const [boxSet, setBoxSet] = React.useState(false);
  const [coverArt, setCoverArt] = useState("");
  const [description, setDescription] = useState("");
  const [mediaMovies, setMediaMovies] = useState([]);

  const handleFormatChange = (event) => {
    setFormat(event.target.value);
  };

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

  const addResultToMedia = (item) => {
    setMediaMovies([...mediaMovies, item]);
    console.log('mediaMovies', mediaMovies);
  }

  console.log('webScrape', webScrape);
  return (
    <section style={{margin: "5%"}}>
    <TextField style={{ width: "400px" }} id="product-url" label="productUrl" type="productUrl" variant="outlined" value={productUrl} onChange={(event) => setProductUrl(event.target.value)}/>
    <Button style={{ width: "150px", height: "55px" }} variant="contained" color="primary" onClick={scrape}>Pull data from website</Button>
    {
      // check if we have a webscrape object
      webScrape !== "blank" ? 
        // identify type of webscrape object and render accordingly
        webScrape.type === "criterion set" ? 
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
          webScrape.type === "criterion film" ? 
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
      <div>
        <h2 className={"primaryTitle"}></h2>
        <section className={"format"}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Format</FormLabel>
            <RadioGroup aria-label="format" name="format" value={format} onChange={handleFormatChange} row>
              <FormControlLabel value="DVD" control={<Radio />} label="DVD" />
              <FormControlLabel value="Blu-ray" control={<Radio />} label="Blu-ray" />
              <FormControlLabel value="VHS" control={<Radio />} label="VHS" />
              <FormControlLabel value="Other" control={<Radio />} label="Other" />
            </RadioGroup>
          </FormControl>
          <FormGroup row>
          <FormControlLabel
            control={
              <Checkbox
                checked={boxSet}
                onChange={() => setBoxSet(!boxSet)}
                name="boxSet"
                color="primary"
              />
            }
            label="Box Set"
          />
          </FormGroup>
        </section>
        <section className={"coverArt"}>
          <h3>Cover Art</h3>
          <TextField style={{ width: "200px" }} id="coverArt" label="coverArt" type="coverArt" variant="outlined" value={coverArt} onChange={(event) => setCoverArt(event.target.value)}/>
          <Button onClick={() => addCoverArt}><AddIcon /></Button>
        </section>
        <section>
          <h3>Description</h3>
          <TextField style={{ width: "400px" }} id="description" label="description" type="description" variant="outlined" value={description} onChange={(event) => setDescription(event.target.value)}/>
        </section>
        <section>
          <h3>{boxSet ? "Movie List" : "Movie"}</h3>
          {
            addMovie ?
            <div>
            <div><Button onClick={() => setAddMovie(!addMovie)}><RemoveIcon /></Button></div>
            <SearchPage addResultToMedia={addResultToMedia}></SearchPage>
            </div> :
            <Button onClick={() => setAddMovie(!addMovie)}><AddIcon /></Button>
          }
        </section>
      </div>
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