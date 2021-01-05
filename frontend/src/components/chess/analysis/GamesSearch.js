import React from "react";
import {Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Paper} from "@material-ui/core";

export default function (props) {
    return (
        <Grid container justify={"space-evenly"}>
            <Grid item>
                <TextField
                    size={"small"}
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
                        <MenuItem value={"w"}>White</MenuItem>
                        <MenuItem value={"b"}>Black</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item>
                <Button disableRipple variant={"contained"}
                        style={{backgroundColor: "#92A8D1"}}
                        onClick={props.onSubmit}
                >search</Button>
            </Grid>
        </Grid>
    )
}
