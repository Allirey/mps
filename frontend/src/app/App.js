import React, {useEffect} from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import P404 from "../errors/error404"
import withStore from '../hocs/withStore'
import Header from '../components/header'
import HomePage from "../pages/HomePage";
import About from "../pages/About";
import ChessAnalysis from "../pages/chess/ChessAnalysis";
import Quizy from "../pages/Quizy";
import Login from "../pages/Login";
import Register from "../pages/Register";

function App(props) {
    useEffect(() => {
        props.stores.authStore.refresh().catch((e)=>{console.log(e)})
    }, [])

    return (
        <Router>
            <Header/>
            <div>
                <Switch>
                    <Route path="/" exact={true} component={HomePage}/>
                    <Route path="/quizy" exact={true} component={Quizy}/>
                    <Route path="/chess/analysis" exact={true} component={ChessAnalysis}/>
                    <Route path="/login" exact={true} component={Login}/>
                    <Route path="/signup" exact={true} component={Register}/>
                    <Route path="/about" exact={true} component={About}/>
                    <Route path="**" exact={true} component={P404}/>
                </Switch>
            </div>
        </Router>
    )

}

export default withStore(App);