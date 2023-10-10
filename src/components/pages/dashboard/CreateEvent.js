import React, { useState } from 'react';
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
      isActive: '',
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
    startDate: '',
    endDate: '',
    ticketPrice: '',
    capacity: '',
    isActive: '',
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

    console.log(eventData);

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
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={eventData.location}
            onChange={handleChange}
            className="dashboard-create-event-input"
          />
          <div className="dashboard-create-event-inline-inputs">
            <input
              type="number"
              name="ticketPrice"
              placeholder="Ticket Price"
              value={eventData.ticketPrice}
              onChange={handleChange}
              className="dashboard-create-event-input"
            />
            <input
              type="number"
              name="capacity"
              placeholder="Capacity"
              value={eventData.capacity}
              onChange={handleChange}
              className="dashboard-create-event-input"
            />
            <input
              type="text"
              name="isActive"
              placeholder="Status"
              value={eventData.isActive}
              onChange={handleChange}
              className="dashboard-create-event-input"
            />
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
