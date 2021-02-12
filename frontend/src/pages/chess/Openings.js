import React, {useEffect, useState} from 'react';
import withStore from '../../hocs/withStore'
import {
   Container,
   Grid,
   makeStyles,
   Card,
   Button,
   Link,
   CardActionArea,
   Typography,
   CardContent
} from "@material-ui/core";

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

   return <Container className={classes.root}>
      <Grid container direction={'row'} spacing={2}>
         {props.stores.authStore.currentUser && props.stores.authStore.currentUser.is_staff && <Grid item xs={12}>
            <Link href={'/chess/openings/new'}>create opening</Link>
         </Grid>}
         {openings && openings.map(opening => <Grid item xs={12} sm={6} md={4} lg={4} >
            <Card style={{height: "100%"}}>
               <CardActionArea disableRipple component={Link} href={`/chess/openings/${opening.slug}`} style={{padding: 8}}>
                  <Typography variant={"h6"} align={"center"}>{opening.title}</Typography>
                  <CardContent>
                     <Typography color={"textSecondary"}>{opening.description}</Typography>
                  </CardContent>
               </CardActionArea>
            </Card>
         </Grid>)}
      </Grid></Container>
}

export default withStore(Openings)