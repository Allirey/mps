import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import {Link, Redirect} from "react-router-dom";

const useStyles = makeStyles(theme => ({
   root: {
      height: "100%",
      border: 0,
      "& $button": {
         textTransform: "none"
      },
      "& $a": {
         textDecoration:"none",
         color: "black"
      },
   },
   clickArea:{
      height: "100%",
   }

}));

export default function MediaCard(props) {
   const classes = useStyles();

   const {article} = props

   const makeDate = dateString => new Date(dateString).toDateString().split(' ')
     .splice(1).join(' ')

   return (
     <Card className={classes.root} variant={"outlined"}>
        <CardActionArea className={classes.clickArea} disableRipple component={Link} to={`/blog/${article.slug}`}>
           <CardContent>
              <Typography variant="h5" component="h2">
                 {article.title}
              </Typography>
              <Typography gutterBottom variant="caption" color="textSecondary">
                 {makeDate(article.created)} by {article.author.username}
              </Typography>
              <br/>
              <br/>
              <Typography variant="body2" color="textSecondary" component="div"
                          dangerouslySetInnerHTML={{"__html": article.body.replace(/<[^>]+>/g, '').slice(0, 300)
                               + (article.body.replace(/<[^>]+>/g, '').length > 300? "...":"")}}/>
           </CardContent>
        </CardActionArea>
        <CardActions>
        </CardActions>
     </Card>
   );
}