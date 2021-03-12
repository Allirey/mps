import {makeStyles, Card, CardActionArea, CardActions, CardContent, Typography} from '@material-ui/core';
import {Link} from "react-router-dom";
import VisibilityIcon from '@material-ui/icons/Visibility';

const useStyles = makeStyles(theme => ({
   root: {
      height: "100%",
      border: 0,
      "& $button": {
         textTransform: "none"
      },
      "& $a": {
         textDecoration:"none",
         color: theme.palette.text.primary
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
                 {makeDate(article.created)}{' · '}{article.read_time} min read{' · '}
                 <VisibilityIcon fontSize={"inherit"}/> {article.views}
              </Typography>
              <br/>
              <br/>
              <Typography variant="body2" color="textSecondary" component="div"
                          dangerouslySetInnerHTML={{"__html": article.body.slice(0, 300)
                               + (article.body.length > 300? "...":"")}}/>
           </CardContent>
        </CardActionArea>
        <CardActions>
        </CardActions>
     </Card>
   );
}