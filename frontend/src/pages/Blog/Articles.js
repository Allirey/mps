import React, {useEffect, useState} from "react";
import {Link, useParams} from 'react-router-dom';
import {Container, makeStyles, Grid, Button, useTheme, useMediaQuery, Box} from "@material-ui/core";
import withStore from '../../hocs/withStore';
import Card from "../../components/Card";
import Spinner from "../../components/spinner";
import Error404 from "../../errors/error404";

const useStyles = makeStyles(theme => ({
   root: {
      flexGrow: 1,
      // marginTop: theme.spacing(3),
      paddingBottom: theme.spacing(3),
      "& $img": {
         width: "100%",
         height: "auto",
      }
   },
   newPostBtn: {
      borderRadius: '17px',
      borderColor: "black",
      color: "#4caef9",
      backgroundColor: "white",
      fontSize: "18px",
      height: "30px",
      textTransform: "none",
      margin: theme.spacing(2),
      "& button": {
         fontStyle: "normal",
         fontWeight: "600",
      },
      "&:hover": {
         color: "white",
         backgroundColor: "#4caef9",
      }
   },
   paginationBtn: {
      borderRadius: "13px",
      padding: 0,
      maxWidth: 40, minWidth: 40,
      margin: "25px 4px",
   },
}))

const navigationButton = props => {
   return <Button
     disableRipple
     className={props.clsName}
     variant={"outlined"}
     size={"small"}
     disabled={props.disabled}
     component={Link} to={`/blog/page/${props.page}`}>{props.page}</Button>
}

function Articles(props) {
   const classes = useStyles();
   const theme = useTheme();
   const matches = useMediaQuery(theme.breakpoints.up('md'));
   const {currentPage} = useParams();

   const [articles, setArticles] = useState(null)
   const [isLoading, setIsLoading] = useState(true);
   const [pages, setPages] = useState(1)

   useEffect(() => {
      props.stores.posts.all(currentPage || 1).then(data => {
         setArticles(data.results)
         setPages(Math.trunc(data.count / 10) + !!(data.count % 10))
      }).catch(console.warn).finally(() => {
         setIsLoading(false)
      })
   }, [currentPage])

   const pagination = (pages, current) => {
      current = +current
      let res = [navigationButton({
         page: 1, disabled: current === 1,
         clsName: classes.paginationBtn,
      })]
      if (pages === 1) return res;
      if (current >= 5) {
         res = res.concat(['  .  .  .  ', navigationButton({
            page: current - 2,
            clsName: classes.paginationBtn
         }),
            navigationButton({page: current - 1, clsName: classes.paginationBtn}),
            navigationButton({page: current, disabled: true, clsName: classes.paginationBtn})])
      } else {
         let c = 1
         while (c !== current) {
            res = res.concat([navigationButton({
               page: c + 1, disabled: (c + 1) === current,
               clsName: classes.paginationBtn
            })])
            c++
         }
      }
      if (current + 4 <= pages) {
         res = res.concat([navigationButton({page: current + 1, clsName: classes.paginationBtn}),
            navigationButton({page: current + 2, clsName: classes.paginationBtn}), '  .  .  .  ',
            navigationButton({page: pages, clsName: classes.paginationBtn})])
      } else {
         let c = current
         while (c !== pages) {
            res = res.concat([navigationButton({page: c + 1, clsName: classes.paginationBtn})])
            c++
         }
      }
      return res;
   }

   if (isLoading) return <Spinner/>
   else if (!articles) return <Error404/>
   return (
     <Grid container>
        <Grid item sm={1} md={2}/>
        <Grid item xs={12} sm={10} md={8}>
           <Box display={{xs: 'block', md: 'none'}}>
              {props.stores.authStore.currentUser && props.stores.authStore.currentUser.is_staff &&
              <Button className={classes.newPostBtn} onClick={() => props.history.push('/blog/new')}>new</Button>}
           </Box>
           <div className={classes.root}>
              <Grid container component={matches ? Container : "div"} maxWidth={"md"} justify={"center"}>
                 <Grid item>
                    {pagination(pages, currentPage || 1).map((x, i) => {
                       return <React.Fragment key={i}>{x}</React.Fragment>
                    })}
                 </Grid>
                 {articles && articles.map((article, i) =>
                   <Grid item xs={12} key={i}>
                      <Card article={article}/>
                   </Grid>
                 )}
                 <Grid item>
                    {(articles.length > 1) && pagination(pages, currentPage || 1).map((x, i) => {
                       return <React.Fragment key={i}>{x}</React.Fragment>
                    })}
                 </Grid>
              </Grid>
           </div>
        </Grid>
        <Box display={{xs: 'none', md: 'block'}}>
           <Grid item sm={1} md={2}>
              {props.stores.authStore.currentUser && props.stores.authStore.currentUser.is_staff &&
              <Button className={classes.newPostBtn} onClick={() => props.history.push('/blog/new')}>new</Button>}
           </Grid>
        </Box>
     </Grid>
   )
}

export default withStore(Articles)