import React from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardActions from '@material-ui/core/CardActions';
import Modal from '@material-ui/core/Modal';

const useStyles = makeStyles((theme) => ({root: {flexGrow: 1},paper: {padding: theme.spacing(2), textAlign: "center", color: theme.palette.text.secondary}})); // materialUI stuff

function SearchItem(item) {
    const [searchItem, setSearchItem] = useState([]);
    const dispatch = useDispatch();
    const classes = useStyles();
    const [category, SetCategory] = useState(0)


    const postToFavorites = (itemToAdd) => {
        console.log('Adding to favorites', itemToAdd);
        if(category === 0) {
          alert('please pick a category')
        }
        if (category > 0) {  dispatch({
            type: 'ADD_FAVORITE',
            payload: {url: item.url, category_id: category}   
        });
      }
    };
  

    return (
      <>
        <Grid item style={{height: "520px" }} id={item.id}> 
        <Card>
          <Paper className={classes.paper}>
          <CardMedia
          className={item.title}
          style = {{ height: '350px'}}
          component="img"
          alt={item.title}
          src={item.url}
          title={item.title}
        />
            <br />
            <Button
              style={{ width: "180px", height: "42px" }}
              variant="contained"
              color="primary"
              onClick={() => postToFavorites(item)}
            >
              Add to Favorites
            </Button>
            <CardActions>
            <table>
              <tbody>
                <tr>
                  <td>Funny<input value='1' type="radio" name='category' onChange={(evt) => SetCategory(evt.target.value)} /><h4></h4></td>
                  <td>Cohort<input value='2' type="radio" name='category' onChange={(evt) => SetCategory(evt.target.value)} /><h4></h4></td>
                  <td>Cartoon<input value='3' type="radio" name='category' onChange={(evt) => SetCategory(evt.target.value)}/><h4></h4></td>
                  <td>NSFW<input value='4' type="radio" name='category' onChange={(evt) => SetCategory(evt.target.value)} /><h4></h4></td>
                  <td>MEME<input value='5' type="radio" name='category' onChange={(evt) => SetCategory(evt.target.value)}/><h4></h4></td>
                </tr>
              </tbody>
            </table>
            </CardActions>
          </Paper>
          </Card>
        </Grid>
        </>
    );
};

export default SearchItem;