import React from "react";
import {Button} from "@material-ui/core";
import FastRewindTwoToneIcon from "@material-ui/icons/FastRewindTwoTone";
import SkipPreviousTwoToneIcon from "@material-ui/icons/SkipPreviousTwoTone";
import SkipNextTwoToneIcon from "@material-ui/icons/SkipNextTwoTone";
import FastForwardTwoToneIcon from "@material-ui/icons/FastForwardTwoTone";
import SwapVertTwoToneIcon from "@material-ui/icons/SwapVertTwoTone";

export default function (props) {
    return (
        <>
            <Button size={"small"} onClick={props.toFirst}><FastRewindTwoToneIcon/></Button>
            <Button size={"small"} variant={"contained"} style={{backgroundColor: "#00CED1"}}
                    onClick={props.toPrev}><SkipPreviousTwoToneIcon/></Button>
            <Button size={"small"} variant={"contained"} style={{backgroundColor: "#00CED1"}}
                    onClick={props.toNext}><SkipNextTwoToneIcon/></Button>
            <Button size={"small"} onClick={props.toLast}><FastForwardTwoToneIcon/></Button>
            <Button size={"small"} variant={"contained"} color={"primary"}
                    onClick={props.onFlip}><SwapVertTwoToneIcon/></Button>
            {/*<Button variant={"contained"}>reset</Button>*/}
        </>
    )
}
