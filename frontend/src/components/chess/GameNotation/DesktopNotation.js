import React, {PureComponent} from 'react'
import {Table, TableBody, TableCell, TableRow} from "@material-ui/core";

export default class extends PureComponent {
    render() {
        const moves = function splitArray(candid) {
            let oddOnes = [], evenOnes = [];
            let result = []
            for (let i = 0; i < candid.length; i++)
                (i % 2 === 0 ? evenOnes : oddOnes).push(candid[i]);
            for (let i=0; i < oddOnes.length; i++){
                result.push([evenOnes[i], oddOnes[i]? oddOnes[i]: null])
            }
            return result;
        }(this.props.game.moves.replace(/\n/g, ' ').replace(/\d+\. |{.+} |\$\d+ /g, '').split(' '))


        return (
            <div>
                <p>{this.props.game.white} - {this.props.game.black} {this.props.game.result}</p>
                <div style={{overflow: "auto", height: "30vw"}}>
                    <Table size={"small"}>
                        <TableBody>
                            {moves.map((row, i) => (

                                <TableRow key={i}>
                                    <TableCell style={{
                                        height: "10px",
                                        padding: "0px"
                                    }}>{i + 1}</TableCell>
                                    <TableCell style={{height: "10px", padding: "0px"}}>
                                        {row[0]}
                                    </TableCell>
                                    <TableCell style={{height: "10px", padding: "0px"}}>
                                        {row[1]?row[1]:''}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table></div>
            </div>
        );
    }
}