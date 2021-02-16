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
   Fab, Chip, Fade
} from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import {Helmet} from "react-helmet";
import DoneIcon from '@material-ui/icons/Done';

const useStyles = makeStyles(theme => ({
   root: {
      padding: 8,
      marginBottom: theme.spacing(3)
   },
   cardContainer: {
      // marginTop: theme.spacing(1),
   },
   card: {
      "& $a": {
         textDecoration: "none",
         color: "black",
         "&:hover": {
            textDecoration: "none",
         }
      },
      height: "100%",
      "&:hover": {
         boxShadow: "0 0 5px #431335, 0 0 20px #431335",
         backgroundColor: "inherit",
      },
   },
   filter: {
      margin: "4px 2px",
   },
   activeFilter: {backgroundColor: "lightgreen", "&:hover": {backgroundColor: "lightgreen"}},
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

const Openings = (props) => {
   const classes = useStyles()
   const [filters, setFilters] = useState([])
   const openings = props.stores.openings.openingList
   const tags = props.stores.openings.tags
   useEffect(() => {
      props.stores.openings.getOpenings()
      props.stores.openings.getTags()
   }, [])

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
      </Helmet>
      <Container className={classes.root}>
         {props.stores.authStore.currentUser && props.stores.authStore.currentUser.is_staff && <Fab
           component={Link}
           className={classes.createBtn}
           disableRipple
           to={'/chess/openings/new'}
         ><AddIcon/></Fab>}

         <Grid container direction={"column"}>

            <Grid item direction={'row'}>
               {tags.map((el, i) => <Chip
                 key={el + '' + i}
                 disableRipple
                 className={`${classes.filter}`}
                 variant={"outlined"}
                 label={el}
                 avatar={filters.includes(el) && <DoneIcon/>}
                 onClick={() => setFilters(filters.includes(el) ? filters.filter(elem => elem !== el) : [el, ...filters])}
               />)}
            </Grid>

            <Grid item container direction={'row'} spacing={2} className={classes.cardContainer}>
               {props.stores.authStore.currentUser && props.stores.authStore.currentUser.is_staff && <Grid item xs={12}>
               </Grid>}
               {openings?.length ?
                 <Grid item xs={12}><Typography
                   align={"left"}><strong>{!filters.length ? openings.length : openings.filter(el => filters.every(e => el.tags.map(elem => elem.name).indexOf(e) !== -1)).length}</strong> openings
                    found</Typography></Grid> : ''}
               {openings?.map(opening => (!filters?.length || filters.every(el => opening.tags.map(el => el.name).indexOf(el) !== -1)) &&
                 <Grid item xs={12} sm={6} md={4} lg={4}>
                    <Fade in={true}>
                       <Card className={classes.card}>
                          <CardActionArea disableRipple component={Link} to={`/chess/openings/${opening.slug}`}
                                          style={{padding: 8, height: "100%"}}>
                             <Typography variant={"h6"} align={"center"}>{opening.title}</Typography>

                             <CardContent>
                                <Typography color={"textSecondary"}>{opening.description}</Typography>
                                {opening.tags.map((tag, i) => <Chip
                                  key={i + '' + tag}
                                  style={{
                                     backgroundColor: opening.color === 'w' ? 'white' : 'black',
                                     color: opening.color === 'w' ? 'black' : 'white',
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