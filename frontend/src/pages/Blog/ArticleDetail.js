import React, {useEffect, useState} from "react";
import {
   Container,
   makeStyles,
   Typography,
   Link,
   Button,
   useTheme,
   useMediaQuery,
   Grid, TextField
} from "@material-ui/core";
import withStore from '../../hocs/withStore';
import {useParams} from 'react-router-dom'
import Dialog from "../../components/Dialog";
import ReactQuill, {Quill} from "react-quill";
import {Helmet} from "react-helmet";
import {Skeleton} from '@material-ui/lab';

const LinkQuill = Quill.import('formats/link');

class MyLink extends LinkQuill {
   static create(value) {
      let node = super.create(value);
      value = this.sanitize(value);
      if (!value.startsWith("http")) {
         value = "http://" + value;
      }
      node.setAttribute('href', value);
      node.setAttribute('rel', 'noopener noreferrer');
      node.setAttribute('target', '_blank');
      return node;
   }
}

Quill.register(MyLink);

const useStyles = makeStyles(theme => ({
   root: {
      marginTop: theme.spacing(3),
      // marginBottom: theme.spacing(10),
      paddingBottom: theme.spacing(2),
      "& $p": {
         paddingBottom: "17px",
         marginBottom: theme.spacing(0),
         fontFamily: "'Pt Sans', Arial, sans-serif",
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
      '& .ql-container': {
         fontSize: "17px",
         wordBreak: "break-word",
      },
   },
   editor: {
      '& .ql-bubble .ql-editor a':
        {
           textDecoration: "none",
           color: "blue",
           whiteSpace: "normal",
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
   title: {
      wordBreak: "break-word",
      margin: 0,
      '& $input': {
         fontSize: "32px",
         '&::-webkit-input-placeholder': {
            fontStyle: "italic",
         }
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
         width: "100%",
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
   },
   skeleton: {
      padding: theme.spacing(3)
   }
}))

function ArticleDetail(props) {
   const classes = useStyles();

   const theme = useTheme();
   const matches = useMediaQuery(theme.breakpoints.up('md'));

   const {slug} = useParams();

   const [post, setPost] = useState(null)
   const [editMode, setEditMode] = useState(!slug)
   const [title, setTitle] = useState('')
   const [body, setBody] = useState('')

   const [open, setOpen] = React.useState(false);

   const translateMap = {
      'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'jo', 'ж': 'zh', 'з': 'z', 'и': 'i',
      'й': 'j', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't',
      'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 'ъ': '', 'ы': 'y',
      'ь': '', 'э': 'e', 'ю': 'ju', 'я': 'ja', 'і': 'i', 'є': 'e', 'ї': 'yi'
   }

   const slugify = str => {
      return str.toLowerCase().split('').map(x => translateMap[[x]] || x).join('')
        .normalize('NFKD').trim().replace(/[^a-z0-9 ]/g, '')
        .replace(/\s+/g, '-');
   }

   const handleClickOpen = () => {
      setOpen(true);
   };

   const handleClose = () => {
      setOpen(false);
   };


   const makeDate = dateString => new Date(dateString).toDateString().split(' ')
     .splice(1).join(' ')

   useEffect(() => {
      if (slug) {
         props.stores.posts.getPost(slug).then(post => {
            setPost(post)
            setTitle(post.title)
            setBody(post.body)
         }).catch((e) => {
            props.stores.notifications.notify(JSON.stringify(e), 4)
         })
      }
   }, [])

   const {currentUser} = props.stores.authStore

   const showEditButton = () => {
      return !slug || !!currentUser && !!post && (currentUser.is_staff ||
        currentUser.username.toLowerCase() === post.author.username.toLowerCase())
   }

   const handleSubmit = (e) => {
      if (!slug) {
         props.stores.posts.create(slugify(title), title, body).then((data) => {
            props.stores.notifications.notify('success')
            // props.stores.storage.removeItem('draft')
            props.history.push(`/blog/${slugify(title)}`)
            setPost(data)
            setEditMode(false)
         }).catch((e) => {
            // props.stores.notifications.notify(JSON.stringify(e), 4)
            props.stores.notifications.notify("something goes wrong...", 3)
         })
      } else if (editMode) {
         props.stores.posts.updatePost(slug, {slug, title, body}).then(data => {
            setPost(data)
            setTitle(data.title)
            setBody(data.body)
            setEditMode(false)
         }).catch(e => {
            // props.stores.notifications.notify(JSON.stringify(e), 4)
            props.stores.notifications.notify("something goes wrong...", 3)
         })
      } else {
         setEditMode(true)
      }
   }

   const handleDelete = () => {
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

   if (!post && slug) return (
     <Container maxWidth={"md"} className={classes.skeleton}>
        <Typography variant={"h2"}>
           <Skeleton width={'90%'} animation={"wave"}/>
        </Typography>
        <Typography>
           <Skeleton variant={"text"} width={"17%"} animation={"wave"}/>
           <Skeleton variant={"text"} width={"0%"}/>
           <Skeleton variant={"text"} width={"86%"}/>
           <Skeleton variant={"text"} width={"90%"}/>
           <Skeleton variant={"text"} width={"98%"}/>
           <Skeleton variant={"text"} width={"94%"}/>
           <Skeleton variant={"text"} width={"89%"}/>
           <Skeleton variant={"text"} width={"97%"}/>
           <Skeleton variant={"text"} width={"20%"}/>
           <Skeleton variant={"text"} width={"0%"}/>
           <Skeleton variant={"text"} width={"95%"}/>
           <Skeleton variant={"text"} width={"87%"}/>
           <Skeleton variant={"text"} width={"93%"}/>
           <Skeleton variant={"text"} width={"35%"}/>
           <Skeleton variant={"text"} width={"0%"}/>
           <Skeleton variant={"text"} width={"97%"}/>
           <Skeleton variant={"text"} width={"93%"}/>
           <Skeleton variant={"text"} width={"50%"}/>
           <Skeleton variant={"text"} width={"0%"}/>
           <Skeleton variant={"text"} width={"94%"}/>
           <Skeleton variant={"text"} width={"90%"}/>
           <Skeleton variant={"text"} width={"20%"}/>
           <Skeleton variant={"text"} width={"0%"}/>
           <Skeleton variant={"text"} width={"95%"}/>
           <Skeleton variant={"text"} width={"92%"}/>
           <Skeleton variant={"text"} width={"98%"}/>
           <Skeleton variant={"text"} width={"89%"}/>
           <Skeleton variant={"text"} width={"60%"}/>
        </Typography>
     </Container>
   )

   return (
     <Grid container direction={"row"}>
        <Helmet
          title={slug ? title : "New article"}
        />
        <Grid item lg={2} md={1} sm={1}/>
        <Grid item lg={8} md={9} sm={12} xs={12}>
           <Container className={classes.root} maxWidth={"md"}>
              <div>
                 {slug && !editMode &&
                 <Typography variant={"h3"} className={classes.title}>{title}</Typography>
                 ||
                 <TextField
                   className={classes.title}
                   value={title}
                   multiline
                   onChange={e => setTitle(e.target.value)}
                   variant="standard"
                   margin="normal"
                   name="title"
                   label={""}
                   placeholder={"Title"}
                   type="text"
                   id="title"
                   autoComplete={"off"}
                   fullWidth
                   InputProps={{disableUnderline: true, style: {fontSize: "3rem", padding: 0}}}
                 />
                 }
                 {
                    slug && <><Typography variant="subtitle2" color="textSecondary">
                       {makeDate(post.publish)} by <Link
                      href={`/users/${post.author.username}`}>{post.author.username}</Link>
                    </Typography><br/></>

                 }
                 <ReactQuill
                   className={classes.editor}
                   value={body}
                   theme={'bubble'}
                   placeholder={"Share your experience here..."}
                   onChange={setBody}
                   readOnly={!editMode}
                   modules={modules}
                   formats={formats}
                 />
              </div>
           </Container>
        </Grid>
        <Grid container direction={matches ? 'column' : "row"} item xs={12} sm={12} md={2} lg={2}>
           <Grid item>
              {showEditButton() &&
              <Button
                size={"small"}
                onClick={handleSubmit}
                className={`${classes.submit} ${matches ? classes.submitFixed : classes.submitRelative}`}
              >{editMode ? "Publish" : "Edit"}</Button>}
           </Grid>
           <Grid item>
              {showEditButton() && editMode && slug &&
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