import React from 'react';
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

class App extends React.Component {
    render() {
        return (
            <Router>
                <Header />
                    <div>
                        <Switch>
                            <Route path="/" exact={true} component={HomePage}/>
                            <Route path="/quizy" exact={true} component={Quizy}/>
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