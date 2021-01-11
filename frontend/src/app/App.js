import React, {useEffect, useState} from 'react';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import P404 from "../errors/error404";
import withStore from '../hocs/withStore';
import Header from '../components/header';
import PrivateRoute from "../components/PrivateRoute";
import Spinner from "../components/spinner";
import HomePage from "../pages/HomePage";
import About from "../pages/About";
import ChessAnalysis from "../pages/chess/ChessAnalysis";
import Quizy from "../pages/Quizy";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import PasswordResetRequest from "../pages/Auth/PasswordResetRequest";
import PasswordResetChange from "../pages/Auth/PasswordResetChange";
import AccountActivation from "../pages/Auth/AccountActivation";
import ChangePassword from "../pages/Auth/ChangePassword";
import UserProfile from "../pages/UserProfile";
import EditProfile from "../pages/EditProfile";
import SnackBar from "../components/snackbar";


function App(props) {
    const [appLoading, setAppLoading] = useState(true)

    const {notifications} = props.stores

    useEffect(() => {
        props.stores.authStore.refresh().then(() => setAppLoading(false)).catch((e) => {
        })
    }, [])

    if (appLoading) return <Spinner/>

    return (
        <Router>
            <Header/>
            <SnackBar
                open={notifications.isOpen}
                text={notifications.text}
                onClose={notifications.handleClose}
                severity={notifications.severity}
            />
            <div>
                <Switch>
                    <Route path="/" exact={true} component={HomePage}/>
                    <Route path="/chess/analysis" exact={true} component={ChessAnalysis}/>
                    <Route path="/login" exact={true} component={Login}/>
                    <Route path="/signup" exact={true} component={Register}/>
                    <Route path="/accounts/confirm-email/:id/:token" exact={true} component={AccountActivation}/>
                    <PrivateRoute path="/accounts/password/change" exact={true} component={ChangePassword}/>
                    <Route path="/accounts/password/reset" exact={true} component={PasswordResetRequest}/>
                    <Route path="/accounts/password/reset/:id/:token" exact={true} component={PasswordResetChange}/>
                    <Route path="/about" exact={true} component={About}/>
                    <PrivateRoute path="/settings" exact={true} component={EditProfile}/>
                    <Route path="/users" exact={true} component={HomePage}/>
                    <Route path="/users/:username" exact={true} component={UserProfile}/>
                    <Route path="**" exact={true} component={P404}/>
                </Switch>
            </div>
        </Router>
    )

}

export default withStore(App);