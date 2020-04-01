import React from 'react';
import {Grid, Container} from "@material-ui/core";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import P404 from "../errors/error404"
import withStore from '../hocs/withStore'
import Header from '../components/header'
import ChessGame from '../pages/chess/ChessGame'
import HomePage from "../pages/HomePage";
import GamesSearch from "../pages/chess/GamesSearch";
import About from "../pages/About";
import OpeningExplorer from "../pages/chess/OpeningExplorer";


class App extends React.Component {
    render() {

        return (
            <Router>
                <Header/>
                <Container style={{ padding: 7}}>
                    <div>
                        <Switch>
                            <Route path="/" exact={true} component={HomePage}/>
                            <Route path="/chess/games" exact={true} component={GamesSearch}/>
                            <Route path="/chess/games/:url" component={ChessGame}/>
                            <Route path="/chess/explorer" exact={true} component={OpeningExplorer}/>
                            <Route path="/about" exact={true} component={About}/>
                            <Route path="**" exact={true} component={P404}/>
                        </Switch>
                    </div>
                </Container>
            </Router>
        )
    }
}

export default withStore(App);