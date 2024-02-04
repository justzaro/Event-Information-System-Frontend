import jwt_decode from 'jwt-decode';

export const isAuthenticated = () => {
    const token = localStorage.getItem('jwtToken');
    console.log("1");

  if (!token) {
    return false;
  }
  console.log("2");
  try {
    const decodedToken = jwt_decode(token);
    const currentTime = Date.now() / 1000;
    console.log("3");

    console.log(decodedToken.exp);
    console.log(currentTime);

    if (decodedToken.exp < currentTime) {
      return false;
    }
    console.log("4");

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
            console.log(payload.sub);
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