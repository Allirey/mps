import React, {memo, useState} from "react";
import {
    Fab,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    makeStyles,
    TableFooter,
    TablePagination, Button
} from "@material-ui/core";
import {Clear, Delete, Done, Edit, StarBorder} from "@material-ui/icons";
import TableContainer from "@material-ui/core/TableContainer";
import PropTypes from 'prop-types';
import {
    IconButton, useTheme
} from "@material-ui/core";
import {Link} from "react-router-dom";
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import EditIcon from '@material-ui/icons/Edit';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';

const useStyles = makeStyles({
        table: {
            '& tbody > tr:nth-child(even)': {backgroundColor: '#f2f2f2'},
            "& thead > tr > th": {
                backgroundColor: "#2A293E",
                color: "white",
            }
        },
        edit: {
            '& tbody > tr:nth-child(even)': {backgroundColor: '#f2f2f2'},
            "& thead > tr > th": {
                backgroundColor: "#2A293E",
                color: "white",
            },

            backgroundColor: "white",
            '& tbody > tr > td': {
                color: "#d5d3d4",
            },
            '& tbody > tr.active': {
                backgroundColor: "white",
                '& td': {
                    color: "black"
                },
            }
        },
    }
);

const useStyles1 = makeStyles((theme) => ({
    root: {
        flexShrink: 0,
        marginLeft: theme.spacing(2.5),
    },
}));

function TablePaginationActions(props) {
    const classes = useStyles1();
    const theme = useTheme();
    const {count, page, rowsPerPage, onChangePage} = props;

    const handleFirstPageButtonClick = event => onChangePage(event, 0);
    const handleBackButtonClick = event => onChangePage(event, page - 1);
    const handleNextButtonClick = event => onChangePage(event, page + 1);
    const handleLastPageButtonClick = event => {
        onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <div className={classes.root}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPageIcon/> : <FirstPageIcon/>}
            </IconButton>
            <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
                {theme.direction === 'rtl' ? <KeyboardArrowRight/> : <KeyboardArrowLeft/>}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft/> : <KeyboardArrowRight/>}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon/> : <LastPageIcon/>}
            </IconButton>
        </div>
    );
}

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onChangePage: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};


function TermsTable(props) {
    const classes = useStyles();

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => setPage(newPage);

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const [editRow, setEditRow] = useState(null);
    const [deleteRow, setDeleteRow] = useState(null);
    const [editValue, setEditValue] = useState('');

    const handleDelete = props.onDelete;
    const handleEdit = props.onEdit;
    // const terms = props.data;
    const terms = props.data.filter(obj => obj.key.toLowerCase().includes(props.searchFilter.toLowerCase()));

    return (
        <TableContainer component={Paper}>
            <Table size={"small"}
                   className={editRow === null && deleteRow === null ? classes.table : classes.edit}>
                <TableHead>
                    <TableRow>
                        <TableCell>Actions</TableCell>
                        <TableCell>Term</TableCell>
                        <TableCell>Definition</TableCell>
                        <TableCell>Rate</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {(rowsPerPage > 0
                            ? terms.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            : terms
                    ).map((el, i) => (
                        el.key !== editRow && el.key !== deleteRow ? (
                                <TableRow key={el.key}>
                                    <TableCell style={{whiteSpace: "nowrap"}}>
                                        <Button size={"small"}
                                                style={{backgroundColor: "lightgreen", color: "white"}}
                                                onClick={() => {
                                                    setEditValue(el.value);
                                                    setEditRow(el.key)
                                                }}
                                        ><Edit/></Button>
                                        <Button color={"secondary"} size={"small"}
                                                style={{backgroundColor: "tomato", color: "white"}}
                                                onClick={() => setDeleteRow(el.key)}><Delete/></Button>
                                    </TableCell>
                                    <TableCell>{el.key}</TableCell>
                                    <TableCell>{el.value}</TableCell>
                                    <TableCell>{Array(el.rate).fill(<StarBorder
                                        style={{color: "darkgreen"}}/>)}</TableCell>
                                </TableRow>) :
                            el.key === deleteRow ? (
                                    <TableRow key={el.key} className={'active'}>
                                        <TableCell style={{whiteSpace: "nowrap"}}>
                                            <Fab size={"small"} onClick={() => {
                                                handleDelete(el);
                                                setDeleteRow(null)
                                            }}><Done/></Fab>
                                            <Fab size={"small"} onClick={() => setDeleteRow(null)}
                                                 color={"inherit"}><Clear/></Fab>
                                        </TableCell>
                                        <TableCell colSpan={1} align={"center"}>
                                            <strong>Are you sure you want to delete this row?</strong>
                                        </TableCell>
                                    </TableRow>
                                ) :
                                (
                                    <TableRow key={el.key} className={'active'}>
                                        <TableCell style={{whiteSpace: "nowrap"}}>
                                            <Fab size={"small"} onClick={() => {
                                                handleEdit({...el, value: editValue});
                                                setEditRow(null)
                                            }}><Done/></Fab>
                                            <Fab size={"small"} onClick={() => setEditRow(null)}
                                                 color={"inherit"}><Clear/></Fab>
                                        </TableCell>
                                        <TableCell>{el.key}</TableCell>
                                        <TableCell onChange={(e) => setEditValue(e.target.value)} component={TextField}
                                                   multiline={"true"}
                                                   value={editValue}/>
                                        <TableCell>{Array(el.rate).fill(<StarBorder
                                            style={{color: "darkgreen"}}/>)}</TableCell>
                                    </TableRow>)
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TablePagination
                            rowsPerPageOptions={[10, 15, 20, {label: 'All', value: -1}]}
                            colSpan={4}
                            count={terms.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            SelectProps={{
                                inputProps: {'aria-label': 'rows per page'},
                                native: true,
                            }}
                            onChangePage={handleChangePage}
                            onChangeRowsPerPage={handleChangeRowsPerPage}
                            ActionsComponent={TablePaginationActions}
                        />
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    )
}

export default memo(TermsTable)