import React from 'react'
import MobileHeader from "./MobileHeader";
import DesktopHeader from "./DesktopHeader";

export default function () {

    if (window.innerWidth > 880){
        return <DesktopHeader/>
    }
    else{
        return <MobileHeader/>
    }
}