import React from 'react';
import GamesSearchForm from "../components/chess/GamesSearchForm";
import ChessGame from '../pages/chess/ChessGame'
import ChessBoard from '../components/chess/LichessBoard'
import P404 from "../errors/error404"
import {Grid, Container, CardHeader, CardContent, Button, AppBar} from "@material-ui/core";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import withStore from '../hocs/withStore'
import HomePage from "../pages/HomePage";


class App extends React.Component {
    render() {
        return (
            <Router>
                <AppBar position="static" style={{background: "lightblue", flexGrow: 1, marginBottom: 7}}>
                    <Grid container direction={"row"}>
                        <Button color={"primary"} style={{maxWidth: "100px", backgroundColor: "lightgrey" }}>
                            <Link to="/" style={{ textDecoration: 'none', color: "white" }}>Home</Link>
                        </Button>
                        <Button style={{maxWidth: "200px"}}>
                            <Link to="/games" style={{ textDecoration: 'none', color: "white" }}>games search</Link>
                        </Button>
                        <Button style={{maxWidth: "200px"}}>
                            <Link to="#" style={{ textDecoration: 'none', color: "white" }}>openings tree</Link>
                        </Button>
                    </Grid>
                </AppBar>
                <Container style={{ padding: 7}}>

                    <div>
                        <nav>
                            <Grid container
                                  direction="row"
                                  justify="center"
                                  alignItems="center"
                            >
                            </Grid>
                        </nav>
                        <Switch>
                            <Route path="/" exact={true} component={HomePage}/>
                            <Route path="/games" exact={true} component={GamesSearchForm}/>
                            {/*<Route path="/analysis" exact={true} component={ChessBoard}/>*/}
                            <Route path="/games/:url" component={ChessGame}/>
                            <Route path="**" exact={true} component={P404}/>
                        </Switch>
                    </div>
                </Container>
            </Router>
        )
    }
}

export default withStore(App);