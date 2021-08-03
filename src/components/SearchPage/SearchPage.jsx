import React from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import SearchItem from '../SearchItem/SearchItem';
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';

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
    const [open, setOpen] = useState(false);
  
    const handleChange = (event) => {
        setSearchType(event.target.value);
    };
  
    const paginationNext = () => {
        dispatch({
            type: 'API_SEARCH',
            payload: {
                type: searchType,
                query: searchTerm,
                page: 'next'
            }
        })
    };

    const paginationPrevious = () => {
        dispatch({
            type: 'API_SEARCH',
            payload: {
                type: searchType,
                query: searchTerm,
                page: 'previous'
            }
        })
    };

    const search = () => {
        dispatch({
            type: 'API_SEARCH',
            payload: {
                type: searchType,
                query: searchTerm,
                page: 'newSearch'
            }
        });
    };
 
    console.log('searchObject:', searchObject);
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
                    <div key={index}><ul>
                        <li>{responseItem.title}</li>
                        <li>{responseItem.release_date}</li>
                        <li>{responseItem.overview}</li>
                    </ul></div>
                    // <SearchItem key={index} url={testItem.url} title={testItem.title} />
            );})}
            </Grid>
            <BottomNavigation style={{width: '100%', position: 'fixed', bottom: 0}}>
                <Button style={{ width: "150px", height: "55px" }} variant="contained" color="primary" onClick={paginationPrevious}>Previous Page</Button>
                <Button style={{ width: "150px", height: "55px" }} variant="contained" color="primary" onClick={paginationNext}>Next Page</Button>
            </BottomNavigation>
        </>
    );
};

export default SearchPage;