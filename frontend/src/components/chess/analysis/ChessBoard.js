import React, {useState} from "react";
import NativeChessboard from 'react-chessground'
import "react-chessground/dist/assets/chessground.css"
import "react-chessground/dist/styles/chessground.css"
import "react-chessground/dist/assets/theme.css"
// import queen from "./images/wQ.svg"
// import rook from "./images/wR.svg"
// import bishop from "./images/wB.svg"
// import knight from "./images/wN.svg"
export default function (props) {
    return (
        <NativeChessboard
            width={props.width}
            height={props.height}
            viewOnly={props.viewOnly}
            turnColor={props.turnColor}
            check={props.check}
            movable={props.movable}
            orientation={props.orientation}
            fen={props.fen}
            style={{margin: "auto"}}
            lastMove={props.lastMove}
            onMove={(from, to) => props.onMove(from, to)}
        />
    )
}

