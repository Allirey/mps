import {useState} from "react";
import {
   Container,
   makeStyles,
   Table,
   TableCell,
   TableRow,
   TableBody,
   Button,
   TextField,
   Typography,
   useMediaQuery, useTheme
} from "@material-ui/core";
import withStore from '../hocs/withStore';
import {Link, Redirect} from "react-router-dom";
import StyledTabs from "../components/StyledTabs";
import {Helmet} from "react-helmet";

const useStyles = makeStyles(theme => ({
   root: {
      marginTop: theme.spacing(2),
      "& $a": {
         textDecoration: "none", color: "blue"
      }
   },
   logo: {
      width: "21em", "& img": {width: "100%", height: "100%"}
   },
   saveButton: {
      color: "white",
      backgroundColor: "#4caef9",
      textTransform: "none",
      marginRight: "7px",
      marginTop: "7px",
      "&:hover": {
         backgroundColor: "#4caef9",
      }
   },
   cancelButton: {
      backgroundColor: "#ebf1ef", textTransform: "none", marginTop: "7px"
   },
}))

const AccountInfo = (props) => {
   const {currentUser} = props;

   return (
     <Table>
        <TableBody>
           <TableRow>
              <TableCell>ID</TableCell>
              <TableCell> {currentUser.username}</TableCell>
           </TableRow>
           <TableRow>
              <TableCell>Email</TableCell>
              <TableCell> {currentUser.email}</TableCell>
           </TableRow>
           <TableRow>
              <TableCell>Password</TableCell>
              <TableCell> <Link to={"/accounts/password/change"}>change
                 password</Link></TableCell>
           </TableRow>
        </TableBody>
     </Table>
   )
}

const StyledTextField = (props) => {
   return (<TextField size={"small"} variant={"outlined"} {...props}/>)
}

function EditProfile(props) {
   const classes = useStyles();
   const theme = useTheme();
   const matches = useMediaQuery(theme.breakpoints.up('sm'));

   const [editRowIndex, setEditRowIndex] = useState(null);
   const [editValue, setEditValue] = useState('');

   const {currentUser, isAuthenticated} = props.stores.authStore;

   if (!props.stores.authStore.currentUser) return <Redirect to={"/"}/>

   const fieldMapping = {
      0: "first_name", 1: "biography", 2: "web_site",
   }

   const handleSave = (key) => {
      props.stores.authStore.editUserData({[fieldMapping[[key]]]: editValue})
        .then((data) => {
           setEditRowIndex(null);
           setEditValue('')
           const {access, ...rest} = data
           props.stores.api.token = access
           props.stores.authStore.currentUser = {...props.stores.authStore.currentUser, ...rest}
        }).catch((e) => {
         props.stores.notifications.notify(Object.values(e.message)[0], 4);
      })
   }

   const userInfo = {
      'Name': currentUser.first_name, 'Biography': currentUser.biography, 'Website': currentUser.web_site,
   }

   return (
     <>
        <Helmet
          title={'Settings'}
        />
        <Container disableGutters={!matches} className={classes.root} maxWidth={'sm'}>{!currentUser ? null :
          <StyledTabs variant={matches && "fullWidth" || "scrollable"} tabs={{
             'Basic Info':
               <Table>
                  <TableBody>
                     {Object.entries(userInfo).map(([key, value], i) => {
                        return (editRowIndex === i ?
                          <TableRow key={i}>
                             <TableCell width={"20%"}>{key}</TableCell>
                             <TableCell align={"left"}><StyledTextField value={editValue}
                                                                        onChange={(e) => setEditValue(e.target.value)}/>
                                <br/>
                                <Button className={classes.saveButton} disableRipple size={"small"}
                                        onClick={() => handleSave(i)}>Save</Button>
                                <Button className={classes.cancelButton} disableRipple size={"small"}
                                        onClick={() => setEditRowIndex(null)}>Cancel</Button></TableCell>
                          </TableRow> :
                          <TableRow key={i}>
                             <TableCell width={"20%"}>{key}</TableCell>
                             <TableCell align={"left"}>{value}</TableCell>
                             <TableCell width={"15%"}><Link to={"#"} onClick={(e) => {
                                e.preventDefault();
                                setEditRowIndex(i);
                                setEditValue(value)
                             }} key={i}>Edit</Link></TableCell>
                          </TableRow>)
                     })}
                  </TableBody>
               </Table>,
             'Account Info': <AccountInfo currentUser={currentUser}/>,
             'Notifications': <Typography variant={"h5"} align={"center"}>Coming soon...</Typography>,
             'Security': <Typography variant={"h5"} align={"center"}>Coming soon...</Typography>,
          }}/>
        }
        </Container>
     </>
   )

}

export default withStore(EditProfile)