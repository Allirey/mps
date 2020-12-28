import React, {useEffect, useState} from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import P404 from "../errors/error404";
import withStore from '../hocs/withStore';
import Header from '../components/header';
import PrivateRoute from "../components/PrivateRoute";
import Spinner from "../components/spinner";
import HomePage from "../pages/HomePage";
import About from "../pages/About";
import ChessAnalysis from "../pages/chess/ChessAnalysis";
import Quizy from "../pages/Quizy";
import Login from "../pages/Login";
import Register from "../pages/Register";
import PasswordReset from "../pages/PasswordReset";

function App(props) {
    const [appLoading, setAppLoading] = useState(true)

    useEffect(() => {
        props.stores.authStore.refresh().then(() => setAppLoading(false)).catch((e) => {
        })
    }, [])

    if (appLoading) return <Spinner/>

    return (
        <Router>
            <Header/>
            <div>
                <Switch>
                    <Route path="/" exact={true} component={HomePage}/>
                    <PrivateRoute path="/quizy" exact={true} component={Quizy}/>
                    <Route path="/chess/analysis" exact={true} component={ChessAnalysis}/>
                    <Route path="/login" exact={true} component={Login}/>
                    <Route path="/signup" exact={true} component={Register}/>
                    <Route path="/forgot-password" exact={true} component={PasswordReset}/>
                    <Route path="/about" exact={true} component={About}/>
                    <Route path="**" exact={true} component={P404}/>
                </Switch>
            </div>
        </Router>
    )

}

export default withStore(App);