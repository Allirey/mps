import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import P404 from "../errors/error404"
import withStore from '../hocs/withStore'
import Header from '../components/header'
import ChessGame from '../pages/chess/ChessGame'
import HomePage from "../pages/HomePage";
import GamesSearch from "../pages/chess/GamesSearch";
import About from "../pages/About";
import OpeningExplorer from "../pages/chess/OpeningExplorer";
import ChessAnalysis from "../pages/chess/ChessAnalysis";


class App extends React.Component {
    render() {
        return (
            <Router>
                <Header />
                    <div>
                        <Switch>
                            <Route path="/" exact={true} component={HomePage}/>
                            <Route path="/chess/games" exact={true} component={GamesSearch}/>
                            <Route path="/chess/games/:url" component={ChessGame}/>
                            <Route path="/chess/explorer" exact={true} component={OpeningExplorer}/>
                            <Route path="/chess/analysis" exact={true} component={ChessAnalysis}/>
                            <Route path="/about" exact={true} component={About}/>
                            <Route path="**" exact={true} component={P404}/>
                        </Switch>
                    </div>
            </Router>
        )
    }
}

export default withStore(App);