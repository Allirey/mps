import React, {PureComponent} from 'react'
import {Paper, Typography} from "@material-ui/core";

export default class extends PureComponent {

    render() {
        return (
                <Typography style={{maxHeight:"250px", maxWidth:"90vw", padding:5, overflow: "auto", fontSize: 14}}>
                    <p><strong>{this.props.game.white} - {this.props.game.black}
                    <br/>
                    {this.props.game.result}
                    </strong></p>
                    {this.props.game.moves}
                </Typography>


            // <div>
            //     <p>{this.props.game.white} - {this.props.game.black} {this.props.game.result}</p>
            //     <div style={{overflow: "auto", height: window.innerWidth < 700?"80vw":"30vw"}}>
            //         <Table size={"small"}>
            //             <TableBoady>
            //                 {this.props.game.moves.replace(/\n/g, ' ').replace(/\d+\. |{.+} |\$\d+ /g, '').split(' ').map((row, i) => (
            //                     <TableRow>
            //                         <TableCell style={{
            //                             height: "10px",
            //                             padding: "0px"
            //                         }}>{i + 1}</TableCell>
            //                         <TableCell style={{height: "10px", padding: "0px"}}>
            //                             {row}
            //                         </TableCell>
            //                         <TableCell style={{height: "10px", padding: "0px"}}>
            //                             {row}
            //                         </TableCell>
            //
            //                     </TableRow>
            //                 ))}
            //             </TableBoady>
            //         </Table></div>
            // </div>
        );
    }
}