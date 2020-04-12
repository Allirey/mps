import React from "react";
import {Table, TableBody, TableCell, TableHead, TableRow, withStyles, TableContainer, Paper} from "@material-ui/core";

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: "#2A293E",
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
        height: "10px",
        paddingTop: "0px",
        paddingBottom: "0px"
    },
}))(TableCell);

export default class extends React.PureComponent {
    render() {
        const treeData = this.props.treeData;
        return (
            <TableContainer style={{overflow: "auto", height: "35vh"}}>
                <Table size={"small"} stickyHeader>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Moves</StyledTableCell>
                            <StyledTableCell>Games</StyledTableCell>
                            <StyledTableCell>Score</StyledTableCell>
                            <StyledTableCell>Last played</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {treeData.map((row, i) =>
                            <TableRow key={i} hover={true} style={{cursor: "pointer"}}>
                                <StyledTableCell><strong>{row.move}</strong></StyledTableCell>
                                <StyledTableCell>{row.gamesCount}</StyledTableCell>
                                <StyledTableCell>{row.score}</StyledTableCell>
                                <StyledTableCell>{row.lastPlayed}</StyledTableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }
}
