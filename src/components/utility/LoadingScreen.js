import React from 'react';
import './LoadingScreen.css';

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
