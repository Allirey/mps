import React from "react";
import {Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Paper} from "@material-ui/core";

export default function (props) {
    return (
        <Grid container justify={"space-evenly"}>
            <Grid item>
                <TextField
                    label={"Player name"}
                    value={props.name}
                    onChange={props.onChangeName}
                    onKeyDown={props.onKeyPressed}
                />
            </Grid>
            <Grid item>
                <FormControl>
                    <InputLabel>Color</InputLabel>
                    <Select
                        value={props.color}
                        onChange={props.onChangeColor}
                    >
                        <MenuItem value={"white"}>White</MenuItem>
                        <MenuItem value={"black"}>Black</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item>
                <Button variant={"contained"}
                        style={{backgroundColor: "#92A8D1"}}
                        onClick={props.onSubmit ? props.onSubmit : null}
                >search</Button>
            </Grid>
        </Grid>
    )
}
