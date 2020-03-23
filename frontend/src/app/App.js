import React from 'react';
import GamesSearchForm from "../components/chess/GamesSearchForm";
import ChessGame from '../pages/chess/ChessGame'
import ChessBoard from '../components/chess/LichessBoard'
import P404 from "../errors/error404"
import {Grid, CardHeader, CardContent} from "@material-ui/core";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import withStore from '../hocs/withStore'


class App extends React.Component {
    render() {
        return (
            <>
                <Router>
                    {/*<CardHeader title={''}>*/}
                    {/*</CardHeader>*/}
                    <div>
                        <nav>
                            <Grid container
                                  direction="row"
                                  justify="center"
                                  alignItems="center"
                            // style={{margin: 10}}
                            >
                                <Link to="/">games</Link> | <Link to="/analysis">Analysis</Link>
                            </Grid>
                        </nav>
                        <Switch>
                            <Route path="/" exact={true} component={GamesSearchForm}/>
                            <Route path="/analysis" exact={true} component={ChessBoard}/>
                            <Route path="/games/:url" component={ChessGame}/>
                            <Route path="**" exact={true} component={P404}/>
                        </Switch>
                    </div>
                </Router>
            </>
        )
    }
}

export default withStore(App);