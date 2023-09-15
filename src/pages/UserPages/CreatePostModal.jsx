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
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../../firebase/firebaseConfig'
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
const Modal = ({ open, onClose }) => {

  const {formData, setFormData} = useContext(AddFormContext)

  const {currentUser, userData} = useContext(AuthContext)

  const nav = useNavigate();

  const postRef = collection(db, "postData")

  const notifRef = collection(db, "notification")

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
    ...prevData,
    [name]: value,
    }));
  };

  const createPost = async () => {
    try {
      await addDoc(postRef, {
        author: userData.displayName,
        description: formData.description,
        content: formData.content,
        title: formData.title,
        photoURL: currentUser.photoURL,
        uid: currentUser.uid,
        createdAt: serverTimestamp(),
      })
      await addDoc(notifRef, {
        author: userData.displayName,
        title: formData.title,
        description: 'has just posted something new. Check it out now!',
        photoURL: currentUser.photoURL,
        isUnRead: true,
        uid: currentUser.uid,
        createdAt: serverTimestamp(),
      })
      Swal.fire(
        'Post Created!',
        'Post Created Successfully.',
        'success'
      )
      onClose();
      nav('/client/posts')
    } catch(err) {
      console.error(err)
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
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={createPost}  variant="contained">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Modal;
