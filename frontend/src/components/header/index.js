import React from 'react'
import MobileHeader from "./MobileHeader";
import DesktopHeader from "./DesktopHeader";
import {Box} from "@material-ui/core";
import withStore from "../../hocs/withStore";
import {useHistory} from 'react-router-dom';

function Header(props) {
    const store = props.stores.authStore;
    const history = useHistory()

    const logout = () => {
        store.logout().then(()=>{
            history.push("/login")
        })
    }
    return (
        <>
            <Box display={{xs: "none", md: "block"}}>
                <DesktopHeader currentUser={store.currentUser} isLoading={props.isLoading} logout={logout}/>
            </Box>
            <Box display={{xs: "block", md: "none"}}>
                <MobileHeader currentUser={store.currentUser} isLoading={props.isLoading} logout={logout}/>
            </Box>
        </>
    )
}

export default withStore(Header)