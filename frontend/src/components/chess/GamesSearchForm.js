import React from 'react';
import {
    FormControl, TextField, Grid, Button, Checkbox, FormControlLabel
} from '@material-ui/core';

export default function (props) {
    return (
        <FormControl>
            <Grid item>
                <TextField
                    autoFocus={true}
                    autoComplete={"off"}
                    value={props.white}
                    onChange={props.handleWhiteChange}
                    onKeyDown={props.onKeyPressed}
                    style={{padding: 5}}
                    label={'White'}/>
                <TextField
                    autoComplete={"off"}
                    value={props.black}
                    onChange={props.handleBlackChange}
                    onKeyDown={props.onKeyPressed}
                    style={{padding: 5}}
                    label={'Black'}/>
                <FormControlLabel
                    label="ignore colours"
                    labelPlacement="start"
                    control={
                        <Checkbox
                            color="primary"
                            onChange={props.handleIgnoreChange}
                            onKeyDown={props.onKeyPressed}/>}/>
            </Grid>
            <Button variant="outlined" color="primary" onClick={props.handleSubmitForm}>Search</Button>
        </FormControl>
    )
}