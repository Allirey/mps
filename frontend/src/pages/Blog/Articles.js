import React, {useEffect, useState} from "react";
import {Link} from 'react-router-dom';
import {Container, makeStyles, Grid} from "@material-ui/core";
import withStore from '../../hocs/withStore';
import Card from "../../components/Card";
import Spinner from "../../components/spinner";

const useStyles = makeStyles(theme => ({
   root: {
      flexGrow: 1,
      marginTop: theme.spacing(3),
      paddingBottom: theme.spacing(3),
      "& $img": {
         width: "100%",
         height: "auto",
      }
   },
   logo: {
      width: "21em",
      "& img": {width: "100%", height: "100%"}
   },
   todos: {
      marginTop: theme.spacing(2)
   }
}))

function Articles(props) {
   const classes = useStyles();

   const [articles, setArticles] = useState(null)
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      props.stores.posts.all().then(data => {
         setArticles(data)
      }).catch(console.warn).finally(() => {
         setIsLoading(false)
      })


   }, [])


   if (isLoading) return <Spinner/>
   return (
     <Container className={classes.root} maxWidth={"md"}>
        <Link to={'/blog/new'}>New post</Link>
        <Grid container>

           {articles && articles.results.map((article, i) =>
             <Grid item sm={6} key={i}>
                <Card article={article}/>
             </Grid>
           )}
        </Grid>
     </Container>
   )
}

export default withStore(Articles)