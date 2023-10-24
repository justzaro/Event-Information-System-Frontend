import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import './ModifyEvent.css';

const EventDropdown = ({ events, selectedEvent, onSelectEvent }) => {
  return (
    <div>
      <h2 className="choose-event-heading">Choose event: </h2>
    <select value={selectedEvent ? selectedEvent.id : ''} onChange={onSelectEvent} className="choose-event-dropdown">
      <option value="">Select an event</option>
      {events.map(event => (
        <option key={event.id} value={event.id}>
          {event.name}
        </option>
      ))}
    </select>
    </div>
  );
};

const ModifyEvent = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [availableArtists, setAvailableArtists] = useState([]);
  const [selectedArtists, setSelectedArtists] = useState([]);
  const [showArtistDropdown, setShowArtistDropdown] = useState(false);

  const [startingTime, setStartingTime] = useState('');
  const [startingMinutes, setStartingMinutes] = useState('');
  const [endingTime, setEndingTime] = useState('');
  const [endingMinutes, setEndingMinutes] = useState('');

  const [formattedStartDate, setFormattedStartDate] = useState('');
  const [formattedEndDate, setFormattedEndDate] = useState('');

  const [eventImage, setEventImage] = useState(null);

  const [showImageModal, setShowImageModal] = useState(false);

  const [showEventModifiedSuccessfullyMessage, setShowEventModifiedSuccessfullyMessage] = useState(false);
  const [showEventModifiedUnsuccessfullyMessage, setShowEventModifiedUnsuccessfullyMessage] = useState(false);
  
  const [errorMessage, setErrorMessage] = useState('');

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

  // After you fetch and set selectedEvent, you can parse its start and end times
  useEffect(() => {
    if (selectedEvent) {
      const [startDateTime, endDateTime] = [selectedEvent.startDate, selectedEvent.endDate].map(dateTimeString => {
        const [time, date] = dateTimeString.split(' ');
        const [hours, minutes] = time.split(':');
        return { hours, minutes, date };
      });

      setStartingTime(startDateTime.hours);
      setStartingMinutes(startDateTime.minutes);
      setEndingTime(endDateTime.hours);
      setEndingMinutes(endDateTime.minutes);

      // Reformat and set the date parts in eventData
      setFormattedStartDate(startDateTime.date.split('/').reverse().join('-'));
      setFormattedEndDate(endDateTime.date.split('/').reverse().join('-'));

      setEventData({
        ...eventData,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      });
    }
  }, [selectedEvent, formattedStartDate, formattedEndDate]);



  useEffect(() => {
    // Fetch the list of events from 'http://localhost:8080/events'
    fetch('http://localhost:8080/events')
      .then((response) => response.json())
      .then((data) => setEvents(data));
  }, []);

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

  const handleImageChange = (e) => {
    const image = e.target.files[0];
    setEventImage(image); // Store the selected image separately
  };

  const toggleImageModal = () => {
    setShowImageModal(!showImageModal);
  };

  const handleClearImage = () => {
    setEventImage(null);
    // Clear the input field by selecting it and setting its value to an empty string
    const imageInput = document.querySelector('input[name="image"]');
    if (imageInput) {
      imageInput.value = '';
    }
  };

  const handleEventSelection = (e) => {
    const selectedEventId = parseInt(e.target.value, 10);
    const event = events.find((event) => event.id === selectedEventId);
  
    if (event) {
      setSelectedEvent(event);
      setSelectedArtists(event.artists);
  
      // Update eventData with the selected event's information
      setEventData({
        ...eventData,
        name: event.name,
        description: event.description,
        location: event.location,
        eventType: event.eventType,
        startDate: event.startDate,
        endDate: event.endDate,
        ticketPrice: event.ticketPrice,
        capacity: event.capacity,
        isActive: event.isActive,
      });
  
      fetch(`http://localhost:8080/events/event-picture/${event.name}`)
        .then((response) => {
          if (response.ok) {
            return response.blob();
          } else {
            return null; // Handle this case as needed
          }
        })
        .then((imageBlob) => {
          if (imageBlob) {
            // Convert the image blob to a URL
            setEventImage(imageBlob);
          } else {
            console.error("Failed to fetch the image.");
          }
        });
    }
  };
  

  useEffect(() => {
    if (selectedEvent) {
      console.log('Fetching artists...');
      fetch(`http://localhost:8080/artists`)
        .then(response => response.json())
        .then(data => setAvailableArtists(data));
    }
  }, [selectedEvent]);
  const toggleArtistDropdown = () => {
    console.log('Toggling artist dropdown...');

    setShowArtistDropdown(!showArtistDropdown);
  };

  const handleArtistSelection = (e) => {
    const artistId = parseInt(e.target.value); // Convert the artist ID to a number
    console.log('Selected artist ID:', artistId);

    if (!selectedArtists.some((artist) => artist.id === artistId)) {
      const selectedArtist = availableArtists.find((artist) => artist.id === artistId);
  
      if (selectedArtist) {
        setSelectedArtists([...selectedArtists, selectedArtist]);
      }
    }
  };

  const removeSelectedArtist = (artist) => {
    const updatedSelectedArtists = selectedArtists.filter(selectedArtist => selectedArtist.id !== artist.id);
    setSelectedArtists(updatedSelectedArtists);
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
    setStartingMinutes('');
    setEndingMinutes('');
    const imageInput = document.querySelector('input[name="image"]');
    if (imageInput) {
      imageInput.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('asd');
    // Format startDate and endDate
    const formattedStartDate = `${startingTime}:${startingMinutes} ${eventData.startDate}`;
    const formattedEndDate = `${endingTime}:${endingMinutes} ${eventData.endDate}`;
    eventData.startDate = formattedStartDate;
    eventData.endDate = formattedEndDate;

    eventData.artists = selectedArtists;

    if (eventData.eventType === 'FESTIVAL') {
      eventData.ticketPrice = 0;
      eventData.capacity = 0;
    }

    console.log('->>>>' + eventData.isActive);

    // Assuming 'jwtToken' is stored locally
    const jwtToken = localStorage.getItem('jwtToken');

    // Prepare the request data
    const formData = new FormData();
    formData.append('eventDto', new Blob([JSON.stringify(eventData)], { type: 'application/json' }));
    formData.append('eventPicture', eventImage);

    try {
      const response = await fetch(`http://localhost:8080/events/update/${selectedEvent.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
        body: formData,
      });

      console.log(eventData);

      if (response.ok) {
        setShowEventModifiedSuccessfullyMessage(true);

        setTimeout(() => {
          setShowEventModifiedSuccessfullyMessage(false);
        }, 4000);
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.message;

        setErrorMessage(errorMessage);

        setShowEventModifiedUnsuccessfullyMessage(true);

        setTimeout(() => {
          setShowEventModifiedUnsuccessfullyMessage(false);
        }, 4000);
      }
    } catch (error) {
      console.error('Error:', error);
      setShowEventModifiedUnsuccessfullyMessage(true);

      setTimeout(() => {
        setShowEventModifiedUnsuccessfullyMessage(false);
      }, 4000);
    }

    resetForm();
    setSelectedEvent(null);
  };

  return (
<div className={`dashboard-create-event-container${eventImage || selectedArtists.length > 0 ? '-expanded' : ''}`}>

{showEventModifiedSuccessfullyMessage && (
        <div className="register-success-message">Event modified successfully!</div>
      )}
      {showEventModifiedUnsuccessfullyMessage && (
        <div className="register-success-message">There was an error modifying the event!</div>
      )}
      {showEventModifiedUnsuccessfullyMessage && (
        <div className="register-fail-message">{errorMessage}</div>
      )}

      <div className="dashboard-create-event-wrapper">
      <EventDropdown events={events} selectedEvent={selectedEvent} onSelectEvent={handleEventSelection} />

        {/* <form onSubmit={handleSubmit}> */}
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
            rows="4"
            onChange={handleChange}

            className="dashboard-create-event-textarea"
          />
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
  value={eventData.eventType}
  // onChange={(e) => setEventType(e.target.value)}
  onChange={handleChange}

  className="dashboard-create-event-input"
>
  <option value="FESTIVAL">Festival</option>
  <option value="CONCERT">Concert</option>
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
              disabled={selectedEvent && eventData.eventType === 'FESTIVAL'}
            />

            <input
              type="text"
              name="capacity"
              placeholder="Capacity"
              value={eventData.capacity}
              onChange={handleChange}
              className="dashboard-create-event-input"
              disabled={selectedEvent && eventData.eventType === 'FESTIVAL'}

            />

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
            <button onClick={toggleArtistDropdown} className="artist-dropdown-button">
              Show Artists
            </button>
            {showArtistDropdown && (
              <select
                name="artists"
                className="artist-dropdown artist-dropdown-select"
                multiple={true}
                onChange={handleArtistSelection}
                value={selectedArtists.map(artist => artist.id)}
              >
                {availableArtists.map(artist => (
                  <option key={artist.id} value={artist.id}>
                    {artist.firstName} {artist.lastName}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="selected-artists-container">
  <div className="selected-artists">
  {selectedArtists.map((artist) => (
  <div key={artist.id} className="selected-artist">
    {artist.firstName} {artist.lastName}
    <button onClick={() => removeSelectedArtist(artist)} className="remove-artist-button">
      Remove
    </button>
  </div>
))}

  </div>
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
              value={formattedStartDate}
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
              value={formattedEndDate}
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
            {eventImage && (
              <FontAwesomeIcon icon={faTimes} onClick={handleClearImage} className="clear-image-icon" />
            )}
          </div>

          {eventImage && (
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
                  src={typeof eventImage === 'string' ? eventImage : URL.createObjectURL(eventImage)}
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
            Modify Event
          </button>
        </div>
      </div>
      {/* </form> */}
    </div>
  );
};

export default ModifyEvent;
