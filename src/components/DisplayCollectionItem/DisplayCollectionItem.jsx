import React, { useState } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import AddIcon from '@material-ui/icons/Add';
import CancelIcon from '@material-ui/icons/Cancel';
import DeleteIcon from '@material-ui/icons/Delete';
import DoneIcon from '@material-ui/icons/Done';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import CardMedia from '@material-ui/core/CardMedia';
import './DisplayCollectionItem';

const useStyles = makeStyles((theme) => ({root: {flexGrow: 1},paper: {padding: theme.spacing(2), textAlign: "center", color: theme.palette.text.secondary, justifyContent: "center", alignItems: "flex-end" }})); // materialUI stuff

function DisplayCollectionItem({mediaIn, addMedia}) {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [showDetails, setShowDetails] = useState(false);


    if (addMedia) {
      mediaIn = {
        item: "New media",
        distributor: "distributor",
        format: "format",
        shelf: "shelf",
        cover_art: "/images/addImage.png"
      }
    }

    const addItem = () => {
      console.log('in addItem');
      history.push(`/add_media`);
    };
    
    const deleteItem = () => {
      console.log('in deleteItem');
      console.log("mediaIn.id", mediaIn.id);
      setConfirmDelete(false);
      dispatch({ type: 'DELETE_MEDIA_ITEM', payload: {media_id: mediaIn.id} });
    };
    const itemDetails = () => {
      console.log('in itemDetails');
      history.push(`/media_details/${mediaIn.id}`);
    };


    return (
        <Grid item style={{height: "100%", width: "24%", padding: "20px 10px" }}>
          <Paper className={classes.paper}>
              {/* <h2><em>{mediaIn.item}:</em> {mediaIn.distributor}, {mediaIn.format}, {mediaIn.shelf}</h2> */}
            <CardMedia
              style={{maxHeight: "90%", maxWidth: "90%", margin: "auto", padding: "5% 3% 0% 3%"}}
              className={mediaIn.item}
              component="img"
              alt={mediaIn.item}
              src={mediaIn.cover_art}
              title={mediaIn.item}
              onClick={() => {addMedia ? addItem() : itemDetails()}}
            />
            <br />
            {/* <p>{mediaIn.description}</p> */}
            {addMedia ? 
              <div><Button  onClick={() => addItem()}><AddIcon></AddIcon></Button></div> : 
              <div>
                <Button onClick={() => setConfirmDelete(!confirmDelete)}><DeleteIcon></DeleteIcon></Button>
                <Button onClick={() => itemDetails()}><MoreHorizIcon></MoreHorizIcon></Button>
                <Button onClick={() => setShowDetails(!showDetails)}><ExpandMoreIcon /></Button>
                {
                  confirmDelete ?
                  <div>
                    <div>Delete from collection?</div>
                    <Button onClick={() => setConfirmDelete(!confirmDelete)}><CancelIcon></CancelIcon></Button>
                    <Button onClick={() => deleteItem()}><DoneIcon></DoneIcon></Button>
                  </div> :
                  <></>
                }
                {showDetails ? 
                  <section>
                    <p>({mediaIn.format}, <a href={`${mediaIn.product_page}`}>website</a>) {mediaIn.description}</p>
                  </section> : ""}
              </div>
            }
          </Paper>
        </Grid>
    );
};

export default DisplayCollectionItem;