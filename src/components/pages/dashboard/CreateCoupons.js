import React, { useState } from 'react';
import axios from 'axios';
import './CreateCoupons.css';

const CreateCoupons = () => {
  const [couponsToBeGenerated, setCouponsToBeGenerated] = useState(0);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [showCouponsCreatedSuccessfully, setShowCouponsCreatedSuccessfully] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  const handleGenerateCoupons = () => {
    if (couponsToBeGenerated >= 0 && couponsToBeGenerated <= 300 && discountPercentage >= 0 && discountPercentage <= 90) {
      const jwtToken = localStorage.getItem('jwtToken');
      const data = {
        couponsToBeGenerated,
        discountPercentage,
      };

      axios.post('http://localhost:8080/coupons/single-use', data, {
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
        }
      })
      .then(response => {
        setShowCouponsCreatedSuccessfully(true);

        setTimeout(() => {
            setShowCouponsCreatedSuccessfully(false);
        }, 4000);

        console.log(response.data);
      })
      .catch(error => {
        setErrorMessage(error.response ? (error.response.data.message || 'An error occurred') : 'An error occurred');
        
        setShowErrorMessage(true);

        setTimeout(() => {
            setShowErrorMessage(false);
        }, 4000);
      });
    } else {
      console.error('Input values are not within the allowed range.');
    }

    setCouponsToBeGenerated(0);
    setDiscountPercentage(0);
  };

  return (
    <div className="create-coupons-container">

      {showCouponsCreatedSuccessfully && (
        <div className="register-success-message">Coupons generated successfully!</div>
      )}
      {showErrorMessage && (
        <div className="register-fail-message">{errorMessage}</div>
      )}

      <div className="create-coupons-input-container">
        <label htmlFor="create-coupons-couponsToBeGenerated">Number of Coupons:</label>
        <input
          type="number"
          id="create-coupons-couponsToBeGenerated"
          value={couponsToBeGenerated}
          onChange={(e) => setCouponsToBeGenerated(e.target.value)}
          min={0}
          max={300}
        />
      </div>
      <div className="create-coupons-input-container">
        <label htmlFor="create-coupons-discountPercentage">Discount Percentage (%):</label>
        <input
          type="number"
          id="create-coupons-discountPercentage"
          value={discountPercentage}
          onChange={(e) => setDiscountPercentage(e.target.value)}
          min={0}
          max={90}
        />
      </div>
      <button
        className="create-coupons-generate-button"
        onClick={handleGenerateCoupons}
      >
        Generate Coupons
      </button>
    </div>
  );
};

export default CreateCoupons;
