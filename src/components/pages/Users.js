import React from 'react';
import { useState, useEffect } from 'react';

const Users = () => {
    const [userData, setUserData] = useState(null);
    const [profilePictureUrl, setProfilePictureUrl] = useState(null);
    const [error, setError] = useState(null);
  
    useEffect(() => {
        const username = 'pavlina'; // Replace with the actual username
    
        // Fetch user data and profile picture data in parallel
        Promise.all([
          fetch(`http://localhost:8080/users/${username}`).then(response => response.json()),
          fetch(`http://localhost:8080/users/profile-picture/${username}`).then(response => response.blob())
        ])
          .then(([userDataResponse, profilePictureBlob]) => {
            setUserData(userDataResponse);
            const imageUrl = URL.createObjectURL(profilePictureBlob);
            setProfilePictureUrl(imageUrl);
          })
          .catch(error => setError(error.message));
      }, []);

    return (
     
      <div>
        <h1>Users</h1>
        {error ? (
          <p>Error: {error}</p>
        ) : userData ? (
          <div>
            <p>First name: {userData.firstName}</p>
            <p>Last name: {userData.lastName}</p>
            <p>Username: {userData.username}</p>
            <p>Password: {userData.password}</p>
            <p>Email: {userData.email}</p>
            <p>User role: {userData.userRole}</p>
            <img src={profilePictureUrl} alt={`${userData.profilePicturePath}'s Profile`} width={200} height={200} />
            {/* Other user data fields */}
          </div>
        ) : (
          <p>Loading user data...</p>
        )}
      </div>
      
    );
  };
  
  export default Users;