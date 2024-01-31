import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngleDown, faGear, faCircleXmark, faTimes,
  faCaretLeft,
  faBackwardStep, faSort, faFilter, faMagnifyingGlass
} from '@fortawesome/free-solid-svg-icons';
import { faEye as solidEye } from '@fortawesome/free-solid-svg-icons';
import { faEye as thinEye } from '@fortawesome/free-regular-svg-icons';
import './ManageUsers.css';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [sortedUsers, setSortedUsers] = useState([]);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showUserDeletedSuccessfullyMessage, setUserDeletedSuccessfullyMessage] = useState(false);
  const [showUserDeletedUnsuccessfullyMessage, setUserDeletedUnsuccessfullyMessage] = useState(false);

  const [errorMessage, setErrorMessage] = useState(false);

  const [showUserSettings, setShowUserSettings] = useState(false);
  const [selectedUser, setSelectedUser] = useState(false);
  const [showDimmedBackground, setShowDimmedBackground] = useState(false);
  const [showUserSuccessfulEditMessage, setShowUserSuccessfulEditMessage] = useState(false);
  const [showModifyUserProfile, setShowModifyUserProfile] = useState(false);

  const [attachedImage, setAttachedImage] = useState(null);

  const ITEMS_PER_PAGE = 10; // Number of users to display per page
  const usersPerPage = 10; // Number of users to display per page

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');


  const [searchType, setSearchType] = useState('name'); // Default search type
  const [isLockedFilter, setIsLockedFilter] = useState('all'); // 'all', 'locked', 'unlocked'
  const [isEnabledFilter, setIsEnabledFilter] = useState('all'); // 'all', 'enabled', 'disabled'
  // Calculate the start and end indices for the current page
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  // Function to change the current page
  const changePage = (page) => {
    setCurrentPage(page);
  };

  // Calculate the total number of pages
  const totalPages = Math.ceil(sortedUsers.length / ITEMS_PER_PAGE);

  const [filteredUsers, setFilteredUsers] = useState([]);

  // Function to handle image attachment
  const handleImageAttachment = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        // Set the attached image to the state or wherever you want to store it
        setAttachedImage(imageUrl);
      };
      reader.readAsDataURL(file);
    } else {
      // Clear the attached image if no file is selected
      setAttachedImage(null);
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const fetchUserList = () => {
    fetch('http://localhost:8080/users')
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
        setSortedUsers(data);
        setFilteredUsers(data);
      });
  };

  useEffect(() => {
    fetchUserList();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchQuery, searchType, isLockedFilter, isEnabledFilter]);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Optionally, you can scroll to the top of the page here.
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      // Optionally, you can scroll to the top of the page here.
    }
  };


  const [profileFields, setProfileFields] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
  });

  const [dobDay, setDobDay] = useState('');
  const [dobMonth, setDobMonth] = useState('');
  const [dobYear, setDobYear] = useState('');

  // Function to handle changes in date of birth fields
  const handleDateOfBirthChange = (e) => {
    const { name, value } = e.target;

    // Ensure value is a two-digit string (with leading zero if needed)
    const formattedValue = value.length === 1 ? `0${value}` : value;

    if (name === 'dobDay') {
      setDobDay(formattedValue);
    } else if (name === 'dobMonth') {
      setDobMonth(formattedValue);
    } else if (name === 'dobYear') {
      setDobYear(value);
    }
  };

  const handleProfileFieldChange = (e) => {
    const { name, value } = e.target;
    setProfileFields({
      ...profileFields,
      [name]: value,
    });
  };

  const saveModifiedUserProfile = () => {
    // Create a FormData object to send the data as multipart/form-data
    const formData = new FormData();

    const dateOfBirthFormatted = `${dobDay}-${dobMonth}-${dobYear}`;
    console.log(dateOfBirthFormatted);

    profileFields.dateOfBirth = dateOfBirthFormatted;

    console.log(profileFields);
    console.log(1);
    // Add the userUpdateDto (profileFields) as a JSON blob to the FormData
    formData.append('userUpdateDto', new Blob([JSON.stringify(profileFields)], { type: 'application/json' }));
    console.log(2);
    // Add the profilePicture (attachedImage) to the FormData
    if (attachedImage) {
      const blob = dataURItoBlob(attachedImage);
      formData.append('profilePicture', blob);
    }
    console.log(3);
    // Retrieve the JWT token from localStorage
    const jwtToken = localStorage.getItem('jwtToken');
    console.log(4);
    // Check if the token exists
    if (jwtToken) {
      // Send a PUT request to update the user's profile
      fetch(`http://localhost:8080/users/${profileFields.username}`, {
        method: 'PUT',
        body: formData,
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
        },
      })
        .then((response) => {
          console.log(5);
          if (response.status === 200) {
            // Profile updated successfully
            console.log(6);
            setShowUserSuccessfulEditMessage(true);

            setTimeout(() => {
              setShowUserSuccessfulEditMessage(false);
            }, 4000);

            console.log(7);
            fetchUserList();
            // You may want to add a success message or update the user's profile image here
          } else {
            response.json().then((errorData) => {
              // Handle error response from the server
              setErrorMessage({ message: errorData.message });
              setUserDeletedUnsuccessfullyMessage(true);

              setTimeout(() => {
                setUserDeletedUnsuccessfullyMessage(false);
              }, 4000);
            }).catch((error) => {
              console.error('Error parsing the error response:', error);
            });
          }
        });
    } else {
      console.error('JWT token not found in localStorage');
    }
    closeModifyUserProfile();
  };

  // Helper function to convert data URI to Blob
  function dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }

  const openModifyUserProfile = () => {
    setShowModifyUserProfile(true);
    closeUserSettings();
  };

  const closeModifyUserProfile = () => {
    setShowModifyUserProfile(false);
    setShowDimmedBackground(false);
    setAttachedImage(null);
    // Reset any form input fields if needed
  };

  const openUserSettings = (user) => {
    const setDateOfBirthField = (dob) => {
      if (dob) {
        const [day, month, year] = dob.split('-');
        return `${day}-${month}-${year}`;
      }
      return '';
    };


    setProfileFields({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      username: user.username || '',
      email: user.email || '',
      dateOfBirth: setDateOfBirthField(user.dateOfBirth) || '',
      password: user.password || '',
      address: user.address || ''
    });

    const dobParts = user.dateOfBirth ? user.dateOfBirth.split('-') : ['', '', ''];
    setDobDay(dobParts.length === 3 ? dobParts[0] : '');
    setDobMonth(dobParts.length === 3 ? dobParts[1] : '');
    setDobYear(dobParts.length === 3 ? dobParts[2] : '');

    setSelectedUser(user);
    setShowUserSettings(true);
    setShowDimmedBackground(true);
  };

  const closeUserSettings = () => {
    setSelectedUser(null);
    setShowUserSettings(false);
    setShowDimmedBackground(false);
  };

  const toggleEnableUserProfile = (user) => {
    const updatedUser = { ...user, isEnabled: !user.isEnabled };
    // Retrieve the JWT token from localStorage
    const jwtToken = localStorage.getItem('jwtToken');

    // Check if the token exists
    if (jwtToken) {
      // Include the token in the headers of the PATCH request
      fetch(`http://localhost:8080/users/${user.username}/enabled`, {
        method: 'PATCH',
        body: JSON.stringify(updatedUser),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`,
        },
      })
        .then((response) => {
          if (response.status === 200) {
            const updatedIndex = sortedUsers.findIndex((u) => u.username === user.username);
            if (updatedIndex !== -1) {
              const newSortedUsers = [...sortedUsers];
              newSortedUsers[updatedIndex].isEnabled = !user.isEnabled;
              setSortedUsers(newSortedUsers);
            }

            setShowUserSuccessfulEditMessage(true);

            setTimeout(() => {
              setShowUserSuccessfulEditMessage(false);
            }, 4000);
          } else {
            console.error('Failed to update user profile');
          }
        });
    } else {
      console.error('JWT token not found in localStorage');
    }
    closeUserSettings();
  };

  const toggleLockUserProfile = (user) => {
    const updatedUser = { ...user, isLocked: !user.isLocked };
    // Retrieve the JWT token from localStorage
    const jwtToken = localStorage.getItem('jwtToken');

    // Check if the token exists
    if (jwtToken) {
      // Include the token in the headers of the PATCH request
      fetch(`http://localhost:8080/users/${user.username}/locked`, {
        method: 'PATCH',
        body: JSON.stringify(updatedUser),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`,
        },
      })
        .then((response) => {
          if (response.status === 200) {
            const updatedIndex = sortedUsers.findIndex((u) => u.username === user.username);
            if (updatedIndex !== -1) {
              const newSortedUsers = [...sortedUsers];
              newSortedUsers[updatedIndex].isLocked = !user.isLocked;
              setSortedUsers(newSortedUsers);
            }

            setShowUserSuccessfulEditMessage(true);

            setTimeout(() => {
              setShowUserSuccessfulEditMessage(false);
            }, 4000);
          } else {
            console.error('Failed to update user profile');
          }
        });
    } else {
      console.error('JWT token not found in localStorage');
    }
    closeUserSettings();
  };


  const sortUsers = (field) => {
    let direction = sortDirection;

    // If sorting by the same field, toggle the sort direction
    if (sortField === field) {
      direction = sortDirection === 'asc' ? 'desc' : 'asc';
    }

    let sorted = [...sortedUsers];

    if (field === 'id') {
      // For numeric sorting, convert to numbers and then sort
      sorted.sort((a, b) => {
        const numA = parseInt(a[field], 10);
        const numB = parseInt(b[field], 10);

        if (numA < numB) return direction === 'asc' ? -1 : 1;
        if (numA > numB) return direction === 'asc' ? 1 : -1;
        return 0;
      });
    } else {
      // For other fields, perform string sorting
      sorted.sort((a, b) => {
        if (a[field] < b[field]) return direction === 'asc' ? -1 : 1;
        if (a[field] > b[field]) return direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    setSortField(field);
    setSortDirection(direction);
    setSortedUsers(sorted);
  };

  const deleteUser = (username) => {
    // Retrieve the JWT token from localStorage
    const jwtToken = localStorage.getItem('jwtToken');

    // Check if the token exists
    if (jwtToken) {

      // Include the token in the headers of the DELETE request
      fetch(`http://localhost:8080/users/${username}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${jwtToken}`
        },
      })
        .then((response) => {
          if (response.status === 204) {
            // If the user was successfully deleted, you can remove them from your state.
            const updatedUsers = users.filter((user) => user.username !== username);
            setUsers(updatedUsers);
            setSortedUsers(updatedUsers);

            setUserDeletedSuccessfullyMessage(true);

            setTimeout(() => {
              setUserDeletedSuccessfullyMessage(false);
            }, 4000);

            fetchUserList();
          } else {
            response.json().then((errorData) => {
              // Handle error response from the server
              setErrorMessage({ message: errorData.message });
              setUserDeletedUnsuccessfullyMessage(true);

              setTimeout(() => {
                setUserDeletedUnsuccessfullyMessage(false);
              }, 4000);
            }).catch((error) => {
              console.error('Error parsing the error response:', error);
            });
          }
        });
    } else {
      console.error('JWT token not found in localStorage');
    }
  };

  const filterUsers = () => {
    const filtered = sortedUsers.filter((user) => {
      const query = searchQuery.toLowerCase();
      const fullName = (user.firstName + ' ' + user.lastName).toLowerCase();

      const userValue = searchType === 'name' ? fullName : user[searchType]?.toLowerCase() || ''; // Default to an empty string if undefined

      const isLocked = user.isLocked;
      const isEnabled = user.isEnabled;

      const nameMatch = searchType === 'name' && userValue.toLowerCase().includes(query);
      const usernameMatch = searchType === 'username' && userValue.includes(query);
      const emailMatch = searchType === 'email' && userValue.includes(query);

      let lockedFilterMatch = true;
      if (isLockedFilter === 'locked') {
        lockedFilterMatch = !isLocked;
      } else if (isLockedFilter === 'unlocked') {
        lockedFilterMatch = isLocked;
      }

      // Filter based on isEnabled
      let activeFilterMatch = true;
      if (isEnabledFilter === 'active') {
        activeFilterMatch = isEnabled;
      } else if (isEnabledFilter === 'inactive') {
        activeFilterMatch = !isEnabled;
      }

      return (nameMatch || usernameMatch || emailMatch) && lockedFilterMatch && activeFilterMatch;
    });
    setFilteredUsers(filtered);
  };


  const openDeleteConfirmation = (username) => {
    setUserToDelete(username);
    setShowConfirmation(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      deleteUser(userToDelete);
      setUserToDelete(null);
      setShowConfirmation(false);
    }
  };

  const cancelDelete = () => {
    setUserToDelete(null);
    setShowConfirmation(false);
  };

  return (
    <div className="user-dashboard-users-table">
      {showDimmedBackground && <div className="dimmed-background"></div>}

      {showUserSuccessfulEditMessage && (
        <div className="register-success-message">
          User profile updated successfully!
        </div>
      )}

      {showUserDeletedSuccessfullyMessage && (
        <div className="register-success-message">User deleted successfully!</div>
      )}

      {showUserDeletedUnsuccessfullyMessage && (
        <div className="register-fail-message">{errorMessage}</div>
      )}

      <div className="manage-users-search-bar">
        <FontAwesomeIcon icon={faMagnifyingGlass} className="manage-users-search-bar-icon" />
        <input
          type="text"
          placeholder={`Search by ${searchType}`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <FontAwesomeIcon icon={faSort} className="manage-users-search-bar-icon" />
        <select onChange={(e) => setSearchType(e.target.value)} value={searchType} className="manage-users-select">
          <option value="name">Name</option>
          <option value="username">Username</option>
          <option value="email">Email</option>
        </select>
        <FontAwesomeIcon icon={faFilter} className="manage-users-search-bar-icon" />
        <select onChange={(e) => setIsLockedFilter(e.target.value)} value={isLockedFilter} className="manage-users-select">
          <option value="all">All</option>
          <option value="locked">Locked</option>
          <option value="unlocked">Unlocked</option>
        </select>
        <FontAwesomeIcon icon={faFilter} className="manage-users-search-bar-icon" />
        <select onChange={(e) => setIsEnabledFilter(e.target.value)} value={isEnabledFilter} className="manage-users-select">
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>



      <table className="user-dashboard-table">
        <thead>
          <tr>
            <th onClick={() => sortUsers('id')} className="sortable-header">
              # <FontAwesomeIcon icon={faAngleDown} />
            </th>
            <th onClick={() => sortUsers('firstName')} className="sortable-header">
              Name <FontAwesomeIcon icon={faAngleDown} />
            </th>
            <th onClick={() => sortUsers('username')} className="sortable-header">
              Username <FontAwesomeIcon icon={faAngleDown} />
            </th>
            <th onClick={() => sortUsers('email')} className="sortable-header">
              Email <FontAwesomeIcon icon={faAngleDown} />
            </th>
            <th>Account Locked Status</th>
            <th>Account Enabled Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage).map((user) => (
            <tr key={user.id} className="user-dashboard-table">
              <td className="user-id">{user.id}</td>
              <td className="user-name">{user.firstName} {user.lastName}</td>
              <td className="user-username">{user.username}</td>
              <td className="user-email">{user.email}</td>
              <td className={`user-status ${user.isLocked ? 'inactive' : 'active'}`}>
                {user.isLocked ? 'Locked' : 'Unlocked'}
              </td>
              <td className={`user-status ${user.isEnabled ? 'active' : 'inactive'}`}>
                {user.isEnabled ? 'Active' : 'Inactive'}
              </td>
              <td className="user-actions">
                <button className="user-action-button user-settings-button">
                  <FontAwesomeIcon icon={faGear} onClick={() => openUserSettings(user)} />
                </button>
                <button className="user-action-button user-delete-button">
                  <FontAwesomeIcon icon={faCircleXmark} onClick={() => openDeleteConfirmation(user.username)} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* {totalPages > 1 && (
        <div className="manage-users-pagination">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              className={`manage-users-page-button ${currentPage === index + 1 ? 'manage-users-current-page' : ''}`}
              onClick={() => changePage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )} */}
      {totalPages > 1 && (
        <div className="manage-users-pagination">
          <button
            onClick={() => paginate(1)}
            disabled={currentPage === 1}
            className={`pagination-button-first ${currentPage === 1 ? 'disabled' : ''}`}
          >
            <FontAwesomeIcon icon={faBackwardStep} />
          </button>
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`pagination-button-previous ${currentPage === 1 ? 'disabled' : ''
              }`}
          >
            <FontAwesomeIcon icon={faCaretLeft} />
          </button>
          {/* Replace number buttons with page input */}
          <div className="page-input-container">
            Page
            <input
              type="number"
              min="1"
              max={totalPages}
              value={currentPage}
              onChange={(e) => handlePageChange(parseInt(e.target.value, 10))}
            />
            of {totalPages}
          </div>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`pagination-button-next ${currentPage === totalPages ? 'disabled' : ''
              }`}
          >
            <FontAwesomeIcon icon={faCaretLeft} rotation={180} />
          </button>
          <button
            onClick={() => paginate(totalPages)}
            disabled={currentPage === totalPages}
            className={`pagination-button-last ${currentPage === totalPages ? 'disabled' : ''
              }`}
          >
            <FontAwesomeIcon icon={faBackwardStep} rotation={180} />
          </button>
        </div>
      )}


      {showConfirmation && (
        <div className="delete-user-confirmation-dialog">
          <p>
            Are you sure you want to permanently delete the user?
            <div className="user-confirmation-buttons">
              <button onClick={confirmDelete}>Yes</button>
              <button onClick={cancelDelete}>No</button>
            </div>
          </p>
        </div>
      )}
      {showUserSettings && selectedUser && (
        <div className="user-settings-menu">
          <button
            className={`modify-user-settings-button ${selectedUser.isEnabled ? 'disable-button' : 'enable-button'}`}
            onClick={() => toggleEnableUserProfile(selectedUser)}
          >
            {selectedUser.isEnabled ? 'Disable User Profile' : 'Enable User Profile'}
          </button>
          <button
            className={`modify-user-settings-button ${selectedUser.isLocked ? 'unlock-button' : 'lock-button'}`}
            onClick={() => toggleLockUserProfile(selectedUser)}
          >
            {selectedUser.isLocked ? 'Unlock User Profile' : 'Lock User Profile'}
          </button>
          <button
            className="modify-user-settings-button modify-profile-button"
            onClick={openModifyUserProfile}
          >
            Modify User Profile
          </button>
          <button className="close-button" onClick={closeUserSettings}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      )}

      {showModifyUserProfile && (

        <div className="modify-user-profile">
          <div className="left-content">
          <h3>Modify User Profile</h3>
            <div className="profile-field">
              <label htmlFor="firstName">First Name:</label>
              <input
                type="text"
                name="firstName"
                value={profileFields.firstName}
                onChange={handleProfileFieldChange}
              />
            </div>
            <div className="profile-field">
              <label htmlFor="lastName">Last Name:</label>
              <input
                type="text"
                name="lastName"
                value={profileFields.lastName}
                onChange={handleProfileFieldChange}
              />
            </div>
            <div className="profile-field">
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                name="username"
                value={profileFields.username}
                onChange={handleProfileFieldChange}
              />
            </div>
            <div className="profile-field">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                name="email"
                value={profileFields.email}
                onChange={handleProfileFieldChange}
              />
            </div>
            <div className="profile-field">
              <label>Date of Birth:</label>
              <div className="modify-user-dob-input">
                <select
                  name="dobDay"
                  value={dobDay}
                  onChange={handleDateOfBirthChange}
                >
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                    <option key={day} value={day < 10 ? `0${day}` : day}>
                      {day < 10 ? `0${day}` : day}
                    </option>
                  ))}
                </select>

                <select
                  name="dobMonth"
                  value={dobMonth}
                  onChange={handleDateOfBirthChange}
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <option key={month} value={month < 10 ? `0${month}` : month}>
                      {month < 10 ? `0${month}` : month}
                    </option>
                  ))}
                </select>

                <select
                  name="dobYear"
                  value={dobYear}
                  onChange={handleDateOfBirthChange}
                >
                  {Array.from({ length: 151 }, (_, i) => 1900 + i).map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              <div className="profile-field">
              <label htmlFor="password">Password:</label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={profileFields.password}
                onChange={handleProfileFieldChange}
              />
              <FontAwesomeIcon
                icon={showPassword ? solidEye : thinEye}
                onClick={togglePasswordVisibility}
                className="save-user-settings-password-toggle"
              />
            </div>
            <div className="profile-field">
              <label htmlFor="address">Address:</label>
              <input
                type="text"
                name="address"
                value={profileFields.address}
                onChange={handleProfileFieldChange}
              />
            </div>
            </div>
          </div>

          <div className="right-content">

            <button className="close-button" onClick={closeModifyUserProfile}>
              <FontAwesomeIcon icon={faTimes} />
            </button>

            <br />
            {attachedImage ? (
              <img
                src={attachedImage}
                alt="Attached Image"
              />
            ) : (
              <img
                src={`http://localhost:8080/users/profile-picture/${profileFields.username}`}
                alt="Profile Picture"
              />
            )}

            {/* Input to attach an image from the PC */}
            <p className="save-user-attach-image-label">Attach Image: </p>
            <input
              id="file-input"
              type="file"
              accept="image/*"
              onChange={handleImageAttachment}
              className="custom-file-input"
            />

            {attachedImage && (
              <button
                onClick={() => {
                  setAttachedImage(null);
                  const fileInput = document.getElementById('file-input'); // Add an `id` to your file input element
                  if (fileInput) {
                    fileInput.value = ''; // Reset the file input value to an empty string
                  }

                }}
                className="remove-image-button"
              >
                Remove Attached Image
              </button>
            )}
            
            <div className="profile-actions">
              <hr />
              <button
                onClick={saveModifiedUserProfile}
                className="save-profile-changes-button"
              >
                Save Changes
              </button>
              <button
                onClick={closeModifyUserProfile}
                className="discard-profile-changes-button"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>

      )}
    </div>
  );
};

export default ManageUsers;
