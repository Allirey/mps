import React, {useEffect, useState, useRef} from 'react';
import withStore from '../../hocs/withStore'
import {
   Container,
   Grid,
   makeStyles,
   TextField,
   Button,
   Chip,
   Typography,
   MenuItem,
   Select,
   FormControl
} from "@material-ui/core";
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
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(5),

   }
}));

const CreateOpening = (props) => {
   const classes = useStyles();
   const [drag, setDrag] = useState(false)

   let imageRef = useRef()
   let pgnRef = useRef()

   const [title, setTitle] = useState('');
   const [description, setDescription] = useState('');
   const [color, setColor] = useState('w');
   const [selectedTags, setSelectedTags] = useState([])


   const [pgnData, setPgnData] = useState('')
   const [imageData, setImageData] = useState('')

   const tags = props.stores.openings.tags

   useEffect(() => {
      props.stores.openings.getTags()

      let imageDiv = imageRef.current
      let pgnDiv = pgnRef.current
      imageDiv.addEventListener('dragenter', handleDragIn)
      imageDiv.addEventListener('dragleave', handleDragOut)
      imageDiv.addEventListener('dragover', handleDrag)
      imageDiv.addEventListener('drop', handleImageDrop)

      pgnDiv.addEventListener('dragenter', handleDragIn)
      pgnDiv.addEventListener('dragleave', handleDragOut)
      pgnDiv.addEventListener('dragover', handleDrag)
      pgnDiv.addEventListener('drop', handlePgnDrop)

      return () => {
         imageDiv.removeEventListener('dragenter', handleDragIn)
         imageDiv.removeEventListener('dragleave', handleDragOut)
         imageDiv.removeEventListener('dragover', handleDrag)
         imageDiv.removeEventListener('drop', handleImageDrop)

         pgnDiv.addEventListener('dragenter', handleDragIn)
         pgnDiv.addEventListener('dragleave', handleDragOut)
         pgnDiv.addEventListener('dragover', handleDrag)
         pgnDiv.addEventListener('drop', handlePgnDrop)
      }
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
      reader.onloadend = () => setImageData(reader.result.replace('data:image/jpeg;base64,', ''))
      reader.readAsDataURL(file);
   }

   const onPgnChoose = e => {
      let file = e.target.files[0];
      let reader = new FileReader();
      reader.onloadend = () => setPgnData(reader.result)
      reader.readAsText(file);
   }

   const handleDrag = e => {
      e.preventDefault()
      e.stopPropagation()
   }
   const handleDragIn = e => {
      e.preventDefault()
      e.stopPropagation()
      setDrag(true)
   }
   const handleDragOut = e => {
      e.preventDefault()
      e.stopPropagation()
      setDrag(false)
   }
   const handleImageDrop = e => {
      e.preventDefault()
      e.stopPropagation()

      let file = e.dataTransfer.files[0];
      if (!['image/jpeg', "image/png"].includes(file.type)) return

      let reader = new FileReader();
      reader.onloadend = () => setImageData(reader.result)
      reader.readAsDataURL(file);

      setDrag(false)
   }

   const handlePgnDrop = e => {
      e.preventDefault()
      e.stopPropagation()

      let file = e.dataTransfer.files[0];
      if (!['application/vnd.chess-pgn',].includes(file.type)) return

      let reader = new FileReader();
      reader.onloadend = () => setPgnData(reader.result)
      reader.readAsText(file);

      setDrag(false)
   }

   console.log(pgnData);

   return (
     <Grid component={Container} maxWidth={'xs'} className={classes.root}>
        <TextField
          value={title}
          onChange={e => setTitle(e.target.value)}
          size={"small"}
          fullWidth
          variant="outlined"
          margin={"normal"}
          placeholder={'Title'}
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
          placeholder={'Description'}
          autoComplete="off"
        />

        <FormControl variant={"outlined"}>
           <Select
             onChange={e => setColor(e.target.value)}
             value={color}
             style={{marginBottom: 8, width: 140}}
             inputProps={{'aria-label': 'Without label'}}
           >
              <MenuItem disableRipple value={'w'}>White</MenuItem>
              <MenuItem disableRipple value={'b'}>Black</MenuItem>
              <MenuItem disableRipple value={'wb'}>Both colors</MenuItem>
           </Select>
        </FormControl>

        <Grid ref={imageRef} item style={{height: 100, border: "2px dashed #000", marginBottom: 8}}>
           {imageData &&
           <img style={{height: 94, width: "auto"}} src={imageData} alt={''}/>}

           <Typography>Drag & Drop to upload image</Typography>
           <Typography>or</Typography>

           <input
             accept=".jpg"
             name="file"
             className={classes.input}
             id="image"
             type="file"
             onChange={onImageChoose}
           />
           <label htmlFor="image">
              <Button variant="outlined" component="span">
                 Browse Image
              </Button>
           </label>

        </Grid>

        <Grid ref={pgnRef} item style={{height: 100, border: "2px dashed #000", marginBottom: 8}}>
           <Typography>Drag & Drop to upload pgn</Typography>
           <Typography>or</Typography>

           <input
             accept=".pgn"
             name="file"
             className={classes.input}
             id="pgn"
             type="file"
             onChange={onPgnChoose}
           />
           <label htmlFor="pgn">
              <Button variant="outlined" component="span">
                 Browse Pgn
              </Button>
           </label>
        </Grid>

        <Grid item>
           {tags.map((el, i) => <Chip
             key={el + '' + i}
             disableRipple
             className={`${classes.filter}`}
             variant={"outlined"}
             label={el}
             avatar={selectedTags.includes(el) ? <DoneIcon/> : null}
             onClick={() => setSelectedTags(selectedTags.includes(el) ? selectedTags.filter(elem => elem !== el) : [el, ...selectedTags])}
           />)}
        </Grid>

        <Button className={classes.submit} fullWidth onClick={handleSubmission} disableRipple
                variant={"outlined"}>Submit</Button>

     </Grid>
   )
}

export default withStore(CreateOpening)