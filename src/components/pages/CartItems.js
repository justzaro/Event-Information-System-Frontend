// CartItems.js
import React, { useEffect, useState } from 'react';
import { getUsernameFromToken } from '../utility/AuthUtils';
import CartItem from './CartItem';
import './CartItems.css';
import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBagShopping } from '@fortawesome/free-solid-svg-icons';

const CartItems = () => {
  const [cartItems, setCartItems] = useState([]);
  const [couponValue, setCouponValue] = useState('');
  const [couponResult, setCouponResult] = useState(null);
  const [showEmptyPromoCodeField, setShowEmptyPromoCodeField] = useState(false);
  const [showSuccessfulOrderMessage, setShowSuccessfulOrderMessage] = useState(false);

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

      let orderCreationUrl = `http://localhost:8080/orders/create/${username}`;

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
            // Check if the response contains JSON data before parsing
            // if (contentType && contentType.includes('application/json')) {
            //   const data = await response.json();
            //   // Handle the response from the order creation, e.g., show a success message
            //   console.log('Order created:', data);
            // } else {
            //   // Handle the case where the response is not JSON (e.g., empty response)
            //   console.error('Error creating order: Invalid or empty response');
            // }
        
            

        // Wait for a few seconds (e.g., 3 seconds) before showing the success message
        
        setShowSuccessfulOrderMessage(true);
        
        setTimeout(() => {
          // Reload the page after the wait time
          setShowSuccessfulOrderMessage(false);
        }, 3000);    

        setTimeout(() => {
          // Reload the page after the wait time
          window.location.reload();
        }, 1000);

        // Wait for a few more seconds (e.g., 4 seconds) before showing the success message
        
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
