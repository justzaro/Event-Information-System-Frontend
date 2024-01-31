import React, { useEffect, useState } from 'react';
import './ViewArtists.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faTimesCircle, faSort, faSearch, faBackwardStep, faCaretLeft } from '@fortawesome/free-solid-svg-icons';

const ViewArtists = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchType, setSearchType] = useState('name');
    const [sortedArtists, setSortedArtists] = useState([]);
    const [filteredArtists, setFilteredArtists] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [artistsPerPage] = useState(10);
    const [editArtist, setEditArtist] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [artistToDelete, setArtistToDelete] = useState(null);
    const [artistUpdatedMessage, setArtistUpdatedMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState(false);
    const [artistsDto, setArtistsDto] = useState({
        firstName: '',
        lastName: '',
        description: '',
      });
    const MAX_CHARACTERS = 90;
            
    const fetchArtists = () => {
        // Replace with your API call to fetch artists
        // Example:
        fetch('http://localhost:8080/artists')
            .then((response) => response.json())
            .then((data) => {
                setSortedArtists(data);
                setFilteredArtists(data);
            });
    };

    useEffect(() => {
        fetchArtists();
    }, []); // Run this effect only once on initial load

    // Function to filter artists
    const filterArtists = () => {
        const filtered = sortedArtists.filter((artist) => {
            const query = searchQuery.toLowerCase();
            const artistValue =
                searchType === 'name' ? (artist.firstName + ' ' + artist.lastName).toLowerCase() : artist.description?.toLowerCase() || '';

            return artistValue.includes(query);
        });

        setFilteredArtists(filtered);
    };

    // Call filterArtists whenever searchQuery or searchType changes
    useEffect(() => {
        filterArtists();
    }, [searchQuery, searchType]);

    const indexOfLastArtist = currentPage * artistsPerPage;
    const indexOfFirstArtist = indexOfLastArtist - artistsPerPage;
    const currentArtists = filteredArtists.slice(indexOfFirstArtist, indexOfLastArtist);

    const totalPages = Math.ceil(filteredArtists.length / artistsPerPage);

    const paginate = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const openEditModal = (artist) => {
        setEditArtist(artist);
        setArtistsDto({
            firstName: artist.firstName || '',
            lastName: artist.lastName || '',
            description: artist.description || ''
          });
    };

    function dataURItoBlob(dataURI) {
        const byteString = atob(dataURI.split(',')[1]);
        const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: mimeString });
      }

    const closeEditModal = () => {
        setEditArtist(null);
    };

    const updateArtist = () => {
        const jwtToken = localStorage.getItem('jwtToken');
        const formData = new FormData();

        formData.append('artistDto', new Blob([JSON.stringify(artistsDto)], { type: 'application/json' }));

        if (selectedImage) {
            formData.append('profilePicture', selectedImage);
        }
          
        console.log(selectedImage);

        fetch(`http://localhost:8080/artists/${editArtist.id}`, {
            method: 'PUT',
            body: formData,
            headers: {
            'Authorization': `Bearer ${jwtToken}`,
            },
        })
            .then((response) => {
            if (response.status === 200) {
                closeEditModal();
                fetchArtists();

                setArtistUpdatedMessage(true);

                setTimeout(() => {
                    setArtistUpdatedMessage(false);
                }, 4000);
            } else {
                response.json()
                    .then((errorData) => {
                        setErrorMessage(errorData.message);
                    })
                    .catch((error) => {
                        console.error('Error parsing the error response:', error);
                    });
            }
        });
        setSelectedImage(null);
        closeEditModal();
    };
    
    const handleFileSelection = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
        }
    };

    const openDeleteConfirmationModal = (artistId) => {
        setArtistToDelete(artistId);
        setShowConfirmationModal(true);
    };

    const closeConfirmationModal = () => {
        setArtistToDelete(null);
        setShowConfirmationModal(false);
    };

    const confirmDeleteArtist = () => {
        if (artistToDelete) {
            const jwtToken = localStorage.getItem('jwtToken');

            fetch(`http://localhost:8080/artists/${artistToDelete}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                },
            })
            .then((response) => {
                if (response.status === 204) {
                    setArtistUpdatedMessage(true);

                    setTimeout(() => {
                        setArtistUpdatedMessage(false);
                    }, 4000);

                    fetchArtists();
                } else {
                    response.json()
                        .then((errorData) => {
                            setErrorMessage(errorData.message);
                        })
                        .catch((error) => {
                            console.error('Error parsing the error response:', error);
                        });
                }
            });

            closeConfirmationModal();
        }
    };

    return (
        <div className="view-artists-container">

            {artistUpdatedMessage && (
                <div className="register-success-message">Artist updated successfully!</div>
            )}

            {errorMessage && (
                <div className="register-fail-message">{errorMessage}</div>
            )}

            <div className="manage-artists-search-bar">
                <FontAwesomeIcon icon={faSearch} className="manage-artists-search-bar-icon" />
                <input
                    type="text"
                    placeholder={`Search by ${searchType === 'name' ? 'Name' : 'Description'}`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <FontAwesomeIcon icon={faSort} className="manage-artists-search-bar-icon" />
                <select onChange={(e) => setSearchType(e.target.value)} value={searchType} className="manage-artists-select">
                    <option value="name">Name</option>
                    <option value="description">Description</option>
                </select>
            </div>

            <table className="view-artists-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentArtists.map((artist) => (
                        <tr key={artist.id}>
                            <td>{artist.id}</td>
                            <td>{artist.firstName} {artist.lastName}</td>
                            <td>
                                {artist.description.length > MAX_CHARACTERS
                                ? artist.description.substring(0, MAX_CHARACTERS) + "..."
                                : artist.description}
                            </td>
                            <td>
                                <FontAwesomeIcon
                                    icon={faCog}
                                    className="view-artists-action-icon view-artists-edit-icon"
                                    onClick={() => openEditModal(artist)}
                                /> 
                                <FontAwesomeIcon
                                    icon={faTimesCircle}
                                    className="view-artists-action-icon view-artists-delete-icon"
                                    onClick={() => openDeleteConfirmationModal(artist.id)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {editArtist && (
                <div className="edit-artist-modal">
                    <h2>Edit Artist</h2>
                    <input
                        type="text"
                        placeholder="First Name"
                        value={artistsDto.firstName}
                        onChange={(e) => {
                            setArtistsDto({
                            ...artistsDto,
                            firstName: e.target.value
                            });
                        }}
                    />
                    <input
                        type="text"
                        placeholder="Last Name"
                        value={artistsDto.lastName}
                        onChange={(e) => {
                            setArtistsDto({
                                ...artistsDto,
                                lastName: e.target.value
                            });
                        }}
                    />
                    <input
                        type="text"
                        placeholder="Description"
                        value={artistsDto.description}
                        onChange={(e) => {
                            setArtistsDto({
                                ...artistsDto,
                                description: e.target.value
                            });
                        }}
                    />
                    <div className="image-container">
                        <div className="image-wrapper">
                            {selectedImage ? (
                            <img src={URL.createObjectURL(selectedImage)} alt="Artist Profile" />
                            ) : (
                                <img src={`http://localhost:8080/artists/profile-picture/${editArtist.id}`} alt="Artist Profile" />
                            )}
                        </div>
                        <input type="file" onChange={handleFileSelection} accept="image/*" />
                    </div>
                    <div className="button-container">
                    <button onClick={updateArtist} className="edit-artist-modal-button save-artists-button">Save</button>
                    {selectedImage && (
                         <button onClick={() => setSelectedImage(null)} className="edit-artist-modal-button close-artists-button">Remove Image</button>
                     )}
                    <button onClick={closeEditModal} className="edit-artist-modal-button close-artists-button">Close</button>
                    </div>
                </div>
            )}

            {showConfirmationModal && (
                <div className="modify-artist-confirmation-modal">
                    <div className="modify-artist-confirmation-content">
                        <p>Are you sure you want to delete this artist?</p>
                        <div className="modify-artist-confirmation-buttons">
                            <button onClick={confirmDeleteArtist} className="modify-artist-confirmation-button yes-button">Yes</button>
                            <button onClick={closeConfirmationModal} className="modify-artist-confirmation-button no-button">No</button>
                        </div>
                    </div>
                </div>
            )}

            {totalPages > 1 && (
                <div className="manage-artists-pagination">
                    <button onClick={() => paginate(1)} disabled={currentPage === 1} className={`manage-artists-pagination-button-first ${currentPage === 1 ? 'disabled' : ''}`}>
                        <FontAwesomeIcon icon={faBackwardStep} />
                    </button>
                    <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`manage-artists-pagination-button-previous ${currentPage === 1 ? 'disabled' : ''}`}
                    >
                        <FontAwesomeIcon icon={faCaretLeft} />
                    </button>
                    <div className="manage-artists-page-input-container">
                        Page
                        <input
                            type="number"
                            min="1"
                            max={totalPages}
                            value={currentPage}
                            onChange={(e) => paginate(parseInt(e.target.value, 10))}
                        />
                        of {totalPages}
                    </div>
                    <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`manage-artists-pagination-button-next ${currentPage === totalPages ? 'disabled' : ''}`}
                    >
                        <FontAwesomeIcon icon={faCaretLeft} rotation={180} />
                    </button>
                    <button
                        onClick={() => paginate(totalPages)}
                        disabled={currentPage === totalPages}
                        className={`manage-artists-pagination-button-last ${currentPage === totalPages ? 'disabled' : ''}`}
                    >
                        <FontAwesomeIcon icon={faBackwardStep} rotation={180} />
                    </button>
                </div>
            )}

        </div>
    );
};

export default ViewArtists;
