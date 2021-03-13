import {
   List, ListItem, ListItemIcon, ListItemText, makeStyles, Typography, Toolbar, useMediaQuery, useTheme, SwipeableDrawer
} from "@material-ui/core";
import {useHistory} from 'react-router-dom'

const drawerWidth = 'calc(280px + 6vw)';
const useStyles = makeStyles(theme => ({
   drawerPaper: {width: drawerWidth,},
   root: {
      overflowY: "auto",
      userSelect: "none",
      cursor: "pointer",
      "& $li": {
         border: `1px solid ${theme.palette.divider}`,
         "&:hover": {backgroundColor: `${theme.palette.action.hover}`,},
         padding: "3px 8px 3px 16px",
      },
      "& $span": {fontWeight: 'bold', fontSize: "90%",},
   },
   active: {
      backgroundColor: `${theme.palette.action.selected} !important`,
      "& $span": {color: `${theme.palette.text.primary} !important`},
      "&:hover": {backgroundColor: `${theme.palette.action.active}`,},
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

   const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);

   return <SwipeableDrawer
     className={classes.drawer}
     container={container}
     anchor={matchesLG ? 'left' : 'right'}
     open={matchesLG || props.showChapters}
     onClose={props.toggleChapters}
     onOpen={props.toggleChapters}
     disableBackdropTransition={!iOS}
     disableDiscovery={iOS}
     ModalProps={{keepMounted: true,}}// Better open performance on mobile.
     classes={{paper: classes.drawerPaper,}}
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
                 <ListItemIcon><span><b>{i + 1}</b></span></ListItemIcon>
                 <ListItemText
                   primary={<Typography
                     variant={"h6"}>{`${chapter.title.replace('Chapter ', '').replace(/\d+\. /, '')}`}</Typography>}
                   secondary={chapter.description !== '?' && chapter.description}
                 />
              </ListItem>
            )}
         </List>
      </div>
   </SwipeableDrawer>
}

export default OpeningChapters