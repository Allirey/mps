import React, {memo} from 'react'
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, makeStyles, Paper} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    root: {
        overflow: "auto",
        height: "75vmin",

        "& tbody > tr": {
            cursor: "pointer",
        },

        '& tbody > tr:nth-child(even)': {backgroundColor: '#f2f2f2'},

        // '& tbody > tr:hover': {backgroundColor: '#F5D6C6'},
        "& .MuiTableRow-hover:hover": {
            backgroundColor: "#F5D6C6",
        },

        "& thead > tr > th": {
            backgroundColor: "#2A293E",
            color: theme.palette.common.white,
        },
        "& tbody > tr > td": {
            fontSize: 14,
            height: "10px",
            padding: "0px 5px 0px 5px"
        },
    }
}));

function GamesTable(props) {
    const classes = useStyles();
    console.log('table');
    let games = props.games;
    return typeof (games) == "undefined" || games.length === 0 ? null : (
        <TableContainer className={classes.root} component={Paper}>
            <Table size={"small"} stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell>White</TableCell>
                        <TableCell>Black</TableCell>
                        <TableCell>Result</TableCell>
                        <TableCell>Year</TableCell>
                        {/*<TableCell>Notation</TableCell>*/}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {games.map((game, i) => (
                        <TableRow key={game.url} hover={true}
                                  onClick={() => props.onSelectGame(game.url)}
                        >
                            <TableCell>{game.white.split(', ')[0]}</TableCell>
                            <TableCell>{game.black.split(', ')[0]}</TableCell>
                            <TableCell>{game.result}</TableCell>
                            <TableCell>{game.date.split('.')[0]}</TableCell>
                            {/*<TableCell>{game.moves.slice(0, 7)}</TableCell>*/}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>)
}

export default memo(GamesTable)