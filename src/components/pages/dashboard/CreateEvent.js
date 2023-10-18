import React, { useState, useEffect } from 'react';
import './CreateEvent.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const CreateEvent = () => {

  const [startingTime, setStartingTime] = useState('');
  const [startingMinutes, setStartingMinutes] = useState('');
  const [endingTime, setEndingTime] = useState('');
  const [endingMinutes, setEndingMinutes] = useState('');
  const [showShowEventCreatedSuccessfullyMessage, setShowEventCreatedSuccessfullyMessage] = useState(false);
  const [showShowEventCreatedUnsuccessfullyMessage, setShowEventCreatedUnsuccessfullyMessage] = useState(false);
  const [imageFile, setImageFile] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showImageModal, setShowImageModal] = useState(false);
  const [eventType, setEventType] = useState('Concert');
  const [selectedArtists, setSelectedArtists] = useState([]);
  const [availableArtists, setAvailableArtists] = useState([]);
  const [showArtistDropdown, setShowArtistDropdown] = useState(false);


  useEffect(() => {
    fetch('http://localhost:8080/artists')
      .then((response) => response.json())
      .then((data) => setAvailableArtists(data));
  }, []);

  const toggleArtistDropdown = () => {
    setShowArtistDropdown(!showArtistDropdown);
  };
  

  const handleArtistSelection = (artist) => {
    // Check if the artist is already selected
    if (!selectedArtists.find((selectedArtist) => selectedArtist.id === artist.id)) {
      setSelectedArtists([...selectedArtists, artist]);
    }
  };

  // Function to remove a selected artist
  const removeSelectedArtist = (artist) => {
    const updatedSelectedArtists = selectedArtists.filter(
      (selectedArtist) => selectedArtist.id !== artist.id
    );
    setSelectedArtists(updatedSelectedArtists);
  };

  const toggleImageModal = () => {
    setShowImageModal(!showImageModal);
  };

  const handleClearImage = () => {
    setImageFile(null);
    // Clear the input field by selecting it and setting its value to an empty string
    const imageInput = document.querySelector('input[name="image"]');
    if (imageInput) {
      imageInput.value = '';
    }
  };

  const resetForm = () => {
    setShowArtistDropdown(false);
    setSelectedArtists([]);
    setStartingTime('');
    setEndingTime('');
    setEventData({
      name: '',
      description: '',
      location: '',
      startDate: '',
      endDate: '',
      ticketPrice: '',
      capacity: '',
      isActive: 'true',
      currency: 'EUR'
    });
    setImageFile(null);
    setStartingMinutes('');
    setEndingMinutes('');
    const imageInput = document.querySelector('input[name="image"]');
    if (imageInput) {
      imageInput.value = '';
    }
  };

  const handleStartingMinutesChange = (e) => {
    setStartingMinutes(e.target.value);
  };

  const handleEndingMinutesChange = (e) => {
    setEndingMinutes(e.target.value);
  };

  const handleStartingTimeChange = (e) => {
    setStartingTime(e.target.value);
  };

  const handleEndingTimeChange = (e) => {
    setEndingTime(e.target.value);
  };

  const [eventData, setEventData] = useState({
    name: '',
    description: '',
    location: '',
    eventType: '',
    startDate: '',
    endDate: '',
    ticketPrice: '',
    capacity: '',
    isActive: 'true',
    artists: [],
    currency: 'EUR'
  });

  const handleImageChange = (e) => {
    const image = e.target.files[0];
    setImageFile(image); // Store the selected image separately
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validate and update the state based on the input field
    if (name === 'ticketPrice') {
      // Ensure that the value is a valid floating-point number
      
        const floatValue = parseFloat(value.replace(',', '.')); // Handle decimal separator

        if (!isNaN(floatValue)) {
          // Prevent negative values and set a maximum of two decimal places
          const nonNegativeValue = Math.max(0, floatValue);
          const roundedValue = Number(nonNegativeValue.toFixed(2));
  
          setEventData({
            ...eventData,
            [name]: roundedValue.toString(), // Handle double values with 2 decimal places
          });
        }
      
    } else if (name === 'capacity') {
      // Ensure that the value is a valid integer
      const intValue = parseInt(value);

      if (!isNaN(intValue)) {
        // Prevent negative values
        const nonNegativeValue = Math.max(0, intValue);

        setEventData({
          ...eventData,
          [name]: nonNegativeValue, // Handle integer values
        });
      } else {
        // If the input is not a valid integer, set the capacity to 0
        setEventData({
          ...eventData,
          [name]: 0,
        });
      }
    } else {
      // Handle other input fields
      setEventData({
        ...eventData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Format startDate and endDate
    const formattedStartDate = `${startingTime}:${startingMinutes} ${eventData.startDate}`;
    const formattedEndDate = `${endingTime}:${endingMinutes} ${eventData.endDate}`;
    eventData.startDate = formattedStartDate;
    eventData.endDate = formattedEndDate;
    eventData.eventType = eventType.toUpperCase();

    eventData.artists = selectedArtists;

    if (eventType === 'Festival') {
      eventData.ticketPrice = 0;
      eventData.capacity = 0;
    }

    console.log('->>>>' + eventData.isActive);

    // Assuming 'jwtToken' is stored locally
    const jwtToken = localStorage.getItem('jwtToken');

    // Prepare the request data
    const formData = new FormData();
    formData.append('eventDto', new Blob([JSON.stringify(eventData)], { type: 'application/json' }));
    formData.append('eventPicture', imageFile);

    try {
      const response = await fetch('http://localhost:8080/events/add', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
        body: formData,
      });

      console.log(eventData);

      if (response.ok) {
        setShowEventCreatedSuccessfullyMessage(true);

        setTimeout(() => {
          setShowEventCreatedSuccessfullyMessage(false);
        }, 4000);
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.message;

        setErrorMessage(errorMessage);

        setShowEventCreatedUnsuccessfullyMessage(true);

        setTimeout(() => {
          setShowEventCreatedUnsuccessfullyMessage(false);
        }, 4000);
      }
    } catch (error) {
      console.error('Error:', error);
    }

    resetForm();
  };

  return (
    <div className="dashboard-create-event-container">

      {showShowEventCreatedSuccessfullyMessage && (
        <div className="register-success-message">Event created successfully!</div>
      )}
      {showShowEventCreatedUnsuccessfullyMessage && (
        <div className="register-fail-message">{errorMessage}</div>
      )}

      <div className="dashboard-create-event-wrapper">
        <div className="dashboard-create-event-input-container">
          <input
            type="text"
            name="name"
            placeholder="Event Name"
            value={eventData.name}
            onChange={handleChange}
            className="dashboard-create-event-input"
          />
          <textarea
            name="description"
            placeholder="Event Description"
            value={eventData.description}
            onChange={handleChange}
            rows="4"
            className="dashboard-create-event-textarea"
          />
          {/* <input
            type="text"
            name="location"
            placeholder="Location"
            value={eventData.location}
            onChange={handleChange}
            className="dashboard-create-event-input"
          />        */}
          <div className="dashboard-create-event-input-row">
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={eventData.location}
              onChange={handleChange}
              className="dashboard-create-event-input dashboard-location-input"
            />
            <select
              name="eventType"
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              className="dashboard-create-event-input"
            >
              <option value="Festival">Festival</option>
              <option value="Concert">Concert</option>
            </select>
            </div>
          <div className="dashboard-create-event-inline-inputs">
            <input
              type="number"
              name="ticketPrice"
              placeholder="Ticket Price"
              value={eventData.ticketPrice}
              onChange={handleChange}
              className="dashboard-create-event-input"
              disabled={eventType === 'Festival'}
            />
            <input
              type="number"
              name="capacity"
              placeholder="Capacity"
              value={eventData.capacity}
              onChange={handleChange}
              className="dashboard-create-event-input"
              disabled={eventType === 'Festival'}
            />
            {/* <input
              type="text"
              name="isActive"
              placeholder="Status"
              value={eventData.isActive}
              onChange={handleChange}
              className="dashboard-create-event-input"
            /> */}
            <select
              name="isActive"
              value={eventData.isActive}
              onChange={handleChange}
              className="dashboard-create-event-input"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>

          </div>

          <div className="artist-dropdown-container">
            <h1 className="artist-dropdown-heading">Choose Artists:</h1>
            <button onClick={toggleArtistDropdown} className="artist-dropdown-button">Show Artists</button>
            {showArtistDropdown && (
              <select
                name="artists"
                className="artist-dropdown artist-dropdown-select"
                multiple={true}
                onChange={(e) => {
                  const artistId = parseInt(e.target.value); // Convert the artist ID to a number
                  const selectedArtist = availableArtists.find((artist) => artist.id === artistId);
                  handleArtistSelection(selectedArtist);
                }}
              >
                {/* Render the artists dynamically based on your data */}
                
                  {availableArtists.map((artist) => (
                    <option key={artist.id} value={artist.id}>
                      {artist.firstName} {artist.lastName}
                    </option>
                  ))}
                
              </select>
            )}
          </div>

        {/* Display selected artists */}
        <div className="selected-artists">
          {selectedArtists.map((artist) => (
            <div key={artist.id} className="selected-artist">
              {artist.firstName} {artist.lastName}
              <button
                onClick={() => removeSelectedArtist(artist)}
                className="remove-artist-button"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

          <hr className="dashboard-create-event-hr" />
          <div className="dashboard-create-event-date-inputs">
            <div className="dashboard-create-event-date-label">Starts at - </div>
            <input
              type="number"
              min="0"
              max="23"
              step="1"
              value={startingTime}
              onChange={handleStartingTimeChange}
              className="dashboard-create-event-date-input-short-input"
              placeholder="HH"
            />
            <span className="dashboard-create-event-time-separator">:</span>
            <input
              type="number"
              min="0"
              max="59"
              step="1"
              value={startingMinutes}
              onChange={handleStartingMinutesChange}
              className="dashboard-create-event-date-input-short-input"
              placeholder="MM"
            />
            <div className="dashboard-create-event-date-label"> - </div>
            <input
              type="date"
              name="startDate"
              placeholder="Start Date"
              value={eventData.startDate}
              onChange={handleChange}
              className="dashboard-create-event-date-input-date"
            />
          </div>
          <div className="dashboard-create-event-date-inputs">
            <div className="dashboard-create-event-date-label">Ends at - </div>
            <input
              type="number"
              min="0"
              max="23"
              step="1"
              value={endingTime}
              onChange={handleEndingTimeChange}
              className="dashboard-create-event-date-input-short-input"
              placeholder="HH"
            />
            <span className="dashboard-create-event-time-separator">:</span>
            <input
              type="number"
              min="0"
              max="59"
              step="1"
              value={endingMinutes}
              onChange={handleEndingMinutesChange}
              className="dashboard-create-event-date-input-short-input"
              placeholder="MM"
            />
            <div className="dashboard-create-event-date-label"> - </div>
            <input
              type="date"
              name="endDate"
              placeholder="End Date"
              value={eventData.endDate}
              onChange={handleChange}
              className="dashboard-create-event-date-input-date"
            />
          </div>
          <div className="dashboard-create-event-date-inputs">
            <div className="dashboard-create-event-date-label">Event Image - </div>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="dashboard-create-event-input"
            />
            {imageFile && (
              <FontAwesomeIcon icon={faTimes} onClick={handleClearImage} className="clear-image-icon" />
            )}
          </div>

          {imageFile && (
            <button
              className="dashboard-create-event-button"
              onClick={toggleImageModal}
            >
              Preview Image
            </button>
          )}
          {showImageModal && (
            <div className="image-modal-overlay">
              <div className="image-modal">
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="Preview"
                  className="image-modal-content"
                />
                <button className="close-image-modal" onClick={toggleImageModal}>
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            </div>
          )}
          <hr className="dashboard-create-event-hr" /> {/* Horizontal line */}
          <button
            className="dashboard-create-event-button"
            onClick={handleSubmit}
          >
            Create Event
          </button>
        </div>  
      </div>
 </div>
  );
};

export default CreateEvent;
