// CartItems.js
import React, { useEffect, useState } from 'react';
import { getUsernameFromToken } from '../utility/AuthUtils';
import CartItem from './CartItem';
import './CartItems.css';
import { Link } from 'react-router-dom';
import CartSummary from './CartSummary';
import LoadingScreen from '../utility/LoadingScreen';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBagShopping, faX } from '@fortawesome/free-solid-svg-icons';

const CartItems = () => {
  const [cartItems, setCartItems] = useState([]);
  const [couponValue, setCouponValue] = useState('');
  const [couponResult, setCouponResult] = useState(null);
  const [showEmptyPromoCodeField, setShowEmptyPromoCodeField] = useState(false);
  const [showSuccessfulOrderMessage, setShowSuccessfulOrderMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const username = getUsernameFromToken();
    const jwtToken = localStorage.getItem('jwtToken');

    if (username && jwtToken) {
      fetch(`http://localhost:8080/cart/${username}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setCartItems(data);
        })
        .catch((error) => {
          console.error('Error fetching cart items:', error);
        });
    }
  }, []);

  const handleRemoveCoupon = () => {
    // Set couponResult to null
    setCouponResult(null);
    setCouponValue('');
  };
  
  const handleApplyCoupon = () => {
    const username = getUsernameFromToken();
    const jwtToken = localStorage.getItem('jwtToken');

    if (username && jwtToken) {
      if (couponValue.trim() === '') {
        // Handle the case when the input box is empty

        setShowEmptyPromoCodeField(true);

        setTimeout(() => {
          setShowEmptyPromoCodeField(false);
        }, 4000);

        return;
      }

      fetch(`http://localhost:8080/cart/coupon/${username}?couponCode=${couponValue}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setCouponResult(data); // Assuming the response has a property 'result' with the coupon result
        })
        .catch((error) => {
          console.error('Error applying coupon:', error);
        });
    }
  };

  const handlePlaceOrder = async () => {
    const username = getUsernameFromToken();
    const jwtToken = localStorage.getItem('jwtToken');

    if (username && jwtToken) {
      setIsLoading(true); // Set isLoading to false after handling errors

      let orderCreationUrl = `http://localhost:8080/orders/${username}`;

      // Check if a coupon value is provided
      if (couponValue.trim() !== '') {
        // Append the couponCode query parameter if a coupon value is present
        orderCreationUrl += `?couponCode=${couponValue}`;
      }

      // Make a POST request to create the order
      try {
        const response = await fetch(orderCreationUrl, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            'Content-Type': 'application/json', // Make sure to set the content type
          },
          body: JSON.stringify(cartItems), // Send the cart items as the request body
        });

        if (response.ok) {
          setIsLoading(true); // Set isLoading to true while processing the order

          setShowSuccessfulOrderMessage(true);

          setTimeout(() => {
            // Reload the page after the wait time
            setShowSuccessfulOrderMessage(false);
          }, 3000);

          setTimeout(() => {
            // Reload the page after the wait time
            window.location.reload();
          }, 1000);


        } else {
          const errorData = await response.json();
          setErrorMessage(errorData.message);
          // Handle non-success HTTP responses (e.g., 404 or 500 errors)

          setShowErrorMessage(true);

          setTimeout(() => {
            // Reload the page after the wait time
            setShowErrorMessage(false);
          }, 3000);

          console.error('Error creating order: HTTP error', errorData.message);
        }
      } catch (error) {
        console.error('Error creating order:', error);
      }
    }
    setIsLoading(false); // Set isLoading to false after handling errors
  };

  const handleDelete = (itemToDelete) => {
    // Implement delete logic here and update the cartItems state accordingly
  };

  const handleUpdate = (itemToUpdate) => {
    // Implement update logic here and update the cartItems state accordingly
  };

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart-message">
        <h1><FontAwesomeIcon icon={faBagShopping} size="1xl" className="empty-cart-bag" />Your cart is empty</h1>
        <p>Browse our vast selection of events to find your favourites!</p>
        <div className="center-button-container">
          <Link to="/events" className="white-button">
            Events page
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-items">
      {showEmptyPromoCodeField && (
        <div className="empty-promo-code-message">
          Coupon code is empty!
        </div>
      )}

      {showSuccessfulOrderMessage && (
        <div className="successful-order-message">
          Your order has been successful!
        </div>
      )}

      {showErrorMessage && (
        <div className="unsuccessful-order-message">
          {errorMessage}
        </div>
      )}

      <LoadingScreen isLoading={isLoading} />

      <div className="cart-page-heading">
        <h1>Shopping Cart</h1>
      </div>

      <div className="cart-header">
        <div className="header-image">Image</div>
        <div className="header-name">Event Name</div>
        <div className="header-location">Location</div>
        <div className="header-quantity">Ticket Quantity</div>
        <div className="header-single-price">Ticket Single Price</div>
        <div className="header-total-price">Ticket Total Price</div>
        <div className="header-actions">Actions</div>
      </div>

      {cartItems.map((item, index) => (
        <CartItem key={index} data={item} onDelete={handleDelete} onUpdate={handleUpdate} />
      ))}

      <CartSummary cartItems={cartItems} couponResult={couponResult} /> {/* Add this line for the cart summary */}


      <div className="promo-code-input">
        <input
          type="text"
          placeholder="Enter Promo Code"
          value={couponValue}
          onChange={(e) => setCouponValue(e.target.value)}
        />
        <button onClick={handleApplyCoupon}>Apply</button>
        {couponValue && (
          <FontAwesomeIcon icon={faX} className="remove-coupon-icon" onClick={handleRemoveCoupon} />
        )}
      </div>
      <button onClick={handlePlaceOrder} className="make-order-button">Place Order</button>
    </div>
  );
};

export default CartItems;
