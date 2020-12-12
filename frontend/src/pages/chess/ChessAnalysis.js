import React from "react";
import ChessBoard from "../../components/chess/analysis/ChessBoard";
import GamesTable from "../../components/chess/analysis/GamesTable";
import GamesSearch from "../../components/chess/analysis/GamesSearch";
import MovesTree from "../../components/chess/analysis/MovesTree";
import Notation from "../../components/chess/analysis/Notation";
import NavButtons from "../../components/chess/analysis/NavButtons";

import {Grid, Box, makeStyles} from "@material-ui/core";

import TabPanel from "../../components/chess/analysis/mobile/TabPanel";
import withStore from "../../hocs/withStore";

class ChessAnalysis extends React.Component {
    componentDidMount() {
        // this.props.stores.chessNotation.initMainLineNodes('');
        // this.props.stores.chessNotation.resetNode()
    }

    componentWillUnmount() {
        this.props.stores.chessNotation.chessGame.reset();
        this.props.stores.chessNotation.resetNode()
    }

    render() {
        let chess = this.props.stores.chessOpeningExplorer;
        let notation = this.props.stores.chessNotation;

        return (
            <Grid container justify={"space-evenly"}>
                <Grid item display={{xs: "none", lg: "block"}} lg={4} component={Box}>
                    <GamesSearch
                        name={chess.searchData.name}
                        color={chess.searchData.color}
                        onSubmit={chess.searchGames}
                        onChangeColor={e => chess.setColor(e.target.value)}
                        onChangeName={e => chess.setName(e.target.value)}
                        onKeyPressed={e => e.keyCode === 13 ? chess.searchGames() : []}
                    />
                    <GamesTable
                        games={chess.currentGames}
                        onSelectGame={notation.initMainLineNodes}
                    />
                </Grid>

                <Grid item container xs={12} sm={12} md={7} lg={8} justify={"center"} >
                    <Grid item lg={8} container direction={"column"}>

                           <Grid item> <div onWheel={e => e.deltaY < 0 ? notation.toPrev() : notation.toNext()}>
                                <ChessBoard
                                    width={window.innerWidth > 950 ? "512px" : "90vmin"}
                                    height={window.innerWidth > 950 ? "512px" : "90vmin"}
                                    orientation={notation.boardOrientation}
                                    viewOnly={false}
                                    // turnColor={chess.turnColor()}
                                    // movable={chess.calcMovable()}
                                    lastMove={notation.lastMove}
                                    fen={notation.fen}
                                    // onMove={chess.onMove}
                                    check={false}
                                    style={{margin: "auto"}}
                                />
                            </div></Grid>

                        <Box display={{sm: "block", lg: "none"}}>
                            <Grid item container justify={"center"}>
                                <NavButtons
                                    toFirst={notation.toFirst}
                                    toLast={notation.toLast}
                                    toNext={notation.toNext}
                                    toPrev={notation.toPrev}
                                    onFlip={notation.flipBoard}
                                />
                            </Grid>
                        </Box>
                    </Grid>

                    <Grid item component={Box} display={{xs: "none", lg: "block"}} lg={4}>
                        <Notation
                            notation={notation.mainLineNodes}
                            currentNode={notation.node}
                            jumpTo={notation.jumpToMove}
                        />
                        <br/>
                        <MovesTree explorerData={chess.currentMoves}/>
                        <Grid component={Box} container justify={"center"} display={{sm: "none", lg: "block"}}>
                            <NavButtons
                                toFirst={notation.toFirst}
                                toLast={notation.toLast}
                                toNext={notation.toNext}
                                toPrev={notation.toPrev}
                                onFlip={notation.flipBoard}
                            />
                        </Grid>
                    </Grid>

                </Grid>

                <Grid item component={Box} display={{xs: "block", lg: "none"}} xs sm md={5}>
                    <TabPanel
                        tab1={
                            <>
                                <Notation
                                    notation={notation.mainLineNodes}
                                    currentNode={notation.node}
                                    jumpTo={notation.jumpToMove}
                                />
                                <br/>
                                <MovesTree explorerData={chess.currentMoves}/></>
                        }
                        tab2={
                            <>
                                <GamesSearch
                                    name={chess.searchData.name}
                                    color={chess.searchData.color}
                                    onSubmit={chess.searchGames}
                                    onChangeColor={e => chess.setColor(e.target.value)}
                                    onChangeName={e => chess.setName(e.target.value)}
                                    onKeyPressed={e => e.keyCode === 13 ? chess.searchGames() : []}
                                />
                                <GamesTable
                                    games={chess.currentGames}
                                    onSelectGame={notation.initMainLineNodes}
                                />
                            </>}
                    />
                </Grid>
            </Grid>
        )
    }
}

export default withStore(ChessAnalysis)