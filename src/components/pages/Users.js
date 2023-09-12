import React, { useState, useEffect } from 'react';

const Users = () => {
  const [userData, setUserData] = useState(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const username = 'pavlina'; // Replace with the actual username

    // Get the JWT token from local storage
    const jwtToken = localStorage.getItem('jwtToken');

    // Check if the token exists
    if (jwtToken) {
      // Create headers with the Authorization Bearer token
      const headers = {
        Authorization: `Bearer ${jwtToken}`,
      };

      // Fetch user data with the Authorization header
      fetch(`http://localhost:8080/users/${username}`, { headers })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Failed to fetch user data');
          }
        })
        .then((userDataResponse) => {
          setUserData(userDataResponse);
          // Fetch the profile picture after user data has been loaded
          fetchProfilePicture(username, headers);
        })
        .catch((error) => {
          setError(error.message);
        });
    } else {
      // Handle the case where the JWT token is missing in local storage
      setError('JWT token not found in local storage');
    }
  }, []);

  // Function to fetch the profile picture
  const fetchProfilePicture = (username, headers) => {
    fetch(`http://localhost:8080/users/profile-picture/${username}`, { headers })
      .then((response) => {
        if (response.ok) {
          return response.blob();
        } else {
          throw new Error('Failed to fetch profile picture');
        }
      })
      .then((profilePictureBlob) => {
        const imageUrl = URL.createObjectURL(profilePictureBlob);
        setProfilePictureUrl(imageUrl);
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  return (
    <div>
      <h1>Users</h1>
      {error ? (
        <p>Error: {error}</p>
      ) : userData ? (
        <div>
          {/* Other user data */}
          <p>First name: {userData.firstName}</p>
          <p>Last name: {userData.lastName}</p>
          <p>Username: {userData.username}</p>
          <p>Password: {userData.password}</p>
          <p>Email: {userData.email}</p>
          <p>User role: {userData.userRole}</p>
          <img
            src={profilePictureUrl}
            alt={`${userData.profilePicturePath}'s Profile`}
            width={200}
            height={200}
          />
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default Users;
