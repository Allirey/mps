import React, {useEffect} from "react";
import {
    Container,
    makeStyles,
    Table,
    TableContainer,
    TableCell,
    TableRow,
    TableBody,
    TableHead, Paper, Grid, CssBaseline
} from "@material-ui/core";
import withStore from '../hocs/withStore';
import {useParams, Link, Redirect} from "react-router-dom";
import StyledTabs from "../components/StyledTabs";
import SnackBar from "../components/snackbar";

const useStyles = makeStyles(theme => ({
    root: {
        marginTop: theme.spacing(2),
        "& $a": {
            textDecoration: "none",
            color: "blue"
        }
    },
    logo: {
        width: "21em",
        "& img": {width: "100%", height: "100%"}
    },
}))


const accountInfo = (currentUser) => {
    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell colSpan={3}>Account Information</TableCell>
                </TableRow>
            </TableHead>

            <TableBody>
                <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell> {currentUser.username}</TableCell>
                    <TableCell><Link to={"#"}>Edit</Link></TableCell>
                </TableRow>

                <TableRow>
                    <TableCell>email</TableCell>
                    <TableCell> {currentUser.email}</TableCell>
                    <TableCell><Link to={"#"}>Edit</Link></TableCell>
                </TableRow>

                <TableRow>
                    <TableCell>password</TableCell>
                    <TableCell> <Link to={"/accounts/password/change"}>change
                        password</Link></TableCell>
                    <TableCell>{""}</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    )
}

const basicInfo = (currentUser) => {
    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell colSpan={3}>Basic Information</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell> {currentUser.first_name}</TableCell>
                    <TableCell><Link to={"#"}>Edit</Link></TableCell>
                </TableRow>

                <TableRow>
                    <TableCell>Gender</TableCell>
                    <TableCell> {currentUser.first_name}</TableCell>
                    <TableCell><Link to={"#"}>Edit</Link></TableCell>
                </TableRow>

                <TableRow>
                    <TableCell>Location</TableCell>
                    <TableCell> {currentUser.first_name}</TableCell>
                    <TableCell><Link to={"#"}>Edit</Link></TableCell>
                </TableRow>

                <TableRow>
                    <TableCell>Birthday</TableCell>
                    <TableCell> {currentUser.first_name}</TableCell>
                    <TableCell><Link to={"#"}>Edit</Link></TableCell>
                </TableRow>

                <TableRow>
                    <TableCell>Biography</TableCell>
                    <TableCell> {currentUser.first_name}</TableCell>
                    <TableCell><Link to={"#"}>Edit</Link></TableCell>
                </TableRow>

                <TableRow>
                    <TableCell>Website</TableCell>
                    <TableCell> {currentUser.first_name}</TableCell>
                    <TableCell><Link to={"#"}>Edit</Link></TableCell>
                </TableRow>
            </TableBody>
        </Table>
    )
}

function EditProfile(props) {
    const classes = useStyles();

    const [open, setOpen] = React.useState(props.stores.authStore.showSuccessPasswordChanged);
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    }

    useEffect(() => {

        return () => {
            props.stores.authStore.setShowSuccessPasswordChanged(false)
        };
    }, [])

    const {currentUser} = props.stores.authStore

    if (!props.stores.authStore.isAuthenticated) return <Redirect to={"/"}/>
    return (
        <Container className={classes.root} maxWidth={'sm'}>
            {!currentUser ? null :
                <>
                    <SnackBar
                    open={open}
                    onClose={handleClose}
                    text={"Password successfully changed!"}
                />
                    <StyledTabs tabs={{
                        'Basic Info':
                            basicInfo(currentUser),
                        'Account Info':
                            accountInfo(currentUser),
                    }}/>
                </>
            }
        </Container>
    )
}

export default withStore(EditProfile)