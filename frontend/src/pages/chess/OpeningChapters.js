import {makeStyles, Fab} from "@material-ui/core";
import React from "react";
import withStore from "../../hocs/withStore";
import StudyChapters from "../../components/chess/analysis/OpeningChaptersTable";
import CloseIcon from "@material-ui/icons/Close";

const useStyles = makeStyles(theme => ({
   root: {},
   close: {
      position: "fixed",
      bottom: 20,
      right: 20,
      backgroundColor: "transparent",
      color: "red",
   }

}))

const Opening = (props) => {
   const classes = useStyles()
   const {currentOpening, onClose, getChapter, currentChapter} = props

   return (
     <>
        <Fab className={classes.close} size={"small"} disableRipple onClick={onClose}><CloseIcon/></Fab>
        <StudyChapters
          currentOpening={currentOpening}
          currentChapter={currentChapter}
        />
     </>
   )


}

export default withStore(Opening)