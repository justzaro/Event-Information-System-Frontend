// CartItems.js
import React, { useEffect, useState } from 'react';
import { getUsernameFromToken } from '../utility/AuthUtils';
import CartItem from './CartItem';
import './CartItems.css';
import { Link, useNavigate } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBagShopping } from '@fortawesome/free-solid-svg-icons';

const CartItems = () => {
  const [cartItems, setCartItems] = useState([]);
  const [couponValue, setCouponValue] = useState('');
  const [couponResult, setCouponResult] = useState(null); 
  const navigate = useNavigate();
  const [showEmptyPromoCodeField, setShowEmptyPromoCodeField] = useState(false);

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
          setCartItems(data);
        })
        .catch((error) => {
          console.error('Error fetching cart items:', error);
        });
    }
  }, []);

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
        // Make a POST request to create the order
        try {
          const response = await fetch(`http://localhost:8080/orders/create/${username}`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${jwtToken}`,
              'Content-Type': 'application/json', // Make sure to set the content type
            },
            body: JSON.stringify(cartItems), // Send the cart items as the request body
          });
    
          if (response.ok) {
            // Check if the response contains JSON data before parsing
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
              const data = await response.json();
              // Handle the response from the order creation, e.g., show a success message
              console.log('Order created:', data);
            } else {
              // Handle the case where the response is not JSON (e.g., empty response)
              console.error('Error creating order: Invalid or empty response');
            }
          } else {
            const errorData = await response.json();
            const errorMessage = errorData.message;
            // Handle non-success HTTP responses (e.g., 404 or 500 errors)
            console.error('Error creating order: HTTP error', errorMessage);
          }
        } catch (error) {
          console.error('Error creating order:', error);
        }
      }
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
        <Link to="/" className="white-button">
          Home page
        </Link>
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
      <div className="promo-code-input">
        <input
          type="text"
          placeholder="Enter Promo Code"
          value={couponValue}
          onChange={(e) => setCouponValue(e.target.value)}
        />
        <button onClick={handleApplyCoupon}>Apply</button>
      </div>
      {couponResult !== null && (
        <div className="coupon-result">
          Coupon Result: {couponResult.toFixed(2)}
        </div>
      )}
      <button onClick={handlePlaceOrder} className="make-order-button">Place Order</button>
    </div>
  );
};

export default CartItems;
