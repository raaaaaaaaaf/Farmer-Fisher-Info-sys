import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Input,
  InputAdornment,
} from "@mui/material";
import { updateProfile } from "firebase/auth";
import { auth, db, storage } from "../firebase/firebaseConfig";
import Swal from "sweetalert2";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { doc, setDoc, updateDoc } from "firebase/firestore";


function EditProfileModal({ open, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    coverImage: null,
  });

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

  const handleSave = async () => {
    try {
      const metadata = {
        contentType: "image/jpeg",
      };

      // Upload file and metadata to the object 'images/mountains.jpg'
      const storageRef = ref(storage, "profileImage/" + formData.name);
      const uploadTask = uploadBytesResumable(
        storageRef,
        formData.coverImage,
        metadata
      );

      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          switch (error.code) {
            case "storage/unauthorized":
              // User doesn't have permission to access the object
              break;
            case "storage/canceled":
              // User canceled the upload
              break;

            // ...

            case "storage/unknown":
              // Unknown error occurred, inspect error.serverResponse
              break;
          }
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            // Create a new post document in Firestore.
            await updateProfile(auth.currentUser, {
              displayName: formData.name,
              photoURL: downloadURL,
            })
            const userRef = doc(db, "users", auth.currentUser.uid)
            await updateDoc(userRef, {
              displayName: formData.name,
              photoURL: downloadURL,
            })
          });
        }
      );
      // Show a success notification.
      Swal.fire("Profile Edited!", "Post Created Successfully.", "success");
      onClose();
    } catch (err) {
      Swal.fire("Error", "An error occurred while editing profile.", "error");
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogContent>
        <DialogContentText>Update your profile information:</DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          name="name"
          label="Name"
          type="text"
          fullWidth
          value={formData.name}
          onChange={handleInputChange}
        />
        <input
          margin="dense"
          type="file"
          accept="image/*"
          onChange={handleCoverImageChange}
          style={{ display: "none" }}
          id="cover-image-input"
        />
        <label htmlFor="cover-image-input">
          <Button variant="contained" component="span">
            Upload Image
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
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditProfileModal;
