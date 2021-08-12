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
import { TrendingUpOutlined } from '@material-ui/icons';

function AddMedia() {
  const [productUrl, setProductUrl] = useState("");
  const [addMovie, setAddMovie] = useState(false);
  const [addFeature, setAddFeature] = useState(false);
  const [editArt, setEditArt] = useState(true);
  const [editTitle, setEditTitle] = useState(true);
  const [editDescription, setEditDescription] = useState(true);
  const [displayWarning, setDisplayWarning] = useState(false);
  const dispatch = useDispatch();
  const configObject = useSelector(store => store.tmdbConfigReducer);
  const webScrape = useSelector(store => store.webScrapeReducer);
  const [format, setFormat] = useState('DVD');
  const [boxSet, setBoxSet] = useState(false);
  const [title, setTitle] = useState("");
  const [coverArt, setCoverArt] = useState("");
  const [description, setDescription] = useState("");
  const [newFeature, setNewFeature] = useState("");
  const [mediaItem, setMediaItem] = useState({
    item: "",
    distributor: "",
    format: "",
    cover_art: "",
    description: "",
    dimensions: "",
    shelf: "",
    movieList: [],
    specialFeatureList: []
  });

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

  const updateTitle = () => {
    setEditTitle(false);
    setMediaItem({...mediaItem, item: title});
  }
  const updateCoverArt = () => {
    setEditArt(false);
    setMediaItem({...mediaItem, cover_art: coverArt});
  }
  const updateDescription = () => {
    setEditDescription(false);
    setMediaItem({...mediaItem, description: description});
  }

  const addResultToMedia = (apiObject) => {
    let convertApiObject = {};
    console.log("apiObject", apiObject);
    if (apiObject.media_type === "movie") {
      convertApiObject = {
        movie: apiObject.title,
        year: apiObject.release_date.substring(0,4),
        cover_art: `${configObject.images.base_url}${configObject.images.poster_sizes[2]}${apiObject.poster_path}`,
        description: apiObject.overview,
        tmdb_id: apiObject.id,
        letterboxd_url: "",
        imdb_url: "",
        rottentomatoes_url: "",
        amazon_url: ""
      };
    } else {
      convertApiObject = {
        movie: apiObject.name,
        year: apiObject.first_air_date.substring(0,4),
        cover_art: `${configObject.images.base_url}${configObject.images.poster_sizes[2]}${apiObject.poster_path}`,
        description: apiObject.overview,
        tmdb_id: apiObject.id,
        letterboxd_url: "",
        imdb_url: "",
        rottentomatoes_url: "",
        amazon_url: ""
      };
    }
    setMediaItem({...mediaItem, movieList: [...mediaItem.movieList, convertApiObject]});
    setAddMovie(false);
  }

  const addFeatureToList = () => {
    setMediaItem({...mediaItem, specialFeatureList: [...mediaItem.specialFeatureList, newFeature]});
    setNewFeature("");
    setAddFeature(false);
  }
    
  const addToCollection = () => {
    const localFormat = (boxSet ? `${format} box`: `${format}`);
    setMediaItem({...mediaItem, format: localFormat});
    console.log("mediaItem", mediaItem);
    if (mediaItem.item !== "" && mediaItem.movieList.length !== 0) {
      dispatch({
        type: 'ADD_MEDIA_ITEM',
        payload: mediaItem
      });
    } else {
      setDisplayWarning(true);
    }
  }

  console.log('webScrape', webScrape);
  return (
    <section style={{margin: "5%"}} onMouseMove={() => setDisplayWarning(false)}>
      <div style={{color: "red"}}>
        <Button style={{ width: "150px", height: "55px", marginBottom: "20px" }} variant="contained" color="primary" onClick={addToCollection}>Add to collection</Button>
        {displayWarning ? "please complete the required fields" : ""}
      </div>
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
        <section className={"title"}>
          {
            editTitle ?
            <div>
              <h3>Title</h3>
              <TextField style={{ width: "200px" }} id="title" label="title" type="title" variant="outlined" value={title} onChange={(event) => setTitle(event.target.value)}/>
              <Button onClick={() => updateTitle()}><DoneIcon /></Button>
            </div> :
            <h3>{title} <Button onClick={() => setEditTitle(true)}><EditIcon /></Button></h3>
          }
        </section>
        <section className={"coverArt"}>
          <h3>Cover Art</h3>
          {
            editArt ?
            <div>
              <TextField style={{ width: "200px" }} id="coverArt" label="cover art" type="coverArt" variant="outlined" value={coverArt} onChange={(event) => setCoverArt(event.target.value)}/>
              <Button onClick={() => updateCoverArt()}><AddIcon /></Button>
            </div> :
            <div>
              <img src={coverArt} alt={`${title} cover`} width="500" height="600"/>
              <Button onClick={() => setEditArt(true)}><EditIcon /></Button>
            </div>
          }
        </section>
        <section>
          <h3>Description</h3>
          {
            editDescription ?
            <div>
              <TextField style={{ width: "400px" }} multiline id="description" label="description" type="description" variant="outlined" value={description} onChange={(event) => setDescription(event.target.value)}/>
              <Button onClick={() => updateDescription()}><DoneIcon /></Button>
            </div>:
            <p>{description}<Button onClick={() => setEditDescription(true)}><EditIcon /></Button></p>
          }
        </section>
        <section>
          <h3>{boxSet ? "Movie List" : "Movie"}</h3>
          <section className="movies" style={{ alignItems: "flex-end", display : "flex", flexWrap: "wrap" }}>
            {mediaItem.movieList.map((element,index) => {
              return (
                <MovieItem key={index} movieIn={element} addMovieScreen={false} ></MovieItem>
              )
            })}
            
          </section>
          {
            addMovie ?
            <div>
            <div><Button onClick={() => setAddMovie(!addMovie)}><RemoveIcon /></Button></div>
            <SearchPage addResultToMedia={addResultToMedia} typeList={['movie', 'tv']} genericSearch={false}></SearchPage>
            </div> :
            <Button style={{ width: "24%", height: "24%" }} onClick={() => setAddMovie(!addMovie)}><MovieItem movieIn={"none"} addMovieScreen={true} addMovieIcon={true}></MovieItem></Button>
          }
        </section>
        <section className="specialFeatures" >
          <h3>Special Features</h3>
            <ul>
            {mediaItem.specialFeatureList.map((feature,index) => {
              return (
                <li>{feature}</li>
              )
            })}
          {
            addFeature ?
            <li>
              <div><Button onClick={() => setAddFeature(!addFeature)}><RemoveIcon /></Button></div>
              <TextField style={{ width: "400px" }} id="specialFeatureDescription" label="description" type="specialFeatureDescription" variant="outlined" value={newFeature} onChange={(event) => setNewFeature(event.target.value)}/>
              <Button onClick={() => addFeatureToList()}><DoneIcon /></Button>
            </li> :
            <li><Button style={{ width: "24%", height: "24%" }} onClick={() => setAddFeature(!addFeature)}><AddIcon /></Button></li>
          }
          </ul>
        </section>
      </div>
    }
    </section>
  );
};

export default AddMedia;