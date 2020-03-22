import React from 'react'
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from "@material-ui/core";
import {Link} from "react-router-dom";

export default class extends React.PureComponent {
    state = {
        games: this.props.games,
        parsed: []
    }

    render() {
        return (
            <TableContainer>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>date</TableCell>
                            <TableCell>white</TableCell>
                            <TableCell>black</TableCell>
                            <TableCell>result</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.props.games.map(row => (
                            <TableRow key={row.id}>
                                <TableCell>{row.date.split('.')[0]}</TableCell>
                                <TableCell>{row.white}</TableCell>
                                <TableCell>{row.black}</TableCell>
                                <TableCell><Link to={{pathname: "/games/"+row.url, state:{moves: row.moves}}}>{row.result}</Link></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }
}