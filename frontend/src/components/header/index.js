import React from 'react'
import MobileHeader from "./MobileHeader";
import DesktopHeader from "./DesktopHeader";
import {Box} from "@material-ui/core";
import withStore from "../../hocs/withStore";

function Header(props) {

    // console.log(props.stores.authStore.currentUser)

    const store = props.stores.authStore;
    // console.log(store.currentUser)

    return (
        <>
            <Box display={{xs: "none", md: "block"}}>
                <DesktopHeader currentUser={!!store.currentUser?store.currentUser.username:''} logout={store.logout}/>
            </Box>
            <Box display={{xs: "block", md: "none"}}>
                <MobileHeader currentUser={!!store.currentUser?store.currentUser.username:''} logout={store.logout}/>
            </Box>
        </>
    )
}

export default withStore(Header)