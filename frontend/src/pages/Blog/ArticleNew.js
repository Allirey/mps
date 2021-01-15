import React, {useCallback, useEffect, useState} from 'react';
import {
   Button, CssBaseline, TextField, Grid, makeStyles, Container, useMediaQuery, useTheme
} from '@material-ui/core';
import withStore from '../../hocs/withStore';
import ReactQuill, {Quill} from 'react-quill';
import Spinner from '../../components/spinner';

const LinkQuill = Quill.import('formats/link');

class MyLink extends LinkQuill {
   static create(value) {
      let node = super.create(value);
      value = this.sanitize(value);
      if (!value.startsWith("http")) {
         value = "http://" + value;
      }
      node.setAttribute('href', value);
      return node;
   }
}

Quill.register(MyLink);

const useStyles = makeStyles((theme) => ({
   paper: {
      marginTop: theme.spacing(2),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
   },
   form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
      "& a": {
         textDecoration: "none",
         color: "blue"
      },
      "& $img": {
         maxWidth: "100%",
         height: "auto",
      },
      "& input": {
         marginLeft: theme.spacing(2)
      },
      "& label": {
         marginLeft: theme.spacing(2),
         fontStyle: "italic",
      },
      '& .ql-container': {fontSize: "18px"},
      '& #title': {
         fontSize: "32px",
         marginLeft: 0,
         '&::-webkit-input-placeholder': {
            fontStyle: "italic",
         }
      },
      '& .ql-bubble .ql-editor pre.ql-syntax': {
         backgroundColor: "#F5F8FC",
         color: 'black',
         fontWeight: 400,
         fontFamily: "Menlo,'Courier New',Courier,monospace",
      },
      marginBottom: theme.spacing(8),
   },
   submit: {
      borderRadius: '17px',
      borderColor: "black",
      border: "2px solid #333",
      color: "black",
      fontWeight: "bold",
      marginTop: theme.spacing(7),
   },
   submitRelative: {
      position: "relative",
      marginLeft: theme.spacing(5)
   },
   submitFixed: {
      position: "fixed",
   },
}));

function ArticleNew(props) {
   const classes = useStyles();
   const theme = useTheme();
   const matches = useMediaQuery(theme.breakpoints.up('md'));

   const draft = JSON.parse(props.stores.storage.getItem('draft'))

   const [post, setPost] = useState(null)
   const [title, setTitle] = useState(draft ? draft.title : '')
   const [body, setBody] = useState(draft ? draft.body : '')

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

   const onTitleChange = e => {
      setTitle(e.target.value)
      props.stores.storage.setItem('draft', JSON.stringify({title: e.target.value, body}))
   }

   const onBodyChange = value => {
      setBody(value)
      props.stores.storage.setItem('draft', JSON.stringify({title, body: value}))
   }

   const makeDate = dateString => new Date(dateString).toDateString().split(' ')
     .splice(1).join(' ')

   const handleSubmit = (e) => {
      e.preventDefault()

      props.stores.posts.create(slugify(title), title, body).then(() => {
         props.stores.notifications.notify('success')
         props.stores.storage.removeItem('draft')
         props.history.push(`/blog/${slugify(title)}`)
      }).catch((e) => {
         // props.stores.notifications.notify(JSON.stringify(e), 4)
         props.stores.notifications.notify("something goes wrong...", 3)
      })
      // todo returns "OK" in error if empty form submitted
   }

   return (
     <Grid container direction={"row"} justify={"center"}>
        <Grid item lg={2} md={1} sm={1} xs={0}/>
        <Grid item lg={8} md={9} sm={12} xs={12}>
           <Container component="main" maxWidth="md">
              <CssBaseline/>
              <div className={classes.paper}>
                 <form
                   className={classes.form}
                   noValidate
                   onSubmit={handleSubmit}>
                    <Grid container>
                       <Grid item xs={12} sm={12}>
                          <TextField
                            style={{paddingLeft: "15px"}}
                            value={title}
                            onChange={onTitleChange}
                            variant="standard"
                            margin="normal"
                            name="title"
                            label={""}
                            placeholder={"Title"}
                            type="text"
                            id="title"
                            autoComplete={"off"}
                            fullWidth
                            InputProps={{disableUnderline: true}}
                          />
                       </Grid>
                       <br/>
                       <Grid item xs={12} sm={12}>
                          <ReactQuill
                            value={body}
                            theme={'bubble'}
                            placeholder={"Share your experience here..."}
                            onChange={onBodyChange}
                          >
                             <article>
                                {/*<h1/>*/}
                             </article>

                          </ReactQuill>
                       </Grid>
                    </Grid>
                 </form>
              </div>
           </Container>
        </Grid>
        <Grid item xs={12} sm={12} md={2} lg={2}>
           <Button
             size={"small"}
             className={`${classes.submit} ${matches ? classes.submitFixed : classes.submitRelative}`}
             variant="outlined"
             onClick={handleSubmit}>Publish</Button>
        </Grid>
     </Grid>
   );
}

export default withStore(ArticleNew);