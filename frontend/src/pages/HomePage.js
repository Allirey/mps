import {Container, List, ListItem, makeStyles, Typography} from "@material-ui/core";
import withStore from '../hocs/withStore';
import {Link} from 'react-router-dom'

const useStyles = makeStyles(theme => ({
   root: {
      marginTop: theme.spacing(3),
      paddingBottom: theme.spacing(3),
      "& $a": {
      //    background: `linear-gradient(0deg, ${theme.palette.warning.light} 35%,transparent 0)`,
      //    textDecoration: "none",
         color: theme.palette.text.primary,
      }
   },
}))

function HomePage(props) {
   const classes = useStyles();

   return (
     <Container className={classes.root}>
        <List>
           <ListItem><Typography variant={"h5"} component={'h2'}><Link to={'/blog'}>Blog</Link></Typography></ListItem>
           <ListItem> <Typography variant={"h5"} component={'h2'}><Link to={'/chess/analysis'}>Chess opening explorer, 3
              databases: ukrainian,
              lichess.org, masters</Link></Typography></ListItem>
           <ListItem> <Typography variant={"h5"} component={'h2'}><Link to={'/chess/openings'}>Advanced chess opening
              theory</Link></Typography></ListItem>
        </List>
     </Container>
   )
}

export default withStore(HomePage)