import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle, 
  faBackwardStep,
   faCaretLeft,
    faFilter,
     faMagnifyingGlass, 
     faSort} from '@fortawesome/free-solid-svg-icons';
import './ViewCoupons.css';

function CouponPage() {
  const [coupons, setCoupons] = useState([]);
  const [showCouponDeletedMessage, setShowCouponDeletedMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [deleteCouponId, setDeleteCouponId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [couponsPerPage] = useState(15);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterIsUsed, setFilterIsUsed] = useState('all');

  const [searchDiscountPercentage, setSearchDiscountPercentage] = useState('');

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
    setDeleteCouponId(couponId); 
  };

  const handleConfirmDelete = () => {
    if (deleteCouponId) {
      const jwtToken = localStorage.getItem('jwtToken');

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

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const filterAndSearchCoupons = () => {
    const filteredCoupons = filterIsUsed === 'all' ? coupons : coupons.filter(coupon => coupon.isUsed === (filterIsUsed === 'used'));

    return filteredCoupons.filter(coupon => {
      const isCouponCodeMatch = coupon.couponCode.toLowerCase().includes(searchQuery.toLowerCase());
      const isDiscountPercentageMatch = searchDiscountPercentage !== '' && coupon.discountPercentage.toString().includes(searchDiscountPercentage);

      if (searchQuery && searchDiscountPercentage !== '') {
        return isCouponCodeMatch && isDiscountPercentageMatch;
      } else if (searchQuery) {
        return isCouponCodeMatch;
      } else if (searchDiscountPercentage !== '') {
        return isDiscountPercentageMatch;
      } else {
        return true;
      }
    });
  };

  const filteredAndSearchedCoupons = filterAndSearchCoupons();
  const totalPages = Math.ceil(filteredAndSearchedCoupons.length / couponsPerPage);

  const indexOfLastCoupon = currentPage * couponsPerPage;
const indexOfFirstCoupon = indexOfLastCoupon - couponsPerPage;
const currentCoupons = filteredAndSearchedCoupons.slice(indexOfFirstCoupon, indexOfLastCoupon);

  const pageNumbers = [];
for (let i = 1; i <= totalPages; i++) {
  pageNumbers.push(i);
}
  return (
    <div>
      <div className="view-coupons-search-bar">
        <FontAwesomeIcon icon={faMagnifyingGlass} className="view-coupons-search-bar-icon" />
        <input
          type="text"
          placeholder="Search by Coupon Code"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <FontAwesomeIcon icon={faSort} className="view-coupons-search-bar-icon" />
        <select onChange={(e) => setFilterIsUsed(e.target.value)} value={filterIsUsed} className="view-coupons-select">
          <option value="all">All</option>
          <option value="unused">Unused</option>
          <option value="used">Used</option>
        </select>
        <FontAwesomeIcon icon={faFilter} className="view-coupons-search-bar-icon" />
        <input
          type="number"
          placeholder="Coupon Discount %"
          value={searchDiscountPercentage}
          onChange={(e) => setSearchDiscountPercentage(e.target.value)}
        />
      </div>

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
            {currentCoupons.map((coupon, index) => (
              <tr key={coupon.couponId}>
                <td className="view-coupons-data">{coupon.couponId}</td>
                <td className="view-coupons-data">{coupon.couponCode}</td>
                <td className="view-coupons-data">{coupon.discountPercentage}%</td>
                <td className="view-coupons-data">{coupon.createdAt}</td>
                <td className="view-coupons-data">{coupon.expiresAt}</td>
                <td className={`view-coupons-data view-coupons-status ${coupon.isUsed ? 'orange-text' : 'green-text'}`}>
                  {coupon.isUsed ? 'Used' : 'Unused'}
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

      {totalPages > 1 && (
          <div className="view-coupons-pagination">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className={`view-coupons-pagination-button-first ${currentPage === 1 ? 'disabled' : ''}`}
            >
              <FontAwesomeIcon icon={faBackwardStep} />
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`view-coupons-pagination-button-previous ${currentPage === 1 ? 'disabled' : ''}`}
            >
              <FontAwesomeIcon icon={faCaretLeft} />
            </button>
            <div className="page-input-container view-coupons">
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
              className={`view-coupons-pagination-button-next ${currentPage === totalPages ? 'disabled' : ''}`}
            >
              <FontAwesomeIcon icon={faCaretLeft} rotation={180} />
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className={`view-coupons-pagination-button-last ${currentPage === totalPages ? 'disabled' : ''}`}
            >
              <FontAwesomeIcon icon={faBackwardStep} rotation={180} />
            </button>
          </div>
        )}

    </div>
  );
}

export default CouponPage;
