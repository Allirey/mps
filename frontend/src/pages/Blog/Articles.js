import {useEffect, useState, Fragment} from "react";
import {Link, useParams} from 'react-router-dom';
import {
   Container,
   makeStyles,
   Grid,
   Button,
   useTheme,
   useMediaQuery,
   Box,
   Typography, Fade, Fab
} from "@material-ui/core";
import withStore from '../../hocs/withStore';
import Card from "../../components/articleCard";
import Error404 from "../../errors/error404";
import {Helmet} from "react-helmet";
import {Skeleton} from '@material-ui/lab';
import PostAddIcon from '@material-ui/icons/PostAdd';

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
   paginationBtn: {
      borderRadius: "13px",
      padding: 0,
      maxWidth: 42, minWidth: 42,
      maxHeight: 26, minHeight: 26,
      margin: "25px 4px",
   },
   skeleton: {
      padding: theme.spacing(5)
   },
   addPost: {
      position: "fixed",
      right: "2vw",
      bottom: "13vh",
      zIndex: 100,
      opacity: "1",
      color: "#4caef9",
      backgroundColor: "transparent",
      "&:hover": {
         color: "white",
         backgroundColor: "#4caef9",
      }
   }
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
   const matchesMD = useMediaQuery(theme.breakpoints.up('md'));
   const matchesSM = useMediaQuery(theme.breakpoints.up('sm'));
   const {currentPage} = useParams();

   const [articles, setArticles] = useState(null)
   const [isLoading, setIsLoading] = useState(true);
   const [pages, setPages] = useState(1)

   useEffect(() => {
      setIsLoading(true)
      props.stores.posts.all(currentPage || 1).then(data => {
         setArticles(data.results)
         setPages(Math.trunc(data.count / 10) + !!(data.count % 10))
      }).catch(console.warn).finally(() => {
         setIsLoading(false)
      })
   }, [currentPage])

   const pagination = (pages, current) => {
      // 1 ... 3 4 [5] 6 7 ... 9    for desktop
      //   1 ... 4 [5] 6 ... 9      for mobile
      let res = [current - 2, current - 1, current, current + 1, current + 2]

      res = matchesSM ? res : res.slice(1, -1)
      res = res.filter(x => x > 0 && x <= pages)

      if (res[0] > 1)
         res = res[0] > 2 ? [1, ' . . . ', ...res] : [1, ...res]

      if (res[res.length - 1] < pages)
         res = (res[res.length - 1]) + 1 < pages ? [...res, ' . . . ', pages] : [...res, pages]

      res = res.map(x => {
         if (typeof x === "string") return x
         return navigationButton({page: x, disabled: x === current, clsName: classes.paginationBtn})
      })

      return res
   }

   if (isLoading) return (
     <Container maxWidth={"md"} className={classes.skeleton}>
        <Skeleton width={"0%"}/>
        <Skeleton width={"0%"}/>
        <Skeleton width={"0%"}/>
        <Typography variant={"h4"}>
           <Skeleton width={"80%"} animation={"wave"}/>
        </Typography>
        <Typography>
           <Skeleton width={"15%"}/>
           <Skeleton width={"0%"}/>
           <Skeleton width={"95%"}/>
           <Skeleton width={"91%"}/>
           <Skeleton width={"99%"}/>
           <Skeleton width={"47%"}/>
        </Typography>
        <Skeleton width={"0%"}/>
        <Skeleton width={"0%"}/>
        <Typography variant={"h4"}>
           <Skeleton width={"90%"} animation={"wave"}/>
           <Skeleton width={"40%"} animation={"wave"}/>
        </Typography>
        <Typography>
           <Skeleton width={"15%"}/>
           <Skeleton width={"0%"}/>
           <Skeleton width={"97%"}/>
           <Skeleton width={"91%"}/>
           <Skeleton width={"74%"}/>
        </Typography>
        <Skeleton width={"0%"}/>
        <Skeleton width={"0%"}/>
        <Typography variant={"h4"}>
           <Skeleton width={"40%"} animation={"wave"}/>
        </Typography>
        <Typography>
           <Skeleton width={"15%"}/>
           <Skeleton width={"0%"}/>
           <Skeleton width={"90%"}/>
           <Skeleton width={"86%"}/>
           <Skeleton width={"97%"}/>
           <Skeleton width={"95%"}/>
           <Skeleton width={"45%"}/>
        </Typography>
        <Skeleton width={"0%"}/>
        <Skeleton width={"0%"}/>
     </Container>
   )
   else if (!articles) return <Error404/>
   return (
     <>
        <Helmet
          title={currentPage && currentPage !== "1" ? `Blog - page ${currentPage}` : "Blog"}
        >
           <meta name={"description"}
                 content={"Blog. Content related to chess and programming, or another hobbies of mine."}/>
           <meta property={"og:title"} content={currentPage && currentPage !== "1" ? `Blog - page ${currentPage}` : "Blog"}/>
           <meta property={"og:description"}
                 content={"Blog. Content related to chess and programming, or another hobbies of mine."}/>
           <meta property={"og:type"} content={"website"}/>
           <meta name="twitter:card" content="summary"/>
           <meta name="twitter:title" content={currentPage && currentPage !== "1" ? `Blog - page ${currentPage}` : "Blog"}/>
           <meta name="twitter:description"
                 content={"Blog. Content related to chess and programming, or another hobbies of mine."}/>
           <meta name="twitter:site:id" content="741164490"/>
        </Helmet>
        <Grid container>
           <Grid item sm={1} md={2}/>
           <Grid item xs={12} sm={10} md={8}>
              <Box display={{xs: 'block', md: 'none'}}/>
              <div className={classes.root}>
                 <Grid container component={matchesMD ? Container : "div"} maxWidth={"md"} justify={"center"}>
                    <Grid item>
                       {pagination(pages, +currentPage || 1).map((x, i) => {
                          return <Fragment key={i}>{x}</Fragment>
                       })}
                    </Grid>

                    {articles && articles.map((article, i) =>
                      <Fade in={true}>
                         <Grid item xs={12} key={i}>
                            <Card article={article}/>
                         </Grid>
                      </Fade>
                    )}

                    <Grid item>
                       {(articles.length > 1) && pagination(pages, +currentPage || 1).map((x, i) => {
                          return <Fragment key={i}>{x}</Fragment>
                       })}
                    </Grid>
                 </Grid>
              </div>
           </Grid>
           <Box display={{xs: 'none', md: 'block'}}>
              <Grid item sm={1} md={2}/>
           </Box>
           {props.stores.authStore.currentUser && props.stores.authStore.currentUser.is_staff &&
           <Fab disableRipple className={`${classes.addPost} ${classes.newPostBtn}`}
                onClick={() => props.history.push('/blog/new')}><PostAddIcon/></Fab>}
        </Grid>
     </>
   )
}

export default withStore(Articles)