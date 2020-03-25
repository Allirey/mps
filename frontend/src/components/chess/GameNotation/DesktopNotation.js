import React, {PureComponent} from 'react'
import {Table, TableBody, TableCell, TableRow, TableHead} from "@material-ui/core";

export default class extends PureComponent {

    render() {
        return (
            <div>
                <p>{this.props.game.white} - {this.props.game.black} {this.props.game.result}</p>
                <div style={{overflow: "auto", height: "30vw"}}>
                    <Table size={"small"}>
                        <TableBody>
                            {this.props.game.moves.replace(/\n/g, ' ').replace(/\d+\. |{.+} |\$\d+ /g, '').split(' ').map((row, i) => (
                                <TableRow>
                                    <TableCell style={{
                                        height: "10px",
                                        padding: "0px"
                                    }}>{i + 1}</TableCell>
                                    <TableCell style={{height: "10px", padding: "0px"}}>
                                        {row}
                                    </TableCell>
                                    <TableCell style={{height: "10px", padding: "0px"}}>
                                        {row}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table></div>
            </div>
        );
    }
}