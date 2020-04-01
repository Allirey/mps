import React from "react";
import {inject, observer} from "mobx-react";
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@material-ui/core";


class OpeningExplorer extends React.Component {



    render() {
        return (
            <>
            {/*    <TableContainer>*/}
            {/*    <Table size={"small"} style={{maxWidth: "80vw", padding: "0px"}}>*/}
            {/*        <TableHead>*/}
            {/*            <TableRow>*/}
            {/*                <TableCell style={{width: "7px", padding: "5px"}}>#</TableCell>*/}
            {/*                <TableCell style={{width: "10px", padding: "5px"}}>result</TableCell>*/}
            {/*                <TableCell style={{width: "100px", padding: "5px"}}>moves</TableCell>*/}
            {/*            </TableRow>*/}
            {/*        </TableHead>*/}
            {/*        <TableBody>*/}
            {/*            {this.props.stores.chess.games.map((row, i) => (*/}
            {/*                <TableRow key={row.id}>*/}
            {/*                    <TableCell>{i + 1}</TableCell>*/}
            {/*                    <TableCell>{row.result}</TableCell>*/}
            {/*                    <TableCell>{row.moves.replace(/\n/g, ' ').replace(/\d+\. |{.+} |\$\d+ /g, '').split(' ').slice(0, 10).join(' ')}</TableCell>*/}
            {/*                </TableRow>*/}
            {/*            ))}*/}
            {/*        </TableBody>*/}
            {/*    </Table>*/}
            {/*</TableContainer>*/}
                </>
        )
    }
}

export default inject('stores')(observer(OpeningExplorer));