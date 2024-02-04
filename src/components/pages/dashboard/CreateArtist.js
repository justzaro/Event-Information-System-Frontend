import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
import './CreateArtist.css';

function CreateArtist() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [isImagePreviewVisible, setIsImagePreviewVisible] = useState(false);
  const [artistAddedMessage, setArtistAddedMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setDescription('');
    setImage(null);
    const imageInput = document.getElementById('imageInput');
  if (imageInput) {
    imageInput.value = '';
  }

  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    if (selectedImage) {
        setImage(selectedImage);
    }
  };

  const openImagePreview = () => {
    setIsImagePreviewVisible(true);
  };

  const closeImagePreview = () => {
    setIsImagePreviewVisible(false);
  };

  const removeImage = () => {
    setImage(null);
    document.getElementById('imageInput').value = '';
  };

  const addArtist = () => {
    const artistData = {
      firstName: firstName,
      lastName: lastName,
      description: description
    };
  
    if (!image) {
        setErrorMessage("Please attach an image");
        setTimeout(() => {
          setErrorMessage('');
        }, 4000);
        return;
      }

    console.log(artistData);
    console.log(image);

    const formData = new FormData();
    formData.append('artistDto', new Blob([JSON.stringify(artistData)], { type: 'application/json' }));
    formData.append('profilePicture', image);
  
    console.log(formData);
    
    const headers = new Headers({
      'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
    });
  
    fetch('http://localhost:8080/artists', {
      method: 'POST',
      headers: headers,
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          setArtistAddedMessage(true);

          setTimeout(() => {
            setArtistAddedMessage(false);
          }, 4000);
        } else {
          response.json().then((errorData) => {
            setErrorMessage(errorData.message);
          });

          setErrorMessage(true);

          setTimeout(() => {
            setErrorMessage(false);
          }, 4000);
        }
      })
      .then((data) => {
      })
      .catch((error) => {
        console.error(error);
      });
      resetForm();
  };
  
  return (
    <div className="create-artist-container">

      {artistAddedMessage && (
        <div className="register-success-message">Artist added successfully!</div>
      )}
      {errorMessage && (
        <div className="register-fail-message">{errorMessage}</div>
      )}

      <div className="create-artist-inputs">
        <div className="create-artist-names">
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            style={{ width: '50%' }}
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            style={{ width: '50%' }}
          />
        </div>
        <textarea
          className="create-artist-description"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="file"
          id="imageInput"
          className="create-artist-image-input"
          accept="image/*"
          onChange={handleImageChange}
        />
        {image && (
          <div className="create-artist-image-preview-button">
            <button className="create-artist-preview-button" onClick={openImagePreview}>
              Preview Image
            </button>
            <button className="create-artist-remove-button" onClick={removeImage}>
              <FontAwesomeIcon icon={faX} />
            </button>
          </div>
        )}
        <button className="create-artist-add-button" onClick={addArtist}>
          Add Artist
        </button>
      </div>
      {isImagePreviewVisible && image && (
        <div className="create-artist-image-preview">
          <img src={image} alt="Artist Preview" />
          <button className="create-artist-close-button" onClick={closeImagePreview}>
            Close
          </button>
        </div>
      )}
    </div>
  );
}

export default CreateArtist;
