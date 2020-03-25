import React from "react";
import DesktopNotation from "./DesktopNotation";
import MobileNotation from "./MobileNotation";

export default function (props) {

    if (window.innerWidth > 880){
        return <DesktopNotation {...props}/>
    }
    else{
        return <MobileNotation {...props}/>
    }
}