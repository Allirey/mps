import {
   Divider,
   Drawer,
   Grid,
   List,
   ListItem,
   ListItemIcon, ListItemText,
   makeStyles,
   Paper,
   Typography, Toolbar,
   useMediaQuery, useTheme
} from "@material-ui/core";
import {Link, useHistory} from 'react-router-dom'

const drawerWidth = 'calc(280px + 6vw)';

const useStyles = makeStyles(theme => ({
   drawerPaper: {width: drawerWidth,},
   root: {
      overflowY: "auto",
      userSelect: "none",
      cursor: "pointer",
      "& $li": {
         borderBottom: "1px solid #e3e3e3",
         color: "black",
         "&:hover": {backgroundColor: "#e8f2fa",},
         padding: "3px 8px 3px 16px",
      },
      "& $h3": {
         display: "block",
         flex: "1 1 100%",
         fontSize: "1em",
         fontWeight: "normal",
         lineHeight: "1",
         margin: "0.5em 0",
         wordBreak: 'break-word',
         alignSelf: "center",

         // marginBlockStart: "1em",
         // marginBlockEnd: "1em",
         marginInlineStart: "0px",
         marginInlineEnd: "0px",
      },
      "& $span": {fontWeight: 'bold', fontSize: "90%",},
   },
   active: {
      backgroundColor: '#e8f2fa',
      "&:hover": {backgroundColor: '#e8f2fa',},
   },
   drawer: {
      maxWidth: drawerWidth,
      minWidth: drawerWidth,
      flexShrink: 0,
   },
}))

const OpeningChapters = (props) => {
   const {window} = props;
   const classes = useStyles()
   const theme = useTheme();
   const container = window !== undefined ? () => window().document.body : undefined;
   const history = useHistory();

   const matchesLG = useMediaQuery(theme.breakpoints.only('lg'))

   return <Drawer
     className={classes.drawer}
     container={container}
     anchor={matchesLG ? 'left' : 'right'}
     open={matchesLG || props.showChapters}
     onClose={props.toggleChapters}

     ModalProps={{
        keepMounted: true, // Better open performance on mobile.
     }}
     classes={{
        paper: classes.drawerPaper,
     }}
     variant={matchesLG ? "permanent" : "temporary"}
   >
      {matchesLG && <Toolbar/>}
      <div className={classes.root}>
         <List>
            {props.currentOpening && props.currentOpening.chapters.map((chapter, i) =>
              <ListItem
                onClick={() => history.push(`/chess/openings/${props.currentOpening.slug}/${i + 1}`)}
                className={`${props.currentChapter && props.currentChapter.url === chapter.url ? classes.active : null}`}
                key={chapter.url}
              >
                 <ListItemIcon component={Typography}><b>{i + 1}</b></ListItemIcon>
                 <ListItemText>{`${chapter.title.replace('Chapter ', '').replace(/\d+\. /, '')}: ${chapter.description}`}</ListItemText>
              </ListItem>
            )}
         </List>
      </div>
   </Drawer>
}

export default OpeningChapters