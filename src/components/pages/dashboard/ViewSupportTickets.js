import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faEye, faSort, faMagnifyingGlass, faCaretLeft, faBackwardStep } from '@fortawesome/free-solid-svg-icons';
import './ViewSupportTickets.css'
import { getUsernameFromToken } from '../../utility/AuthUtils';
import LoadingScreen from '../../utility/LoadingScreen';

const ViewSupportTickets = () => {
  const [supportTickets, setSupportTickets] = useState([]);
  const [sortBy, setSortBy] = useState('Sort by Subject'); // Default sorting by subject
  const [searchText, setSearchText] = useState('');
  const [filteredSupportTickets, setFilteredSupportTickets] = useState([]);

  const [supportTicketDeletedMessage, setSupportTicketDeletedMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20); // Adjust the number of items per page as needed.
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSupportTickets.slice(indexOfFirstItem, indexOfLastItem);

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [supportTicketToDelete, setSupportTicketToDelete] = useState(null);

  const [showTicketDetails, setShowTicketDetails] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  // ... (other code)

  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');

  const [replySentSuccessfully, setReplySentSuccessfully] = useState(false);
  const [showPreviousReplies, setShowPreviousReplies] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleReply = () => {
    setIsReplying(!isReplying);
    setReplyText(''); // Clear the reply text when toggling
  };

  const handleReplyTextChange = (event) => {
    setReplyText(event.target.value);
  };

  const viewSupportTicket = (ticket) => {
    setSelectedTicket(ticket);
    setShowTicketDetails(true);
  };

  const handleDeleteConfirmation = (id) => {
    setShowDeleteConfirmation(true);
    setSupportTicketToDelete(id);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
    setSupportTicketToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (supportTicketToDelete) {
      deleteSupportTicket(supportTicketToDelete);
      setShowDeleteConfirmation(false);
    }
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const totalPages = Math.ceil(filteredSupportTickets.length / itemsPerPage);

  const fetchSupportTickets = () => {
    const jwtToken = localStorage.getItem('jwtToken');

    const apiUrl = 'http://localhost:8080/support-tickets';

    fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error fetching support tickets: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setSupportTickets(data);
        setFilteredSupportTickets(data);
      })
      .catch((error) => {
        console.error('Error fetching support tickets:', error);
      });
  };

  // const sendSupportTicketReply = () => {
  //   const jwtToken = localStorage.getItem('jwtToken');
  //   const username = getUsernameFromToken(jwtToken);
  
  //   const url = `http://localhost:8080/support-ticket-replies/${username}`;
  
  //   const dtoObject = {
  //     text: replyText,
  //     supportTicket: selectedTicket,
  //   };
  
  //   const headers = {
  //     'Authorization': `Bearer ${jwtToken}`,
  //     'Content-Type': 'application/json',
  //   };
  
  //   const body = JSON.stringify(dtoObject);

  //   fetch(url, {
  //     method: 'POST',
  //     headers: headers,
  //     body: body,
  //   })
  //     .then((response) => {
  //       if (response.ok) {
  //         setIsLoading(true);
  //         console.log(isLoading);
  //         setReplySentSuccessfully(true);

  //         setTimeout(() => {
  //           setReplySentSuccessfully(false);
  //         }, 4000);

  //         setIsLoading(false);
  //         fetchSupportTickets();
  //       } else {
  //         response.json().then((errorData) => {
  //           setErrorMessage(errorData.message || 'An error occurred while sending the reply!');
  //         });

  //         setTimeout(() => {
  //           setErrorMessage(false);
  //         }, 4000);

  //         setIsLoading(false);
  //         console.log(isLoading);

  //       }
  //     })
  //     .catch((error) => {
  //       console.error('An error occurred:', error);
  //       setIsLoading(false);
  //     });
  //     handleToggleReply();
  //     setShowTicketDetails(false);
  // };

  const sendSupportTicketReply = async () => {
    const jwtToken = localStorage.getItem('jwtToken');
    const username = getUsernameFromToken(jwtToken);
  
    const url = `http://localhost:8080/support-ticket-replies/${username}`;
  
    const dtoObject = {
      text: replyText,
      supportTicket: selectedTicket,
    };
  
    const headers = {
      'Authorization': `Bearer ${jwtToken}`,
      'Content-Type': 'application/json',
    };
  
    const body = JSON.stringify(dtoObject);
  
    try {
      setIsLoading(true); // Set isLoading to true before the fetch request
  
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: body,
      });
  
      if (response.ok) {
        setReplySentSuccessfully(true);
  
        setTimeout(() => {
          setReplySentSuccessfully(false);
        }, 4000);
  
        fetchSupportTickets();
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'An error occurred while sending the reply!');
  
        setTimeout(() => {
          setErrorMessage(false);
        }, 4000);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    } finally {
      setIsLoading(false); // Ensure that isLoading is set to false, even in case of an error
    }
  
    handleToggleReply();
    setShowTicketDetails(false);
  };
  

  useEffect(() => {
    fetchSupportTickets();
  }, []);

  const deleteSupportTicket = (id) => {
    const jwtToken = localStorage.getItem('jwtToken');

    const deleteUrl = `http://localhost:8080/support-tickets/${id}`;

    fetch(deleteUrl, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${jwtToken}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          setSupportTicketDeletedMessage(true);

          setTimeout(() => {
            setSupportTicketDeletedMessage(false);
          }, 4000);

          fetchSupportTickets();
        } else {
          setErrorMessage(true);

          setTimeout(() => {
            setErrorMessage(false);
          }, 4000);
        }
      })
      .catch((error) => {
        console.error('Network error while deleting support ticket:', error);
      });
  };

  const handleSortChange = (event) => {
    const searchBy = event.target.value;
    let placeholderText = '';

    if (searchBy === 'subject') {
      placeholderText = 'Search by Subject';
    } else if (searchBy === 'customerName') {
      placeholderText = 'Search by Name';
    } else if (searchBy === 'customerEmail') {
      placeholderText = 'Search by Email';
    } else if (searchBy === 'customerPhoneNumber') {
      placeholderText = 'Search by Phone Number';
    }

    setSortBy(placeholderText);
  };

  const handleSearchChange = (event) => {
    const searchText = event.target.value.toLowerCase();
    setSearchText(searchText);

    const updatedFilteredSupportTickets = supportTickets.filter((ticket) => {
      if (sortBy === 'customerName') {
        const combinedName = `${ticket.customerFirstName} ${ticket.customerLastName}`;
        return combinedName.toLowerCase().includes(searchText);
      } else {
        return ticket[sortBy] && ticket[sortBy].toLowerCase().includes(searchText);
      }
    });

    setFilteredSupportTickets(updatedFilteredSupportTickets);
  };

  return (
    <div>

      {supportTicketDeletedMessage && (
        <div className="register-success-message">Support ticket deleted successfully!</div>
      )}

      {replySentSuccessfully && (
        <div className="register-success-message">Reply message has been sent successfully!</div>
      )}

      {errorMessage && (
        <div className="register-fail-message">{errorMessage}</div>
      )}

      <div className="support-tickets-search-and-filter">
        <div className="support-tickets-search-bar-icon">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="view-coupons-search-bar-icon" />
        </div>
        <input
          type="text"
          className="support-tickets-input"
          placeholder={sortBy}
          value={searchText}
          onChange={handleSearchChange}
        />
        <div className="support-tickets-search-bar-icon">
          <FontAwesomeIcon icon={faSort} className="manage-users-search-bar-icon" />
        </div>
        <select className="support-tickets-select" value={sortBy} onChange={handleSortChange}>
          <option value="subject">Subject</option>
          <option value="customerName">Customer Name</option>
          <option value="customerEmail">Customer Email</option>
          <option value="customerPhoneNumber">Phone Number</option>
        </select>
      </div>
      <div className="support-ticket-page">
        <table className="support-ticket-table">
          <thead>
            <tr>
              <th className="support-ticket-header">#</th>
              <th className="support-ticket-header">Subject</th>
              <th className="support-ticket-header">Customer Name</th>
              <th className="support-ticket-header">Customer Email</th>
              <th className="support-ticket-header">Phone Number</th>
              <th className="support-ticket-header">Created At</th>
              <th className="support-ticket-header">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((ticket) => (
              <tr key={ticket.id}>
                <td className="support-ticket-data">{ticket.id}</td>
                <td className="support-ticket-data">{ticket.subject}</td>
                <td className="support-ticket-data">
                  {`${ticket.customerFirstName} ${ticket.customerLastName}`}
                </td>
                <td className="support-ticket-data">{ticket.customerEmail}</td>
                <td className="support-ticket-data">{ticket.customerPhoneNumber}</td>
                <td className="support-ticket-data">{ticket.createdAt}</td>
                <td className="support-ticket-data">
                  <div className="support-tickets-action-icons">
                    <div className="support-tickets-action-icon" onClick={() => viewSupportTicket(ticket)}>
                      <div className="support-tickets-icon-circle blue-circle">
                        <FontAwesomeIcon icon={faEye} className="support-tickets-icon" />
                      </div>
                    </div>
                    <div className="support-tickets-action-icon" onClick={() => handleDeleteConfirmation(ticket.id)}>
                      <div className="support-tickets-icon-circle red-circle">
                        <FontAwesomeIcon icon={faTimes} className="support-tickets-icon" />
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showDeleteConfirmation && (
        <div className="support-tickets-delete-confirmation-dialog">
          <div className="support-tickets-overlay"></div>
          <div className="support-tickets-dialog">
            <p>Are you sure you want to permanently delete this support ticket?</p>
            <div className="support-tickets-button-container">
              <button className="support-tickets-confirm-button" onClick={handleConfirmDelete} >Yes</button>
              <button className="support-tickets-cancel-button" onClick={handleCancelDelete} >No</button>
            </div>
          </div>
        </div>
      )}

      {totalPages > 1 && (
        <div className="support-tickets-pagination">
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className={`support-tickets-pagination-button-first ${currentPage === 1 ? 'disabled' : ''}`}
          >
            <FontAwesomeIcon icon={faBackwardStep} />
          </button>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`support-tickets-pagination-button-previous ${currentPage === 1 ? 'disabled' : ''}`}
          >
            <FontAwesomeIcon icon={faCaretLeft} />
          </button>
          <div className="page-input-container support-tickets">
            Page
            <input
              type="number"
              min="1"
              max={totalPages}
              value={currentPage}
              onChange={(e) => handlePageChange(parseInt(e.target.value, 10))}
            />
            of {totalPages}
          </div>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`support-tickets-pagination-button-next ${currentPage === totalPages ? 'disabled' : ''}`}
          >
            <FontAwesomeIcon icon={faCaretLeft} rotation={180} />
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className={`support-tickets-pagination-button-last ${currentPage === totalPages ? 'disabled' : ''}`}
          >
            <FontAwesomeIcon icon={faBackwardStep} rotation={180} />
          </button>
        </div>
      )}


      {showTicketDetails && selectedTicket && (
        <div className="support-tickets-ticket-details">
          <div className="support-tickets-details-overlay"></div>
          <div className="support-tickets-details-dialog">
            <h2>Support Ticket Details</h2>
            <div className="support-tickets-details-content">
              <div className="support-tickets-details-info">
                <p>
                  <strong>ID:</strong> {selectedTicket.id}
                </p>
                <p>
                  <strong>Subject:</strong> {selectedTicket.subject}
                </p>
                <p>
                  <strong>Customer Name:</strong> {`${selectedTicket.customerFirstName} ${selectedTicket.customerLastName}`}
                </p>
                <p>
                  <strong>Customer Email:</strong> {selectedTicket.customerEmail}
                </p>
                <p>
                  <strong>Customer Phone Number:</strong> {selectedTicket.customerPhoneNumber}
                </p>
                <p>
                  <strong>Created At:</strong> {selectedTicket.createdAt}
                </p>
              </div>
              <div className="support-tickets-details-description">
                <h3>Support Ticket Description</h3>
                <p>{selectedTicket.description}</p>
                {isReplying && (
                 <div className="support-tickets-reply-container">
                 <textarea
                    className="support-tickets-reply-textarea" // This class name should match your CSS class
                    value={replyText}
                    onChange={handleReplyTextChange}
                    placeholder="Type your reply here..."
                 /> 
                 <div className="support-tickets-buttons">
                   <button
                     className="support-tickets-reply-button"
                     onClick={() => {
                       // Handle sending the reply (you can implement this logic)
                       sendSupportTicketReply();
                     }}
                   >
                     Send
                   </button>
                   <LoadingScreen isLoading={isLoading} />
                   {selectedTicket.supportTicketReplies.length >= 1 && (
                      <button
                        className="support-tickets-reply-button"
                        onClick={() => setShowPreviousReplies(!showPreviousReplies)}
                      >
                          {showPreviousReplies ? "Close Previous Replies" : "View Previous Replies"}
                      </button>
                   )}
                   <button
                     className="support-tickets-reply-button"
                     onClick={handleToggleReply}
                   >
                     Cancel
                   </button>
                 </div>
               </div>
                )}
              </div>
            </div>
            <div className="support-tickets-reply-button-container">
              {!isReplying && (
                <button
                  className="support-tickets-reply-main-button"
                  onClick={handleToggleReply}
                >
                  Reply
                </button>
              )}
              <button
                className="support-tickets-close-details-button"
                onClick={() => setShowTicketDetails(false)}
              >
                Close
              </button>
            </div>
            
          </div>
          {showPreviousReplies && (
            <div className="support-tickets-previous-replies">
              {selectedTicket.supportTicketReplies.map((reply, index) => (
                <div key={index} className="support-tickets-previous-reply">
                  <hr className="support-tickets-reply-divider" />
                  <p className="support-tickets-reply-text">{reply.text}</p>
                  <p className="support-tickets-reply-info">
                    <span className="support-tickets-replier">Replier: {reply.replierUsername}</span>
                    <span className="support-tickets-created-at">
                      Replied At: {new Date(reply.createdAt).toLocaleString()}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default ViewSupportTickets;
