import jwt_decode from 'jwt-decode';

export function isAdmin() {
  // Get the JWT token from local storage
  const jwtToken = localStorage.getItem('jwtToken');
  if (jwtToken) {
    // Split the token into its parts: header, payload, and signature
    const tokenParts = jwtToken.split('.');

    // Check if the token has the required parts
    if (tokenParts.length === 3) {
      try {
        // Decode the payload, which is the second part of the token
        const payload = JSON.parse(atob(tokenParts[1]));

        // Check if the payload contains a "ROLE" property and if it is set to "ADMIN"
        if (payload.role === 'ADMIN') {
          // User is an admin
          return true;
        } else {

          return false;
        }
      } catch (error) {
        // Handle any parsing errors (e.g., invalid token format)
        console.error('Error decoding JWT token:', error);
        return false;
      }
    } else {
      // Handle tokens with incorrect format
      console.error('JWT token has an incorrect format.');
      return false;
    }
  } else {
    // Handle the case where the JWT token is not present in local storage
    console.error('JWT token not found in local storage.');
    return false;
  }
}


export const isAuthenticated = () => {
    const token = localStorage.getItem('jwtToken');
  
  if (!token) {
    return false;
  }

  try {
    const decodedToken = jwt_decode(token);
    const currentTime = Date.now() / 1000; // Convert to seconds

    // console.log(decodedToken.exp);
    // console.log(currentTime);

    // Check if the token has expired
    if (decodedToken.exp < currentTime) {
     
      return false; // Token has expired
    }

    return true; // Token is valid and not expired
  } catch (error) {
    console.error('Error decoding JWT token:', error);
    return false; // Token couldn't be decoded
  }
  };
  
  export function getUsernameFromToken() {
    // Get the JWT token from local storage
    const jwtToken = localStorage.getItem('jwtToken');
  
    if (jwtToken) {
      // Split the token into its parts: header, payload, and signature
      const tokenParts = jwtToken.split('.');
      
      // Check if the token has the required parts
      if (tokenParts.length === 3) {
        try {
          // Decode the payload, which is the second part of the token
          const payload = JSON.parse(atob(tokenParts[1]));
          
          // Check if the payload contains a "username" property
          if (payload.sub) {
            // Return the username
            return payload.sub;
          } else {
            // If "username" property is not found in payload, return null or handle accordingly
            return null;
          }
        } catch (error) {
          // Handle any parsing errors (e.g., invalid token format)
          console.error('Error decoding JWT token:', error);
          return null;
        }
      } else {
        // Handle tokens with incorrect format
        console.error('JWT token has an incorrect format.');
        return null;
      }
    } else {
      // Handle the case where the JWT token is not present in local storage
      console.error('JWT token not found in local storage.');
      return null;
    }
  }