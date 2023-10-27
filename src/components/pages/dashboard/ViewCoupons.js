import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import './ViewCoupons.css';

function CouponPage() {
  const [coupons, setCoupons] = useState([]);
  const [showCouponDeletedMessage, setShowCouponDeletedMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [deleteCouponId, setDeleteCouponId] = useState(null);

  const fetchCoupons = () => {
    const jwtToken = localStorage.getItem('jwtToken');

    axios.get('http://localhost:8080/coupons', {
      headers: {
        'Authorization': `Bearer ${jwtToken}`,
      }
    })
    .then((response) => {
      setCoupons(response.data);
    })
    .catch((error) => {
      console.error('Error fetching coupons:', error);
    });
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleDeleteCoupon = (couponId) => {
    setDeleteCouponId(couponId); // Set the coupon ID to be deleted
  };

  const handleConfirmDelete = () => {
    // Perform the actual deletion and then fetch updated coupons
    if (deleteCouponId) {
      // Fetch the JWT token from local storage
      const jwtToken = localStorage.getItem('jwtToken');

      // Send the DELETE request here
      axios.delete(`http://localhost:8080/coupons/${deleteCouponId}`, {
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
        },
      })
      .then((response) => {
        setShowCouponDeletedMessage(true);

        setTimeout(() => {
            setShowCouponDeletedMessage(false);
        }, 4000);

        fetchCoupons();
      })
      .catch((error) => {
        if (error.response && error.response.data && error.response.data.message) {
            setErrorMessage(error.response.data.message);
        }  
      });
    }
    setDeleteCouponId(null);
  };
  
  const handleCancelDelete = () => {
    setDeleteCouponId(null);
  };

  return (
    <div className="view-coupons-page">

      {showCouponDeletedMessage && (
        <div className="register-success-message">Coupon deleted successfully!</div>
      )}

      {errorMessage && (
        <div className="register-fail-message">{errorMessage}</div>
      )}

      <table className="view-coupons-table">
        <thead>
          <tr>
            <th className="view-coupons-header">#</th>
            <th className="view-coupons-header">Coupon Code</th>
            <th className="view-coupons-header">Discount Percentage</th>
            <th className="view-coupons-header">Created at</th>
            <th className="view-coupons-header">Expires at</th>
            <th className="view-coupons-header">Status</th>
            <th className="view-coupons-header">Actions</th>
          </tr>
        </thead>
        <tbody>
        {coupons.map((coupon, index) => (
            <tr key={coupon.couponId}>
              <td className="view-coupons-data">{index + 1}</td>
              <td className="view-coupons-data">{coupon.couponCode}</td>
              <td className="view-coupons-data">{coupon.discountPercentage}%</td>
              <td className="view-coupons-data">{coupon.createdAt}</td>
              <td className="view-coupons-data">{coupon.expiresAt}</td>
              <td className={`view-coupons-data view-coupons-status ${coupon.isUsed ? 'green-text' : 'orange-text'}`}>
                {coupon.isUsed ? 'Unused' : 'Used'}
              </td>
              <td className="view-coupons-data view-coupons-actions">
                <button
                className="view-coupons-delete-button"
                onClick={() => handleDeleteCoupon(coupon.couponId)}
                >
                <FontAwesomeIcon icon={faTimesCircle} />
                </button>
            </td>
            </tr>
          ))}
        </tbody>
      </table>

      {deleteCouponId !== null && (
        <div className="view-coupons-delete-confirmation-dialog">
          <div className="view-coupons-overlay"></div>
          <div className="view-coupons-dialog">
            <p>Are you sure you want to delete this coupon?</p>
            <div className="view-coupons-button-container">
              <button onClick={handleConfirmDelete} className="view-coupons-confirm-button" >Yes</button>
              <button onClick={handleCancelDelete} className="view-coupons-cancel-button" >No</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default CouponPage;
