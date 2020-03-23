import React from 'react';
import {
    FormControl, TextField, Grid, Button, Checkbox, FormControlLabel
} from '@material-ui/core';
import GamesTable from "./GamesTable";
import {observer, inject} from 'mobx-react';

class GamesSearchForm extends React.Component {
    state = {
        games: [],
        white: '',
        black: '',
        ignore: false,
        is_query_new: true,
        open: false,
    };

    handleForm = () => {
        if (this.state.is_query_new === false) {
            return
        }

        // "http://10.10.86.217:8000/api/games/"
        // "/api/games/"
        this.props.stores.chess.getGames({...this.state})
        this.setState({is_query_new: false})
    };


    handleInput = (event) => {
        this.setState({[event.target.name]: event.target.value, is_query_new: true});
    };

    handleCheckBox = (e) => {
        let prev = this.state.ignore;
        this.setState({ignore: !prev, is_query_new: true})
    };

    render() {
        return (
            <div>
                <Grid container alignItems="center" direction={"row"} justify={"center"}>
                    <Grid item>
                        <FormControl>
                            <Grid item>
                                <TextField autoComplete={"off"} value={this.state.white} placeholder={"White"}
                                           name={"white"} onChange={this.handleInput}/>
                                <TextField autoComplete={"off"} value={this.state.black} placeholder={"Black"}
                                           name={"black"} onChange={this.handleInput}/>
                                <FormControlLabel label="ignore colours" labelPlacement="start" control={
                                    <Checkbox color="primary" onChange={(e) => {
                                        this.handleCheckBox(e)
                                    }}/>} name={"ignore"}/>
                            </Grid>
                            <Button variant="outlined" color="primary" onClick={this.handleForm}>Search</Button>
                        </FormControl>
                    </Grid>
                </Grid>
                <GamesTable games={this.props.stores.chess.games}/>
            </div>
        )
    }
}

export default inject('stores')(observer(GamesSearchForm));
