import React, {useEffect, useState} from 'react';
import withStore from '../../hocs/withStore'
import {
   Container,
   Grid,
   makeStyles,
   Card,
   Link,
   CardActionArea,
   Typography,
   CardContent
} from "@material-ui/core";
import {Helmet} from "react-helmet";

const useStyles = makeStyles({
   root: {
      padding: 8,
      "& $a": {
         textDecoration: "none",
         color: "black",
         "&:hover": {
            textDecoration: "none",
         }
      }
   },
});

const Openings = (props) => {
   const classes = useStyles()
   const openings = props.stores.openings.openingList
   useEffect(() => {
      props.stores.openings.getOpenings()
   }, [])

   return <>
      <Helmet
        title={"Advanced chess openings theory"}
      >
         <meta name={"description"} content={"Section is designed for experienced chess players, includes heavy-theory openings, and is constantly improving. New openings coming soon."}/>
         <meta property={"og:title"} content={"Advanced chess openings theory"}/>
         <meta property={"og:description"} content={"Section is designed for experienced chess players, includes heavy-theory openings, and is constantly improving. New openings coming soon."}/>
         <meta property={"og:type"} content={"website"}/>
         <meta name="twitter:card" content="summary"/>
         <meta name="twitter:title" content="Advanced chess openings theory"/>
         <meta name="twitter:description" content="Section is designed for experienced chess players, includes heavy-theory openings, and is constantly improving. New openings coming soon."/>
         <meta name="twitter:site:id" content="741164490"/>
      </Helmet>
      <Container className={classes.root}>
         <Grid container direction={'row'} spacing={2}>
            {props.stores.authStore.currentUser && props.stores.authStore.currentUser.is_staff && <Grid item xs={12}>
               <Link href={'/chess/openings/new'}>create opening</Link>
            </Grid>}
            {openings && openings.map(opening => <Grid item xs={12} sm={6} md={4} lg={4}>
               <Card style={{height: "100%"}}>
                  <CardActionArea disableRipple component={Link} href={`/chess/openings/${opening.slug}`}
                                  style={{padding: 8}}>
                     <Typography variant={"h6"} align={"center"}>{opening.title}</Typography>
                     <CardContent>
                        <Typography color={"textSecondary"}>{opening.description}</Typography>
                     </CardContent>
                  </CardActionArea>
               </Card>
            </Grid>)}
         </Grid>
      </Container>
   </>
}

export default withStore(Openings)