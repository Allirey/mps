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
   const [selectedTags, setSelectedTags] = useState([])

   const [pgnData, setPgnData] = useState('')
   const [imageData, setImageData] = useState('')

   const tags = props.stores.openings.tags

   useEffect(() => {
      props.stores.openings.getTags()
   }, [])

   const handleSubmission = () => {
      props.stores.openings.createOpening(title, description, color, selectedTags, imageData, pgnData).then(() => {
         props.stores.notifications.notify('Successfully uploaded')
         setTitle('')
         setDescription('')
         setColor('')
         setSelectedTags([])
         setImageData('')
         setPgnData('')
      }).catch(() => {
         props.stores.notifications.notify('Upload failed', 3)
      })
   };

   const onImageChoose = e => {
      let file = e.target.files[0];
      let reader = new FileReader();
      reader.onloadend = () => setImageData(reader.result.substring('data:image/jpeg;base64,'.length))
      reader.readAsDataURL(file);
   }

   const onPgnChoose = e => {
      let file = e.target.files[0];
      let reader = new FileReader();
      reader.onloadend = () => setPgnData(reader.result)
      reader.readAsText(file);
   }

   return (
     <Grid component={Container} maxWidth={'xs'} className={classes.root} spacing={1}>
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

        <Grid item>
           <input
             accept=".pgn"
             name="file"
             className={classes.input}
             id="pgn"
             type="file"
             onChange={onPgnChoose}
           />
           <label htmlFor="pgn">
              <Button variant="contained" color="primary" component="span">
                 Upload pgn
              </Button>
           </label>
        </Grid>

        <Grid item>
           <input
             accept=".jpg"
             name="file"
             className={classes.input}
             id="image"
             type="file"
             onChange={onImageChoose}
           />
           <label htmlFor="image">
              <Button variant="contained" color="primary" component="span">
                 Upload image
              </Button>
           </label>
        </Grid>

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