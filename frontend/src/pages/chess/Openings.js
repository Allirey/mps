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

const useStyles = makeStyles(theme => ({
   root: {
      padding: 8,
   },
   cardContainer: {
      marginTop: theme.spacing(1),
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
   const openings = props.stores.openings.openingList
   useEffect(() => {
      props.stores.openings.getOpenings()
   }, [])

   // const tags = ['Black', 'White', '1.Nf3', '1.d4', '1.e4', '1.c4', 'Minor lines', 'Sicilian', 'French', 'Caro-Kann']

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

            {/*<Grid item direction={'row'}>*/}
            {/*   {tags.map(el => <Chip*/}
            {/*     className={classes.filter}*/}
            {/*     variant={"outlined"}*/}
            {/*     label={el}*/}
            {/*     onDelete={() => ''}*/}
            {/*   />)}*/}
            {/*</Grid>*/}

            <Grid item container direction={'row'} spacing={2} className={classes.cardContainer}>
               {props.stores.authStore.currentUser && props.stores.authStore.currentUser.is_staff && <Grid item xs={12}>
               </Grid>}
               {openings && openings.map(opening => <Grid item xs={12} sm={6} md={4} lg={4}>
                  <Fade in={true}>
                     <Card className={classes.card}>
                        <CardActionArea disableRipple component={Link} to={`/chess/openings/${opening.slug}`}
                                        style={{padding: 8}}>
                           <Typography variant={"h6"} align={"center"}>{opening.title}</Typography>
                           <CardContent>
                              <Typography color={"textSecondary"}>{opening.description}</Typography>
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