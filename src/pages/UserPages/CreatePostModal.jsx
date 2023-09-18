import React, { useContext, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';
import { AddFormContext } from '../../context/AddContext';
import { AuthContext } from '../../context/AuthContext'
import { addDoc, collection, serverTimestamp, setDoc } from 'firebase/firestore'
import { db, storage } from '../../firebase/firebaseConfig'
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
const Modal = ({ open, onClose }) => {

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    coverImage: null,
  });

  const {currentUser, userData} = useContext(AuthContext)

  const nav = useNavigate();

  const postRef = collection(db, "postData")

  const notifRef = collection(db, "notification")

  const [downloadURL, setDownloadURL] = useState("")

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCoverImageChange = (e) => {
    // Handle cover image selection
    const file = e.target.files[0];
    setFormData({
      ...formData,
      coverImage: file,
    });
  };


const addPost = async () => {
  try {
    const metadata = {
      contentType: 'image/jpeg'
    };

    // Upload file and metadata to the object 'images/mountains.jpg'
    const storageRef = ref(storage, 'coverImage/' + formData.title);
    const uploadTask = uploadBytesResumable(storageRef, formData.coverImage, metadata);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on('state_changed',
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      }, 
      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break;
          case 'storage/canceled':
            // User canceled the upload
            break;

          // ...

          case 'storage/unknown':
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      }, 
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then(async(downloadURL) => {
              // Create a new post document in Firestore.
            const postData = {
              author: userData.displayName,
              description: formData.description,
              content: formData.content,
              title: formData.title,
              photoURL: currentUser.photoURL,
              uid: currentUser.uid,
              image: downloadURL,
              createdAt: serverTimestamp(),
            };
          
            const postDocRef = await addDoc(postRef, postData);
                    // Create a notification document in Firestore.
            const notificationData = {
              author: userData.displayName,
              title: formData.title,
              description: 'has just posted something new. Check it out now!',
              photoURL: currentUser.photoURL,
              isUnRead: true,
              uid: currentUser.uid,
              postDataID: postDocRef.id,
              createdAt: serverTimestamp(),
            };
            await addDoc(notifRef, notificationData);
        });
      }
    );
        // Show a success notification.
        Swal.fire(
          'Post Created!',
          'Post Created Successfully.',
          'success'
        );
        onClose();
        nav('/client/posts');

  } catch(err) {
    Swal.fire(
      'Error',
      'An error occurred while creating the post.',
      'error'
    );
    console.error(err);
  }
}

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create a New Post</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="title"
          label="Title"
          type="text"
          fullWidth
          value={formData.title}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          name="description"
          label="Description"
          type="text"
          fullWidth
          multiline
          rows={4}
          value={formData.description}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          name="content"
          label="Content"
          type="text"
          fullWidth
          multiline
          rows={8}
          value={formData.content}
          onChange={handleInputChange}
        />
          <input
          margin="dense"
          type="file"
          accept="image/*"
          onChange={handleCoverImageChange}
          style={{ display: 'none' }}
          id="cover-image-input"
        />
        <label htmlFor="cover-image-input">
          <Button variant="contained" component="span">
            Upload Cover Image
          </Button>
        </label>
        {formData.coverImage && (
          <div>
            <p>Selected Cover Image: {formData.coverImage.name}</p>
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={addPost}  variant="contained">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Modal;
