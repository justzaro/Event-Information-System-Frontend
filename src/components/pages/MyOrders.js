import React, { useState, useEffect } from 'react';
import { getUsernameFromToken } from '../utility/AuthUtils';
import './MyOrders.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBagShopping,
  faCaretLeft,
  faBackwardStep,
} from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';


function MyOrders({history, location}) {
  const [orders, setOrders] = useState([]);
  const [isEmptyCart, setIsEmptyCart] = useState(false); // State to track an empty cart
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 6; // Number of orders to display per page
  const maxButtonsToShow = 4; // Maximum number of buttons to show between Next and Previous

  useEffect(() => {
    // Fetch user orders using the provided endpoint and JWT token
    const username = getUsernameFromToken();
    const jwtToken = localStorage.getItem('jwtToken');

    if (username && jwtToken) {
      fetch(`http://localhost:8080/orders/all/${username}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setOrders(data);
          setIsEmptyCart(data.length === 0);
        })
        .catch((error) => console.error('Error fetching orders:', error));
    }
  }, []);

  // Calculate the index range for the currently displayed orders
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const totalOrders = orders.length;
  const finalNumber = Math.ceil(totalOrders / ordersPerPage);
  
  // Change page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0); // Scroll to the top
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalOrders) {
      setCurrentPage(newPage);
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 0);
    }
  };

  const formatDate = (dateString) => {
    const parsedDate = moment(dateString, 'HH:mm:ss DD-MM-YYYY');
    const formattedDate = parsedDate.format('DD-MM-YYYY');
    return formattedDate;
  };

  if (isEmptyCart) {
    return (
      <div className="empty-my-orders-message">
        <h1>
          <FontAwesomeIcon icon={faBagShopping} size="1xl" className="empty-my-orders-bag" />You haven't made any orders yet
        </h1>
        <p>Browse our vast selection of events to find your favorites!</p>
        <Link to="/events" className="my-order-white-button">
          Events page
        </Link>
      </div>
    );
  }

  return (
    <div className="main-order-container">
      <div className="order-container">
        {currentOrders.map((order, index) => (
          <div key={index}>
            {index === 0 && (
              <div>
                <div className="order-heading">Orders</div>
                <hr className="my-orders-horizontal-line" />
              </div>
            )}
            <div className="order-details">
              {order.orderItems && order.orderItems.length > 0 && order.orderItems[0].tickets && order.orderItems[0].tickets.length > 0 && (
                <>
                  {/* Render order details */}
                  <a href={`/event/${order.orderItems[0].tickets[0].event.id}`}>
                    <img
                      className="my-order-event-image"
                      src={`http://localhost:8080/events/event-picture/${order.orderItems[0].tickets[0].event?.name || ''}`}
                      alt={order.orderItems[0].tickets[0].event?.name || ''}
                    />
                  </a>
                  <div className="order-info">
                    <p><span className="bold-text">Order ID:</span><span className="order-result-id">{order.id}</span></p>
                    <p><span className="bold-text">Concerts Booked:</span><span className="order-result-concerts-count">{order.orderItems.length}</span></p>
                    <p><span className="bold-text">Tickets Bought:</span><span className="order-result-tickets">{order.ticketsBought}</span></p>
                    <p><span className="bold-text">Total Price:</span><span className="order-result-total-price">{order.totalPrice.toFixed(2)} лв.</span></p>
                    <p><span className="bold-text">Date of Order:</span><span className="order-result-date">{formatDate(order.dateOfOrder)}</span></p>
                    <Link
                      to={{
                        pathname: `/order/${order.id}`
                      }}
                    >
                      <button className="order-details-button">Order details</button>
                    </Link>
                  </div>
                </>
              )}
            </div>
            {index < currentOrders.length - 1 && <hr className="my-orders-horizontal-line" />}
          </div>
        ))}

      </div>

      {/* Pagination controls */}
      
      {totalOrders > 1 && (
  <div className="pagination">
    <button
      onClick={() => paginate(1)}
      disabled={currentPage === 1}
      className={`pagination-button-first ${
        currentPage === 1 ? 'disabled' : ''
      }`}
    >
      <FontAwesomeIcon icon={faBackwardStep} />
    </button>
    <button
      onClick={() => paginate(currentPage - 1)}
      disabled={currentPage === 1}
      className={`pagination-button-previous ${
        currentPage === 1 ? 'disabled' : ''
      }`}
    >
      <FontAwesomeIcon icon={faCaretLeft} />
    </button>

    {/* Replace number buttons with page input */}
    <div className="page-input-container">
      Page
      <input
        type="number"
        min="1"
        max={totalOrders}
        value={currentPage}
        onChange={(e) => handlePageChange(parseInt(e.target.value, 10))}
      />
      of {finalNumber}
    </div>

    <button
      onClick={() => paginate(currentPage + 1)}
      disabled={currentPage === finalNumber}
      className={`pagination-button-next ${
        currentPage === finalNumber ? 'disabled' : ''
      }`}
    >
      <FontAwesomeIcon icon={faCaretLeft} rotation={180} />
    </button>
    <button
      onClick={() => paginate(finalNumber)}
      disabled={currentPage === finalNumber}
      className={`pagination-button-last ${
        currentPage === finalNumber ? 'disabled' : ''
      }`}
    >
      <FontAwesomeIcon icon={faBackwardStep} rotation={180} />
    </button>
  </div>
)}


    </div>
  );
}

export default MyOrders;
