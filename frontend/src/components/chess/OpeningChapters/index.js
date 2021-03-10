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
import {Link} from 'react-router-dom'
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";

const drawerWidth = 300;

const useStyles = makeStyles(theme => ({
   drawerPaper: {
      width: drawerWidth,
   },
   root: {
      // position:"static",
      overflowY: "auto",
      // maxHeight: '544px',
      // padding: "8px",
      // margin: "16px",
      // overflow: "auto",
      userSelect: "none",
      // flexFlow: 'row nowrap',
      cursor: "pointer",
      "& $a": {
         textDecoration: "none",
         color: "black",
         "&:hover": {
            backgroundColor: "#e8f2fa",
         },
         padding: 0,
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
      "& $span": {
         display: "flex",
         flex: '0 0 1.7em',
         fontWeight: 'bold',
         color: '#1b78d0',
         opacity: 0.8,
         marginRight: "0.4em",
         height: "auto",
         alignContent: "center",
      },
      // "& a": {
      //    flexFlow: 'row nowrap',
      //    display: "flex",
      // },

   },
   active: {
      "& $span": {
         color: '#fff',
         backgroundColor: '#1b78d0',
      },
      backgroundColor: '#e8f2fa',
      "&:hover": {
         backgroundColor: '#e8f2fa',
      }
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

   return <Drawer
     className={classes.drawer}
     container={container}
     anchor={useMediaQuery(theme.breakpoints.up('lg')) ? 'left':'right'}
     open={useMediaQuery(theme.breakpoints.up('lg')) || props.showChapters}
     onClose={props.toggleChapters}

     ModalProps={{
        keepMounted: true, // Better open performance on mobile.
     }}
     classes={{
        paper: classes.drawerPaper,
     }}
     variant={useMediaQuery(theme.breakpoints.only('lg')) ? "permanent" : "temporary"}
   >
      {useMediaQuery(theme.breakpoints.only('lg')) && <Toolbar/>}

      <div className={classes.root}>
         <List>
            {props.currentOpening && props.currentOpening.chapters.map((chapter, i) =>
              <ListItem container direction={"row"}
                        component={Link}
                        to={`/chess/openings/${props.currentOpening.slug}/${i + 1}`}
                        className={props.currentChapter && props.currentChapter.url === chapter.url ? classes.active : null}
                        key={chapter.url}
              >
                 <Grid component={"span"} container alignItems={"stretch"} justify={"center"}>{i + 1}</Grid>
                 <Grid item component={Typography}>
                    {`${chapter.title.replace('Chapter ', '').replace(/\d+\. /, '')}: ${chapter.description}`}
                 </Grid>
              </ListItem>
            )}
         </List>
      </div>
   </Drawer>

}

export default OpeningChapters