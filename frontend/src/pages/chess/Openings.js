import React, {useEffect, useState} from 'react';
import withStore from '../../hocs/withStore'
import {Link} from 'react-router-dom';
import {
   Container,
   Grid,
   makeStyles,
   Card,
   CardActionArea,
   Typography,
   CardContent,
   Fab, Chip, Fade, CardMedia, Divider, Button, MenuItem, Menu, ListItemIcon, ListItemText, CardHeader
} from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import {Helmet} from "react-helmet";
import InfoIcon from '@material-ui/icons/Info';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FeedbackIcon from '@material-ui/icons/Feedback';
import LiveHelpIcon from '@material-ui/icons/LiveHelp';

const useStyles = makeStyles(theme => ({
   root: {
      marginBottom: theme.spacing(3)
   },
   cardContainer: {
      // marginTop: theme.spacing(1),
   },
   card: {
      backgroundColor: "#e6f6fd",
      "& $a": {
         textDecoration: "none",
         color: "black",
         "&:hover": {
            textDecoration: "none",
         }
      },
      height: "100%",
   },
   filter: {
      margin: "10px 2px",
   },
   createBtn: {
      position: "fixed",
      bottom: 50,
      right: 30,
      backgroundColor: "transparent",
      color: 'blue',
      "&:hover":
        {
           backgroundColor: "transparent",
           color: 'blue',
        },
      zIndex: 100,
   }
}));

const COLOR = {ANY: 'Any', WHITE: 'White', BLACK: 'Black'}

const Openings = (props) => {
   const classes = useStyles()
   const [colorFilter, setColorFilter] = useState(COLOR.ANY)
   const [filter, setFilter] = useState('')

   const openings = props.stores.openings.openingList
     .filter(o =>
       colorFilter === COLOR.ANY ||
       colorFilter === COLOR.BLACK && o.color === 'b' ||
       colorFilter === COLOR.WHITE && o.color === 'w'
     ).filter(o => filter === '' || o.tags.map(el => el.name).includes(filter))

   const tags = props.stores.openings.tags

   useEffect(() => {
      props.stores.openings.getOpenings()
      props.stores.openings.getTags()
   }, [])

   const [anchorEl, setAnchorEl] = React.useState(null);

   const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
   };

   const handleClose = () => {
      setAnchorEl(null);
   };

   return <>
      <Helmet
        title={"Advanced chess openings theory"}
      >
         <meta name={"description"}
               content={"Section is designed for experienced chess players, includes heavy-theory openings, and is constantly improving. New openings coming soon."}/>
         <meta property={"og:title"} content={"Advanced chess openings theory"}/>
         <meta property={"og:description"}
               content={"Section is designed for experienced chess players, includes heavy-theory openings, and is constantly improving. New openings coming soon."}/>
         <meta property={"og:type"} content={"website"}/>
         <meta name="twitter:card" content="summary"/>
         <meta name="twitter:title" content="Advanced chess openings theory"/>
         <meta name="twitter:description"
               content="Section is designed for experienced chess players, includes heavy-theory openings, and is constantly improving. New openings coming soon."/>
         <meta name="twitter:site:id" content="741164490"/>
         <style type="text/css">{`html { overflow-y: scroll;}`}</style>
      </Helmet>
      <Container className={classes.root}>
         {props.stores.authStore.currentUser && props.stores.authStore.currentUser.is_staff && <Fab
           component={Link}
           className={classes.createBtn}
           disableRipple
           to={'/chess/openings/new'}
         ><AddIcon/></Fab>}

         <Grid container direction={"column"}>

            <Grid item>
               {Object.values(COLOR).map(value =>
                 <Chip
                   disableRipple
                   variant={"outlined"}
                   style={{backgroundColor: value === colorFilter ? 'lightblue' : 'white'}}
                   key={value}
                   label={value}
                   className={classes.filter}
                   onClick={() => setColorFilter(value)}
                 />
               )}

               <Button size={"small"} style={{marginLeft: "40px"}} disableRipple aria-controls="simple-menu"
                       aria-haspopup="true" onClick={handleClick}>
                  <InfoIcon/>
               </Button>
               <Menu
                 id="simple-menu"
                 anchorEl={anchorEl}
                 keepMounted
                 open={Boolean(anchorEl)}
                 onClose={handleClose}
               >
                  <MenuItem disableRipple target={'noopener'} component={Link} to={'/blog/faq-chess-openings'}
                            onClick={handleClose}>
                     <ListItemIcon>
                        <LiveHelpIcon style={{color: "black"}}/>
                     </ListItemIcon>
                     <ListItemText>
                        FAQ
                     </ListItemText>
                  </MenuItem>
                  <MenuItem target={'noopener'} component={Link} to={'//t.me/inf13'} disableRipple
                            onClick={handleClose}>
                     <ListItemIcon>
                        <FeedbackIcon style={{color: "black"}}/>
                     </ListItemIcon>
                     <ListItemText>
                        Feedback
                     </ListItemText>
                  </MenuItem>
                  <MenuItem disableRipple target={'noopener'} component={Link}
                            to={'/blog/contribute-to-chess-opening-theory'} onClick={handleClose}>
                     <ListItemIcon>
                        <FavoriteIcon color={"secondary"}/>
                     </ListItemIcon>
                     <ListItemText>
                        Contribute
                     </ListItemText>
                  </MenuItem>
               </Menu>
            </Grid>


            <Divider/>
            <Grid item>
               {tags.map((el, i) => <Chip
                 key={el + '' + i}
                 disableRipple
                 className={classes.filter}
                 variant={"outlined"}
                 label={el}
                 style={{backgroundColor: el === filter ? 'lightgreen' : 'white'}}
                 onClick={() => setFilter(filter === el ? '' : el)}
               />)}
            </Grid>

            <Grid item container direction={'row'} spacing={3} className={classes.cardContainer}>
               {(openings.length || filter) && <Grid item xs={12}><Typography
                 align={"center"} variant={"h5"} component={"h2"}><strong>{openings.length}</strong> openings
                  found</Typography></Grid>}
               {openings?.map(opening =>
                 <Grid item xs={12} sm={6} md={4} lg={3} key={opening.slug}>
                    <Fade in={true}>
                       <Card className={classes.card}>
                          {props.stores.authStore.currentUser?.is_staff &&
                          <CardHeader component={Link}
                                      to={`/chess/openings/${opening.slug}/edit`}
                                      subheader={'Edit'}
                          />}
                          <CardActionArea disableRipple component={Link} to={`/chess/openings/${opening.slug}`}
                                          style={{height: "100%"}}>

                             <CardMedia component={"img"} image={opening.image} alt={''}/>
                             <CardContent>
                                <Typography gutterBottom variant={"h5"} component={"h2"}
                                            align={"center"}>{opening.title}</Typography>
                                <Typography variant="body2" color="textSecondary"
                                            component="p">{opening.description}</Typography>
                                {opening.tags.map((tag, i) => <Chip
                                  key={i + '' + tag}
                                  style={{
                                     backgroundColor: opening.color === 'w' ? 'white' : '#333',
                                     color: opening.color === 'w' ? '#000' : 'white',
                                     margin: "2px",
                                  }}
                                  label={tag.name}
                                  size={"small"}
                                  variant={"outlined"}
                                />)}
                             </CardContent>
                          </CardActionArea>
                       </Card>
                    </Fade>
                 </Grid>)}
            </Grid>
         </Grid>
      </Container>
   </>
}

export default withStore(Openings)