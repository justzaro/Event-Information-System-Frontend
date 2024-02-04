import React, { useState, useEffect } from 'react';
import './ProfileSettings.css';
import { getUsernameFromToken } from '../utility/AuthUtils';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { faEye as solidEye } from '@fortawesome/free-solid-svg-icons';
import { faEye as thinEye } from '@fortawesome/free-regular-svg-icons';

const ProfileSettings = () => {
    const [selectedImage, setSelectedImage] = useState(null);

    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showPasswordChangeSuccessMessage, setPasswordChangeSuccessMessage] = useState(false);
    const [showFailMessage, setShowFailMessage] = useState(false);
    const [showPasswordChangeFailMessage, setPasswordChangeFailMessage] = useState(false);
    const [showPasswordMatchingErrorMessage, setPasswordMatchingErrorMessage] = useState(false);
    
    const [errorMessage, setErrorMessage] = useState('');
    const [imageKey, setImageKey] = useState(0);
    const [showResetButton, setShowResetButton] = useState(false);

    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showOldConfirmedPassword, setShowOldConfirmedPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [confirmOldPassword, setConfirmOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showPasswordMatchIcon, setShowPasswordMatchIcon] = useState(false);

    const toggleOldPasswordVisibility = () => {
        setShowOldPassword(!showOldPassword);
    };

    const toggleOldConfirmedPasswordVisibility = () => {
        setShowOldConfirmedPassword(!showOldConfirmedPassword);
    };

    const toggleNewPasswordVisibility = () => {
        setShowNewPassword(!showNewPassword);
    };
    
    

    const handleChangePassword = () => {
        const username = getUsernameFromToken();
        const jwtToken = localStorage.getItem('jwtToken');
    
        if (oldPassword && confirmOldPassword && oldPassword === confirmOldPassword) {
            const passwordData = {
                oldPassword: oldPassword,
                confirmedOldPassword: confirmOldPassword,
                newPassword: newPassword,
            };
    
            axios
                .patch(`http://localhost:8080/users/password/${username}`, passwordData, {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                    },
                })
                .then((response) => {
                    if (response.status === 200) {
                        setPasswordChangeSuccessMessage(true);

                        setTimeout(() => {
                            setPasswordChangeSuccessMessage(false);
                        }, 4000);

                        setOldPassword('');
                        setConfirmOldPassword('');
                        setNewPassword('');
                    } else {
                        console.log('Password change request failed.');
                    }
                })
                .catch((error) => {
                    if (error.response && error.response.data && error.response.data.message) {
                        setErrorMessage(error.response.data.message);
                        setPasswordChangeFailMessage(true);
    
                        setTimeout(() => {
                            setPasswordChangeFailMessage(false);
                        }, 4000);
                    }
                });
        } else {
            setPasswordMatchingErrorMessage(true);

            setTimeout(() => {
                setPasswordMatchingErrorMessage(false);
            }, 4000);
         }
    };
    
    useEffect(() => {
        if (oldPassword && confirmOldPassword) {
            const passwordMatch = oldPassword === confirmOldPassword;
            setShowPasswordMatchIcon(passwordMatch);
        } else {
            setShowPasswordMatchIcon(false);
        }
    }, [oldPassword, confirmOldPassword]);

    const handleResetImage = () => {
        const jwtToken = localStorage.getItem('jwtToken');
        const username = getUsernameFromToken();

        const updatedData = {};

        axios
            .patch(`http://localhost:8080/users/profile-picture/default/${username}`, updatedData, {
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                },
            })
            .then((response) => {
                if (response.status === 200) {
                    reloadImage();
                    setShowSuccessMessage(true);

                    setTimeout(() => {
                        setShowSuccessMessage(false);
                    }, 4000);
                } else {
                    console.log("Reset image request failed");
                }
            })
            .catch((error) => {
                console.error('Error resetting profile image:', error);
            });
    };


    const reloadImage = () => {
        setImageKey((prevKey) => prevKey + 1);
    };


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setSelectedImage(file);
    };

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        day: '',
        month: '',
        year: '',
        address: '',
        creditCardNumber: '',
        creditCardCvv: ''
    });

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    function parseDate(dateString) {
        const parts = dateString.split('-');
        if (parts.length === 3) {
            const day = parts[0].trim();
            const monthNumber = parts[1].trim();
            const year = parts[2].trim();

            const months = [
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December',
            ];
            const month = months[parseInt(monthNumber) - 1];

            return { day, month, year };
        }
        return { day: '', month: '', year: '' };
    }

    const fetchUserData = () => {
        const jwtToken = localStorage.getItem('jwtToken'); 

        fetch(`http://localhost:8080/users/${getUsernameFromToken()}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${jwtToken}`,
            },
        })
            .then((response) => response.json())
            .then((userData) => {
                const parsedDate = parseDate(userData.dateOfBirth || '');
                console.log(userData);
                setFormData({
                    firstName: userData.firstName || '',
                    lastName: userData.lastName || '',
                    username: userData.username || '',
                    email: userData.email || '',
                    day: parsedDate.day,
                    month: parsedDate.month,
                    year: parsedDate.year,
                    address: userData.address || '',
                    creditCardNumber: userData.creditCardNumber || '',
                    creditCardCvv: userData.creditCardCvv || ''
                });
                console.log(formData);
            })
            .catch((error) => {
                console.error('Error fetching user data:', error);
            });
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleUpdate = () => {
        const monthNumber = months.findIndex((month) => month === formData.month) + 1;

        const formattedMonth = monthNumber < 10 ? `0${monthNumber}` : `${monthNumber}`;

        const formattedDate = `${formData.day}-${formattedMonth}-${formData.year}`;

        const updatedData = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            username: formData.username,
            email: formData.email,
            dateOfBirth: formattedDate,
            address: formData.address,
            creditCardNumber: formData.creditCardNumber,
            creditCardCvv: formData.creditCardCvv
        };

        const fullFormData = new FormData();

        fullFormData.append('userUpdateDto', new Blob([JSON.stringify(updatedData)], { type: 'application/json' }));

        fullFormData.append('profilePicture', selectedImage);

        axios
            .put(`http://localhost:8080/users/${getUsernameFromToken()}`, fullFormData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then((response) => {
                if (response.status === 200) {
                    reloadImage();
                    fetchUserData();

                    setShowSuccessMessage(true);

                    setTimeout(() => {
                        setShowSuccessMessage(false);
                    }, 4000);

                    const fileInput = document.getElementById('profileImage');
                    if (fileInput) {
                        fileInput.value = '';
                    }
                } else {
                    console.log("else");
                }
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.message) {
                    setErrorMessage(error.response.data.message);
                    setShowFailMessage(true);

                    setTimeout(() => {
                        setShowFailMessage(false);
                    }, 4000);
                }
            });
    };

    return (
        <div className="profile-settings-custom">
            <div className="profile-settings">

                {showSuccessMessage && (
                    <div className="success-message">You updated your profile successfully!</div>
                )}
                {showFailMessage && (
                    <div className="fail-message">{errorMessage}</div>
                )}

                {showPasswordChangeSuccessMessage && (
                    <div className="success-message">Password changed successfully!</div>
                )}
                {showPasswordChangeFailMessage && (
                    <div className="fail-message">{errorMessage}</div>
                )}

                {showPasswordMatchingErrorMessage && (
                    <div className="fail-message">Old password and confirm old password fields do not match!</div>
                )}

                <h1>Profile Settings</h1>
                <hr />

                <div className="profile-settings-input-container">
                    <div className="profile-settings-left">
                        <div className="form-group">
                            <label htmlFor="firstName">First Name:</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="lastName">Last Name:</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="username">Username:</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="creditCardNumber">Credit card number:</label>
                            <input
                                type="text"
                                id="creditCardNumber"
                                name="creditCardNumber"
                                value={formData.creditCardNumber}
                                onChange={handleChange}
                                required
                            />
                        </div>

                    </div>

                    <div className="profile-settings-right">
                        <div className="form-group">
                            <label>Date of Birth:</label>
                            <div className="date-of-birth">
                                <select
                                    name="day"
                                    value={formData.day || 1}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Day</option>
                                    {Array.from({ length: 31 }, (_, i) => (
                                        <option key={i + 1} value={i + 1}>
                                            {i + 1}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    name="month"
                                    value={formData.month}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Month</option>
                                    {months.map((month, index) => (
                                        <option key={index} value={month}>
                                            {month}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    name="year"
                                    value={formData.year}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Year</option>
                                    {Array.from({ length: 151 }, (_, i) => (
                                        <option key={i + 1900} value={i + 1900}>
                                            {i + 1900}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email:</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="address">Address:</label>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="creditCardCvv">CVV:</label>
                                <input
                                    type="text"
                                    id="creditCardCvv"
                                    name="creditCardCvv"
                                    value={formData.creditCardCvv}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <hr className="profile-settings-divider" />

                <div className="profile-image-container">
                    <div className="profile-image">
                        <img
                            key={imageKey}
                            src={`http://localhost:8080/users/profile-picture/${getUsernameFromToken()}`}
                            alt="Profile"
                            onMouseEnter={() => setShowResetButton(true)}
                            onMouseLeave={() => setShowResetButton(false)}
                        />
                        <div
                            className="reset-image-button"
                            onClick={handleResetImage}
                        >
                            Reset to Default Image
                        </div>

                    </div>

                    <div className="profile-image-upload-container">
                        <div className="profile-image-upload form-group">
                            <label htmlFor="profileImage">Upload Profile Picture:</label>
                            <input
                                type="file"
                                id="profileImage"
                                name="profileImage"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </div>
                    </div>
                </div>
                <hr ></hr>
                <div className="profile-buttons">
                    <button className="update-button" onClick={handleUpdate}>Update</button>
                    <button className="delete-button">Delete Account</button>
                </div>

            </div>
            
            <div className="change-password-section">
                <h2>Change Password</h2>
                <hr></hr>
                <div className="form-group">
                    <label htmlFor="oldPassword">Old Password:</label>
                    <div className="old-password-input-container">
                        <input
                        type={showOldPassword ? 'text' : 'password'}
                        id="oldPassword"
                        name="oldPassword"
                        value={oldPassword}
                        className="form-control"
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                        />
                        <FontAwesomeIcon
                        icon={showOldPassword ? solidEye : thinEye}
                        className="old-password-eye-icon"
                        onClick={toggleOldPasswordVisibility}
                        />
                        {showPasswordMatchIcon && (
                        <FontAwesomeIcon icon={faCheck} className="password-match-icon" />
                    )}
                    </div>
                    
                </div>
                <div className="form-group">
                    <label htmlFor="confirmOldPassword">Confirm Old Password:</label>
                    <div className="old-confirmed-password-input-container">
                        <input
                            type={showOldConfirmedPassword ? 'text' : 'password'} // Toggle input type based on showPassword state
                            id="confirmOldPassword"
                            name="confirmOldPassword"
                            value={confirmOldPassword}
                            onChange={(e) => {
                                setConfirmOldPassword(e.target.value);
                            }}
                            required
                        />
                        <FontAwesomeIcon
                            icon={showOldConfirmedPassword ? solidEye : thinEye} // Use solid or thin version based on showPassword
                            className="old-confirmed-password-eye-icon"
                            onClick={toggleOldConfirmedPasswordVisibility}
                        />
                        {showPasswordMatchIcon && (
                            <FontAwesomeIcon icon={faCheck} className="password-match-icon" />
                        )}
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="newPassword">New Password:</label>
                        <div className="new-password-input-container">
                            <input
                                type={showNewPassword ? 'text' : 'password'} // Toggle input type based on showPassword state
                                id="newPassword"
                                name="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                disabled={!oldPassword || !confirmOldPassword || !showPasswordMatchIcon}
                            />
                            {!(!oldPassword || !confirmOldPassword || !showPasswordMatchIcon) && (
                                <FontAwesomeIcon
                                    icon={showNewPassword ? solidEye : thinEye} // Use solid or thin version based on showPassword
                                    className="new-password-eye-icon"
                                    onClick={toggleNewPasswordVisibility}
                                />
                            )}
                        </div>
                </div>
                <hr></hr>
                <div className="profile-buttons">
                    <button className="change-password-button" onClick={handleChangePassword}>Change Password</button>
                </div>
            </div>                             

        </div>
    );
};

export default ProfileSettings;
