import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faGear, faCircleXmark, faTimes } from '@fortawesome/free-solid-svg-icons';
import './ManageUsers.css';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [sortedUsers, setSortedUsers] = useState([]);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showUserDeletedSuccessfullyMessage, setUserDeletedSuccessfullyMessage] = useState(false);
  const [showUserDeleteUnsuccessfullyMessage, setUserDeletedUnsuccessfullyMessage] = useState(false);

  const [showUserSettings, setShowUserSettings] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDimmedBackground, setShowDimmedBackground] = useState(false);
  const [showUserSuccessfulEditMessage, setShowUserSuccessfulEditMessage] = useState(false);
  const [showModifyUserProfile, setShowModifyUserProfile] = useState(false);

  useEffect(() => {
    // Fetch all users from 'http://localhost:8080/users/'
    fetch('http://localhost:8080/users')
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
        setSortedUsers(data);
      });
  }, []);

  const [profileFields, setProfileFields] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
  });

  const handleProfileFieldChange = (e) => {
    const { name, value } = e.target;
    setProfileFields({
      ...profileFields,
      [name]: value,
    });
  };

  const saveModifiedUserProfile = () => {
    // You can send a PATCH request to update the user's profile using the values in profileFields
    // Make sure to include the JWT token in the headers of the request
    // After a successful update, close the modification window
    console.log('Saving profile changes:', profileFields);
    // Implement your fetch request here

    closeModifyUserProfile();
  };

  const openModifyUserProfile = () => {
    setShowModifyUserProfile(true);
    closeUserSettings();
  };
  
  const closeModifyUserProfile = () => {
    setShowModifyUserProfile(false);
    setShowDimmedBackground(false);
    // Reset any form input fields if needed
  };
  

  const openUserSettings = (user) => {
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
            setUsers((prevUsers) =>
              prevUsers.map((u) => (u.username === updatedUser.username ? updatedUser : u))
            );
            setSortedUsers((prevSortedUsers) =>
              prevSortedUsers.map((u) => (u.username === updatedUser.username ? updatedUser : u))
            );

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
            setUsers((prevUsers) =>
              prevUsers.map((u) => (u.username === updatedUser.username ? updatedUser : u))
            );
            setSortedUsers((prevSortedUsers) =>
              prevSortedUsers.map((u) => (u.username === updatedUser.username ? updatedUser : u))
            );
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
            } else {
                setUserDeletedUnsuccessfullyMessage(true);
                setTimeout(() => {
                    setUserDeletedUnsuccessfullyMessage(false);
                }, 4000);
                console.error('Failed to delete the user');
            }
        });
    } else {
        console.error('JWT token not found in localStorage');
    }
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
          {sortedUsers.map((user) => (    
            <tr key={user.id} className="user-dashboard-table">
              <td className="user-id">{user.id}</td>
              <td className="user-name">{user.firstName} {user.lastName}</td>
              <td className="user-username">{user.username}</td>
              <td className="user-email">{user.email}</td>
              <td className={`user-status ${user.isLocked ? 'active' : 'inactive'}`}>
                {user.isLocked ? 'Unlocked' : 'Locked'}
              </td>
              <td className={`user-status ${user.isEnabled ? 'active' : 'inactive'}`}>
                {user.isEnabled ? 'Active' : 'Inactive'}
              </td>
              <td className="user-actions">
                <button className="user-action-button user-settings-button">
                  <FontAwesomeIcon icon={faGear} onClick={() => openUserSettings(user)}/>
                </button>
                <button className="user-action-button user-delete-button">
                  <FontAwesomeIcon icon={faCircleXmark} onClick={() => openDeleteConfirmation(user.username)} />
                </button>      
              </td>
            </tr>          
          ))}
        </tbody>
      </table>
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
            className={`modify-user-settings-button ${selectedUser.isLocked ? 'lock-button' : 'unlock-button'}`}
            onClick={() => toggleLockUserProfile(selectedUser)}
          >
            {selectedUser.isLocked ? 'Lock User Profile' : 'Unlock User Profile'}
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
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              name="password"
              value={profileFields.password}
              onChange={handleProfileFieldChange}
            />
          </div>
          <button className="close-button" onClick={closeModifyUserProfile}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
          <div className="profile-actions">
            <button onClick={saveModifiedUserProfile}>Save Changes</button>
            <button onClick={closeModifyUserProfile}>Cancel</button>
          </div>
        </div>
        
      )}
    </div>
  );
};

export default ManageUsers;
