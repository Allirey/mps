import React from 'react';
import {
    FormControl, TextField, Grid, Button, Checkbox, FormControlLabel
} from '@material-ui/core';
import GamesTable from "./GamesTable";

export default class extends React.Component {
    state = {
        games: [],
        white: '',
        black: '',
        ignore: false,
        is_query_new: true,
        open: false,
    };

    handleClickOpen = () => {
        this.setState({open: true});
    };

    handleClose = () => {
        this.setState({open: false});
    };

    handleForm = () => {
        if (this.state.is_query_new === false) {
            return
        }

        // "/api/games/"
        fetch("/api/games/",
            {
                method: "POST",
                headers: {'Content-Type': "application/json"},
                body: JSON.stringify({
                    white: this.state.white,
                    black: this.state.black,
                    ignore: this.state.ignore ? '1' : ''
                })
            }).then(response => {
            if (!response.ok) {
                throw new Error('Something went wrong ...');
            }
            return response.json();
        }).then(data => {
            this.setState({games: data.games})
        });
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
                <GamesTable games={this.state.games}/>
            </div>
        )
    }
}
