import React, {useEffect, useState} from "react";
import {
   Container,
   makeStyles,
   Typography,
   Link,
   Button,
   useTheme,
   useMediaQuery,
   Grid,
} from "@material-ui/core";
import withStore from '../../hocs/withStore';
import {useParams} from 'react-router-dom'
import Spinner from '../../components/spinner';
import ReactQuill from "react-quill";
import Dialog from "../../components/Dialog";

const useStyles = makeStyles(theme => ({
   root: {
      marginTop: theme.spacing(3),
      // marginBottom: theme.spacing(10),
      paddingBottom: theme.spacing(2),
      "& $p": {
         margin: 0,
         padding: 0,
         paddingBottom: "17px",
         marginBottom: theme.spacing(0),
      },
      "& $img": {
         maxWidth: "100%",
         height: "auto",
      },

      "& $a": {
         textDecoration: "none",
         color: "blue",
      },
      '& $blockquote': {
         borderLeft: "4px solid #ccc",
         paddingLeft: "16px",
      },
   },
   editor: {
      '& .ql-bubble .ql-editor a':
        {
           textDecoration: "none",
           color: "blue",
        },
      '& $p': {
         fontSize: "15px",
         wordBreak: "break-word",
      },
      '& .ql-editor': {padding: 0,},
      '& .ql-bubble .ql-editor pre.ql-syntax': {
         margin: "14px, 0",
         padding: "7px 21px",
         backgroundColor: "#F5F8FC",
         color: 'black',
         fontWeight: 400,
         fontFamily: "Menlo,'Courier New',Courier,monospace",
      },
   },
   submit: {
      borderRadius: '17px',
      borderColor: "black",
      // border: "2px solid #333",
      color: "#4caef9",
      backgroundColor: "white",
      margin: theme.spacing(7),
      fontSize: "18px",
      height: "30px",
      textTransform: "none",
      "& button": {
         fontStyle: "normal",
         padding: "4px 12px",
         margin: "0 0 15px",
         fontWeight: "600",


      },

      "&:hover": {
         color: "white",
         backgroundColor: "#4caef9",
      }

   },
   submitRelative: {
      position: "relative",
      marginLeft: theme.spacing(5),
      marginTop: theme.spacing(7),
   },
   submitFixed: {
      position: "fixed",
   },

   deleteButton: {
      marginTop: theme.spacing(13),
      backgroundColor: "white",
      color: "lightgrey",
      "&:hover": {
         backgroundColor: "grey",
         color: "white",
      }
   }

}))

function ArticleDetail(props) {
   const classes = useStyles();

   const theme = useTheme();
   const matches = useMediaQuery(theme.breakpoints.up('md'));
   const [post, setPost] = useState(null)
   const [editMode, setEditMode] = useState(false)
   const [title, setTitle] = useState('')
   const [body, setBody] = useState('')

   const [open, setOpen] = React.useState(false);

   const handleClickOpen = () => {
      setOpen(true);
   };

   const handleClose = () => {
      setOpen(false);
   };

   const {slug} = useParams();
   const makeDate = dateString => new Date(dateString).toDateString().split(' ')
     .splice(1).join(' ')

   useEffect(() => {
      props.stores.posts.getPost(slug).then(post => {
         setPost(post)
         setTitle(post.title)
         setBody(post.body)
      }).catch((e) => {
         props.stores.notifications.notify(JSON.stringify(e), 4)
      })
   }, [])

   const {currentUser} = props.stores.authStore

   const showEditButton = () => {
      return !!currentUser && !!post && (currentUser.is_staff ||
        currentUser.username.toLowerCase() === post.author.username.toLowerCase())
   }

   const handleSubmit = () => {
      if (editMode) {
         props.stores.posts.updatePost(slug, {slug, title, body}).then(data => {
            setEditMode(!editMode)
            setPost(data)
            setTitle(data.title)
            setBody(data.body)

         }).catch(e => {
            // props.stores.notifications.notify(JSON.stringify(e), 4)
            props.stores.notifications.notify("something goes wrong...", 3)
         })
      } else {
         setEditMode(!editMode)
      }
   }

   const handleDelete = () => {
      //todo show alert yes or no
      props.stores.posts.deletePost(slug).then((data) => {
         props.stores.notifications.notify('Successfully deleted', 2)
         props.history.replace('/blog')
      }).catch(e => {
         console.log(e)
         props.stores.notifications.notify('Something goes wrong...', 3)
      })
   }

   const modules = {
      toolbar: [
         ['bold', 'italic', 'link', {'header': 1}, {'header': 2}, 'blockquote', 'code-block',
            {'list': 'bullet'}, 'image'],
      ],
   }

   const formats = [
      'header',
      'bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block',
      'list', 'bullet', 'indent',
      'link', 'image'
   ]

   if (!post) return <Spinner/>

   return (
     <Grid container direction={"row"}>
        <Grid item lg={2} md={1} sm={1}/>
        <Grid item lg={8} md={9} sm={12} xs={12}>
           <Container className={classes.root} maxWidth={"md"}>
              <div>
                 <Typography variant={"h3"} align={"center"}>{title}</Typography>
                 <Typography gutterBottom variant="subtitle2" color="textSecondary" align={"center"}>
                    {makeDate(post.publish)} by <Link
                   href={`/users/${post.author.username}`}>{post.author.username}</Link>
                 </Typography><br/><br/>

                 <ReactQuill
                   className={classes.editor}
                   value={body}
                   theme={'bubble'}
                   placeholder={"Share your experience here..."}
                   onChange={setBody}
                   readOnly={!editMode}
                   modules={modules}
                   formats={formats}
                 >
                    {/*<article>*/}
                    {/*   /!*<h1/>*!/*/}
                    {/*</article>*/}
                 </ReactQuill>
              </div>
           </Container>
        </Grid>
        <Grid container direction={matches ? 'column' : "row"} item xs={12} sm={12} md={2} lg={2}>
           <Grid item>
              {showEditButton() ?
                <Button
                  size={"small"}
                  onClick={handleSubmit}
                  className={`${classes.submit} ${matches ? classes.submitFixed : classes.submitRelative}`}
                >{editMode ? "Publish" : "Edit"}</Button> : null}
           </Grid>
           <Grid item>
              {showEditButton() && editMode &&
              <Button
                size={"small"}
                onClick={handleClickOpen}
                className={`${classes.submit} 
               ${classes.deleteButton} ${matches ? classes.submitFixed : classes.submitRelative}`}
              >Delete</Button>}

           </Grid>
        </Grid>
        <Dialog
          open={open}
          onClose={handleClose}
          onDelete={handleDelete}
        />

     </Grid>
   )
}

export default withStore(ArticleDetail)