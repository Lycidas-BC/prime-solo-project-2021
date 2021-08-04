import React from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import SearchItem from '../SearchItem/SearchItem';
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';

//material-ui functions
const useStyles = makeStyles((theme) => ({
    button: {
      display: 'block',
      marginTop: theme.spacing(2),
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    root: {
        width: 500,
        },
  }));

const searchTypeList = [
    {type: 'multi'},
    {type: 'movie'},
    {type: 'tv'},
    {type: 'person'},
    {type: 'keyword'}
];



function SearchPage() {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('multi');
    const searchObject = useSelector(store => store.tmdbSearchReducer);
    const configObject = useSelector(store => store.tmdbConfigReducer);
  
    const handleChange = (event) => {
        setSearchType(event.target.value);
    };
  
    const handlePageChange = (pageNavigation) => {
        console.log('***** pageNavigation *****',pageNavigation, searchType, searchTerm);
        console.log("page:", searchObject.page, "total pages:", searchObject.total_pages, "min:", Math.min(Number(searchObject.page)+1, Number(searchObject.total_pages)));
        console.log("page:", Number(searchObject.page), "total pages:", searchObject.total_pages, "min:", Math.min(Number(searchObject.page)+1, Number(searchObject.total_pages)));
        console.log("page:", searchObject.page, "total pages:", searchObject.total_pages, "max:", Math.max(Number(searchObject.page)-1, 1));
        
        let targetPage = (
            pageNavigation === "next" ? Math.min(Number(searchObject.page)+1, Number(searchObject.total_pages)) :
            pageNavigation === "previous" ? Math.max(Number(searchObject.page)-1, 1) :
            Number(searchObject.page)
        );
        dispatch({
            type: 'API_SEARCH',
            payload: {
                type: searchType,
                query: searchTerm,
                page: targetPage,
            }
        })
    };

    const search = () => {
        dispatch({
            type: 'API_SEARCH',
            payload: {
                type: searchType,
                query: searchTerm,
                page: 1
            }
        });
    };
 
    console.log('searchObject:', searchObject);
    console.log('searchType:', searchType);
    console.log('searchTerm:', searchTerm);
    console.log('configObject', configObject);
    return (
        <>
            <TextField style={{ width: "400px" }} id="outlined-search" label="Search" type="search" variant="outlined" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)}/>
            <Button style={{ width: "150px", height: "55px" }} variant="contained" color="primary" onClick={search}>Search</Button>
            <FormControl component="fieldset">
                <FormLabel component="legend">Search type</FormLabel>
                <RadioGroup row aria-label="searchType" name="searchType1" value={searchType} onChange={handleChange}>
                    {searchTypeList.map((element, index) => {
                        return (
                            <FormControlLabel key={index} value={element.type} control={<Radio />} label={element.type} />
                        )
                    })}
                </RadioGroup>
            </FormControl>
            <Grid container spacing={2}>
            {(searchObject.results).map((responseItem, index) => {
                return (
                    <div key={index}>
                        {responseItem.media_type === "movie" ? // check if item is a movie
                            (<ul>
                                <li>{responseItem.title}</li>
                                <li>{responseItem.release_date}</li>
                                <li>{responseItem.overview}</li>
                                <li><img src={`${configObject.images.base_url}${configObject.images.poster_sizes[2]}${responseItem.poster_path}`} alt={responseItem.title}/></li>
                            </ul>)
                        : responseItem.media_type === "tv" ? // check if item is a tv show
                            (<ul>
                                <li>{responseItem.name}</li>
                                <li>{responseItem.first_air_date}</li>
                                <li>{responseItem.overview}</li>
                                <li><img src={`${configObject.images.base_url}${configObject.images.poster_sizes[2]}${responseItem.poster_path}`} alt={responseItem.name}/></li>
                            </ul>)
                        : responseItem.gender !== undefined ? // check if item is a person
                        (<ul>
                            <li>{responseItem.name}</li>
                            <li>{responseItem.known_for_department}</li>
                            <li>
                                {responseItem.known_for.map((response, index) => {
                                    return (
                                        <img key={index} src={`${configObject.images.base_url}${configObject.images.poster_sizes[0]}${response.poster_path}`} alt={response.title}/>)
                                })}
                            </li>
                            <li><img src={`${configObject.images.base_url}${configObject.images.poster_sizes[2]}${responseItem.profile_path}`} alt={responseItem.title}/></li>
                        </ul>)
                        : (<ul>
                            <li>{responseItem.name}</li>
                            <li>{responseItem.id}</li>
                        </ul>)
                        }
                    </div>
                    // <SearchItem key={index} url={testItem.url} title={testItem.title} />
            );})}
            </Grid>
            <BottomNavigation 
                style={{width: '100%', position: 'fixed', bottom: 0}}
                showLabels
                className={classes.root}
                >
                <BottomNavigationAction disabled={Number(searchObject.page) === 1} label="previous" onClick={() => handlePageChange("previous")} icon={<NavigateBeforeIcon />} />
                <BottomNavigationAction disabled={searchObject.page === searchObject.total_pages} label="next" onClick={() => handlePageChange("next")} icon={<NavigateNextIcon />} />
            </BottomNavigation>
        </>
    );
};

export default SearchPage;