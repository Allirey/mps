import React from 'react'
import MobileHeader from "./MobileHeader";
import DesktopHeader from "./DesktopHeader";
import {Box} from "@material-ui/core";

export default function (props) {

    return (
        <>
            <Box display={{xs: "none", md: "block"}}>
                <DesktopHeader/>
            </Box>
            <Box display={{xs: "block", md: "none"}}>
                <MobileHeader/>
            </Box>
        </>
    )
}