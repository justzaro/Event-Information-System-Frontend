import jwt_decode from 'jwt-decode';

export function isAdmin() {
  const jwtToken = localStorage.getItem('jwtToken');

  if (jwtToken) {
    const tokenParts = jwtToken.split('.');

    if (tokenParts.length === 3) {
      try {
        const payload = JSON.parse(atob(tokenParts[1]));

        if (payload.role === 'ADMIN') {
          return true;
        } else {

          return false;
        }
      } catch (error) {
        console.error('Error decoding JWT token:', error);
        return false;
      }
    } else {
      console.error('JWT token has an incorrect format.');
      return false;
    }
  } else {
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
    const currentTime = Date.now() / 1000;

    if (decodedToken.exp < currentTime) {
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error decoding JWT token:', error);
    return false;
  }
  };
  
  export function getUsernameFromToken() {
    const jwtToken = localStorage.getItem('jwtToken');
  
    if (jwtToken) {
      const tokenParts = jwtToken.split('.');
      
      if (tokenParts.length === 3) {
        try {
          const payload = JSON.parse(atob(tokenParts[1]));
          
          if (payload.sub) {
            return payload.sub;
          } else {
            return null;
          }
        } catch (error) {
          console.error('Error decoding JWT token:', error);
          return null;
        }
      } else {
        console.error('JWT token has an incorrect format.');
        return null;
      }
    } else {
      console.error('JWT token not found in local storage.');
      return null;
    }
  }