import {useEffect, useState, useRef} from 'react';
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
   FormControl, Paper
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
   },
   browseBtn: {
      textTransform: "none",
      border: "none",
      "&:hover":{
         backgroundColor:"transparent",
      }
   },
   uploadContainer: {
      height: 100,
      marginBottom: 8,
      outline: "2px dashed #92b0b3",
      outlineOffset: "-8px",
      transition: ".15s",
   },
   dragover: {
      backgroundColor: "#fff",
      outlineOffset: "-16px",
   }
}));

const CreateOpening = (props) => {
   const classes = useStyles();

   let imageRef = useRef()
   let pgnRef = useRef()

   const [title, setTitle] = useState('');
   const [description, setDescription] = useState('');
   const [color, setColor] = useState('w');
   const [selectedTags, setSelectedTags] = useState([])

   const [pgnFileName, setPgnFileName] = useState('')
   const [pgnData, setPgnData] = useState('')

   const [imageFileName, setImageFileName] = useState('')
   const [imageData, setImageData] = useState('')

   const tags = props.stores.openings.tags

   useEffect(() => {
      props.stores.openings.getTags()

      let imageDiv = imageRef.current
      let pgnDiv = pgnRef.current
      imageDiv.addEventListener('dragenter', handleDragIn)
      imageDiv.addEventListener('dragleave', handleDragOut)
      imageDiv.addEventListener('dragover', handleDragImage)
      imageDiv.addEventListener('drop', handleImageDrop)

      pgnDiv.addEventListener('dragenter', handleDragIn)
      pgnDiv.addEventListener('dragleave', handleDragOut)
      pgnDiv.addEventListener('dragover', handleDragPgn)
      pgnDiv.addEventListener('drop', handlePgnDrop)

      return () => {
         imageDiv.removeEventListener('dragenter', handleDragIn)
         imageDiv.removeEventListener('dragleave', handleDragOut)
         imageDiv.removeEventListener('dragover', handleDragImage)
         imageDiv.removeEventListener('drop', handleImageDrop)

         pgnDiv.addEventListener('dragenter', handleDragIn)
         pgnDiv.addEventListener('dragleave', handleDragOut)
         pgnDiv.addEventListener('dragover', handleDragPgn)
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
         setPgnFileName('')
         setImageFileName('')
      }).catch(() => {
         props.stores.notifications.notify('Upload failed', 3)
      })
   };

   const onImageChoose = e => {
      let file = e.target.files[0];
      let reader = new FileReader();
      reader.onloadend = () => setImageData(reader.result)
      reader.readAsDataURL(file);
      setImageFileName(file.name)
   }

   const onPgnChoose = e => {
      let file = e.target.files[0];
      let reader = new FileReader();
      reader.onloadend = () => setPgnData(reader.result)
      reader.readAsText(file);
      setPgnFileName(file.name)
   }

   const handleDragImage = e => {
      e.preventDefault()
      e.stopPropagation()
      imageRef.current.classList.add(classes.dragover)
   }

   const handleDragPgn = e => {
      e.preventDefault()
      e.stopPropagation()
      pgnRef.current.classList.add(classes.dragover)
   }

   const handleDragIn = e => {
      e.preventDefault()
      e.stopPropagation()
   }
   const handleDragOut = e => {
      e.preventDefault()
      e.stopPropagation()
      imageRef.current.classList.remove(classes.dragover)
      pgnRef.current.classList.remove(classes.dragover)
   }
   const handleImageDrop = e => {
      e.preventDefault()
      e.stopPropagation()
      imageRef.current.classList.remove(classes.dragover)

      let file = e.dataTransfer.files[0];
      if (!['image/jpeg', "image/png"].includes(file.type)) return

      let reader = new FileReader();
      reader.onloadend = () => setImageData(reader.result)
      reader.readAsDataURL(file);
      setImageFileName(file.name)
   }

   const handlePgnDrop = e => {
      e.preventDefault()
      e.stopPropagation()
      pgnRef.current.classList.remove(classes.dragover)

      let file = e.dataTransfer.files[0];
      if (!['application/vnd.chess-pgn',].includes(file.type)) return

      let reader = new FileReader();
      reader.onloadend = () => setPgnData(reader.result)
      reader.readAsText(file);
      setPgnFileName(file.name)
   }

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

        <Grid component={Paper} ref={imageRef} className={classes.uploadContainer} item container justify={"center"}
              alignItems={"center"}>

           <input
             accept=".jpg,.png"
             name="file"
             className={classes.input}
             id="image"
             type="file"
             onChange={onImageChoose}
           />
           <label htmlFor="image">
              <Button disableRipple className={classes.browseBtn} variant="outlined" component="span">
                 <Typography color={imageFileName ? 'textPrimary' : "textSecondary"}>{imageFileName || <><strong>Choose
                    image</strong> or drag it here.</>}</Typography>
              </Button>
           </label>

        </Grid>

        <Grid component={Paper} ref={pgnRef} className={classes.uploadContainer} item container justify={"center"} alignItems={"center"}>
           <input
             accept=".pgn"
             name="file"
             className={classes.input}
             id="pgn"
             type="file"
             onChange={onPgnChoose}
           />
           <label htmlFor="pgn">
              <Button disableRipple className={classes.browseBtn} variant="outlined" component="span">
                 <Typography color={pgnFileName ? 'textPrimary' : "textSecondary"}>{pgnFileName || <><strong>Choose
                    pgn</strong> or drag it here.</>}</Typography></Button>
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