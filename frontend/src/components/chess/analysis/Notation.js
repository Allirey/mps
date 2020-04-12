import React from "react";
import {makeStyles} from "@material-ui/core";

const useStyles = makeStyles({
    root: {
        overflow: "auto",
        height: "35vh",
        cursor: "default",

        "& span": {
            cursor: "pointer",
            whiteSpace: 'nowrap'
        },
        "& span.active": {
            backgroundColor: "#435866",
            color: "#FFFFFF",
            borderRadius: 4,
        }
    }
});

export default function (props) {
    const classes = useStyles();
    const notation = props.notation;

    if (notation === []) return <></>;
    return (
        <>
            {/*<Typography><h3>{game.white} - {game.black} {game.result}</h3></Typography>*/}
            <div className={classes.root}>
                {notation.map((move, i) => (
                    <React.Fragment key={i}>
                        <span
                            onClick={() => props.jumpTo(move.ply)}
                            className={props.currentNode === move ? "active" : null}
                        >
                            {i % 2 === 0 ? Math.round((i + 1) / 2) + '. ' : ''}{move.san}
                        </span>
                        {' '}
                    </React.Fragment>
                ))}
            </div>
        </>
    )
}
