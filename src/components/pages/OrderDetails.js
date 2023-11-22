// OrderDetails.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './OrderDetails.css';
import moment from 'moment';

function OrderDetails() {
    const { orderId } = useParams();
    const [orderDetails, setOrderDetails] = useState(null);
    const [orderDate, setOrderDate] = useState(null);
    const [totalPrice, setTotalPrice] = useState(null);
    const [originalPrice, setOriginalPrice] = useState(null);
    const [couponDiscountValue, setCouponDiscountValue] = useState(null);
    const [couponCode, setCouponCode] = useState(null);

    useEffect(() => {
        const jwtToken = localStorage.getItem('jwtToken');

        if (jwtToken) {
            fetch(`http://localhost:8080/orders/${orderId}`, {
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    setOrderDetails(data);
                    setOrderDate(data.dateOfOrder);
                    setTotalPrice(data.totalPrice);
                    setOriginalPrice(data.originalPrice);
                    setCouponDiscountValue(data.originalPrice - data.totalPrice);
                    setCouponCode(data.couponCode);
                })
                .catch((error) => console.error('Error fetching order details:', error));
        }
    }, [orderId]);

    const formatDate = (dateString) => {
        const parsedDate = moment(dateString, 'HH:mm:ss DD-MM-YYYY');
        const formattedDate = parsedDate.format('DD-MM-YYYY');
        return formattedDate;
      };

    if (!orderDetails) {
        // Render loading or error message
        return <div className="order-details-loading">Loading...</div>;
    }

    return (
        <div className="main-order-details-container">

            <div className="order-details-additional-information">
                <h1 className="order-heading">Details about order: {orderId}</h1>
                <hr className="additional-order-details-horizontal-line" />
                <div className="order-details-additional-information-content">
                    <p>
                    <span className="order-details-bold-text">Ordered on:</span>{' '}
                    <span className="order-details-created-at">{formatDate(orderDate)}</span>
                    </p>
                </div>
            </div>

            <div className="order-details-container">
                {orderDetails.orderItems.map((orderItem, index) => (
                    <div key={index}>  { /* className="order-details-content" */}
                        {index === 0 && (
                            <div>
                                <div className="order-heading">Order Items</div>
                                <hr className="order-details-horizontal-line" />
                            </div>
                        )}
                        <div className="order-details-content">
                            <a href={`/event/${orderItem.tickets[0].event.id}`}>
                                <img
                                    src={`http://localhost:8080/events/event-picture/${orderItem.tickets[0].event.id || ''}`}
                                    alt={orderItem.tickets[0].event.name}
                                    className="order-details-image"
                                />
                            </a>
                            <div className="order-details-info">
                                <p>
                                    <span className="order-details-bold-text">Event Name:</span>{' '}
                                    <span className="order-details-event-name">{orderItem.tickets[0].event.name}</span>
                                </p>
                                <p>
                                    <span className="order-details-bold-text">Location:</span>{' '}
                                    <span className="order-details-event-location">{orderItem.tickets[0].event.location}</span>
                                </p>
                                <p>
                                    <span className="order-details-bold-text">Start Date:</span>{' '}
                                    <span className="order-details-event-start-date">{orderItem.tickets[0].event.startDate}</span>
                                </p>
                                <p>
                                    <span className="order-details-bold-text">End Date:</span>{' '}
                                    <span className="order-details-event-end-date">{orderItem.tickets[0].event.endDate}</span>
                                </p>
                                <p>
                                    <span className="order-details-bold-text">Artists:</span>{' '}
                                    <span className="order-details-event-artists">{orderItem.tickets[0].event.artists.map((artist) => artist.firstName).join(', ')}</span>
                                </p>
                                <p>
                                    <span className="order-details-bold-text">Tickets Bought:</span>{' '}
                                    <span className="order-details-event-tickets">{orderItem.tickets.length}</span>
                                </p>
                                <p>
                                    <span className="order-details-bold-text">Single Ticket Price:</span>{' '}
                                    <span className="order-details-event-ticket-price">{(orderItem.tickets[0].event.ticketPrice).toFixed(2)} лв.</span>
                                </p>
                                <p>
                                    <span className="order-details-bold-text">Total Price:</span>{' '}
                                    <span className="order-details-event-total-price">{(orderItem.tickets.length * orderItem.tickets[0].event.ticketPrice).toFixed(2)} лв.</span>
                                </p>
                            </div>
                        </div>
                        {/* {index < orderDetails.orderItems.length - 1 && <hr className="order-details-horizontal-line" />} */}
                        <hr className="order-details-horizontal-line" />

                        

                    </div>
                ))}
                <h1 className="payment-heading">Order value</h1>
                <p>
                    <span className="order-total-price">Items Value: </span>
                    <span className="order-total-price-value">{originalPrice.toFixed(2)} лв.</span>
                </p>
                <p>
                    <span className="order-coupon-code-discount">Coupon Discount: </span>
                    <span className="order-coupon-code-discount-value">{couponDiscountValue.toFixed(2)} лв.</span>
                </p>
                <p>
                    <span className="order-coupon-code">Coupon Code: </span>
                    <span className="order-coupon-code-value">
                        {couponCode !== null ? couponCode : 'NONE'}
                    </span>
                </p>
                <div className="amount-to-pay-section">
                    <p>
                        <span className="order-amount-to-pay">Amount to pay: </span>
                        <span className="order-amount-to-pay-value">{totalPrice.toFixed(2)} лв.</span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default OrderDetails;
