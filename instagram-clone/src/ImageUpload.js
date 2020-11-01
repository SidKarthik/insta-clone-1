import { Button, Input } from '@material-ui/core'
import Modal from '@material-ui/core/Modal';
import React, { useState } from 'react'
import { db , storage } from "./firebase"
import { makeStyles } from '@material-ui/core/styles';
import firebase from "firebase"
import './ImageUpload.css'

function getModalStyle() {
    const top = 50;
    const left = 50;
  
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }

  const useStyles = makeStyles((theme) => ({
    paper: {
      position: 'absolute',
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }));

function ImageUpload({username}) {

    const classes = useStyles();
    const [modalStyle] = React.useState(getModalStyle);
    const [caption, setCaption] = useState('')
    const [image, setImage] = useState(null)
    const [progress, setProgress] = useState(0)
    const [openPost, setOpenPost] = useState(false)

    const handleChange = (e) => {
        if(e.target.files[0])
        {
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);

        uploadTask.on(
            "state_changed",
            //progrss function
            (snapshot) => {
                 const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            //error Function
            (error) => {
                console.log(error);
                alert(error.message);
            },

            () => {
                storage
                .ref("images")
                .child(image.name)
                .getDownloadURL()
                .then(url => {
                    db.collection('posts').add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        caption: caption,
                        imageURL: url,
                        username: username
                    });
                    setOpenPost(false);
                    setProgress(0);
                    setCaption('');
                    setImage(null);
                    

                });
            }
        );
    };

    return (
        <div>
        <Modal
            open= {openPost}
            onClose={() => setOpenPost(false)}
        >
            <div style={modalStyle} className={classes.paper}>
            <center>
            <img 
                className="app_headerImage"
                src="https://instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt="" 
            />

              {/* <Button type="submit" onClick={signIn} variant="contained" color="secondary">Post</Button> */}
            <div className="image__Upload">
                {/* Progress bar */}
            <progress className="image__Upload_progress" value={progress} max = '100' />
            {/* ⏩ Caption Input */}
            <Input type="text" placeholder="Enter a Caption" onChange={event => setCaption(event.target.value)} value={caption}/>
            {/* ⏩ File Picker */}
            <Input type="file" onChange={handleChange}/>
            {/* ⏩ Post Button */}
            <Button onClick={handleUpload} variant="contained" color="secondary">Upload</Button>
            </div>
            

          

          </center>
        </div>

      </Modal>

        <center>
            <Button onClick={() => setOpenPost(true) } variant="outlined" color="secondary" >Upload</Button>
        </center>
        </div>
    )
}

export default ImageUpload
