import React, {useEffect, useState} from 'react';
import withStore from '../../hocs/withStore'
import {Container, Grid, makeStyles, TextField, Button, Chip} from "@material-ui/core";
import DoneIcon from "@material-ui/icons/Done";

const useStyles = makeStyles(theme => ({
   root: {},
   input: {
      display: 'none',
   },
   filter: {
      margin: "4px 2px",
   },
   submit: {
      marginTop: theme.spacing(2)

   }
}));

const CreateOpening = (props) => {
   const classes = useStyles();
   const [title, setTitle] = useState('');
   const [description, setDescription] = useState('');
   const [color, setColor] = useState('');
   const [selectedFile, setSelectedFile] = useState();
   const [isFilePicked, setIsFilePicked] = useState(false);
   const [selectedTags, setSelectedTags] = useState([])
   const tags = props.stores.openings.tags

   useEffect(() => {
      props.stores.openings.getTags()
   }, [])

   const changeHandler = (event) => {
      setSelectedFile(event.target.files[0]);
      setIsFilePicked(true);
   };

   const handleSubmission = () => {
      selectedFile && selectedFile.text().then(pgn => {
         props.stores.openings.createOpening(title, description, color, selectedTags, pgn).then(() => {
            props.stores.notifications.notify('Successfully uploaded')
            setTitle('')
            setDescription('')
            setColor('')
            setSelectedTags([])

         }).catch(() => {
            props.stores.notifications.notify('Upload failed', 3)
         })
      })
   };

   return (
     <Grid component={Container} maxWidth={'xs'} className={classes.root}>
        <TextField
          value={title}
          onChange={e => setTitle(e.target.value)}
          size={"small"}
          fullWidth
          variant="outlined"
          margin={"normal"}
          placeholder={'title'}
          autoComplete="off"
        />

        <TextField
          value={description}
          onChange={e => setDescription(e.target.value)}
          size={"small"}
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          margin={"normal"}
          placeholder={'description'}
          autoComplete="off"
        />

        <TextField
          value={color}
          onChange={e => setColor(e.target.value)}
          size={"small"}
          fullWidth
          variant="outlined"
          margin={"normal"}
          placeholder={'color'}
          autoComplete="off"
        />
        <input
          accept=".pgn"
          name="file"
          className={classes.input}
          id="contained-button-file"
          type="file"
          onChange={changeHandler}
        />
        <label htmlFor="contained-button-file">
           <Button variant="contained" color="primary" component="span">
              Upload
           </Button>
        </label>

        <Grid item direction={'row'}>
           {tags.map((el, i) => <Chip
             key={el + '' + i}
             disableRipple
             className={`${classes.filter}`}
             variant={"outlined"}
             label={el}
             avatar={selectedTags.includes(el) && <DoneIcon/>}
             onClick={() => setSelectedTags(selectedTags.includes(el) ? selectedTags.filter(elem => elem !== el) : [el, ...selectedTags])}
           />)}
        </Grid>

        <Button className={classes.submit} fullWidth onClick={handleSubmission} disableRipple
                variant={"outlined"}>Submit</Button>

     </Grid>
   )
}

export default withStore(CreateOpening)