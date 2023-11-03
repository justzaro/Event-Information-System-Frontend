// LoadingScreen.js
import React from 'react';
import './LoadingScreen.css'; // Import the associated CSS file

const LoadingScreen = ({ isLoading }) => {
  return (
    isLoading && (
      <div className="loading-screen">
        <div className="spinner"></div>
      </div>
    )
  );
};

export default LoadingScreen;
