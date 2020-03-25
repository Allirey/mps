import React from 'react'
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from "@material-ui/core";
import {Link} from "react-router-dom";

export default class extends React.PureComponent {
    render() {
        const games = this.props.games;

        console.log(games)



        if (games.length !== 0) {
            return (<TableContainer>
                <Table size={"small"} style={{width: "80vw", padding: "0px"}}>
                    <TableHead>
                        <TableRow>
                            {/*<TableCell style={{ width: "10px", padding: "10px"}}>date</TableCell>*/}
                            <TableCell style={{width: "7px", padding: "5px"}}>#</TableCell>
                            <TableCell style={{width: "100px", padding: "5px"}}>white</TableCell>
                            <TableCell style={{width: "100px", padding: "5px"}}>black</TableCell>
                            <TableCell style={{width: "100px", padding: "5px"}}>result</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.props.games.map((row, i) => (
                            <TableRow key={row.id}>
                                <TableCell>{i + 1}</TableCell>
                                {/*<TableCell>{row.date.split('.')[0]}</TableCell>*/}
                                <TableCell>{row.white}</TableCell>
                                <TableCell>{row.black}</TableCell>
                                <TableCell><Link to={{
                                    pathname: "/chess/games/" + row.url,
                                    state: {moves: row.moves}
                                }}>{row.result}</Link></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>)
        } else {
            return (<></>)
        }
    }
}