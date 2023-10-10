import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PostsPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { getUsernameFromToken } from '../utility/AuthUtils';

function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const currentUser = getUsernameFromToken();

  const [addingPost, setAddingPost] = useState(false); // Track if the "Add Post" popup is open
  const [postDescription, setPostDescription] = useState('');
  const [postLocation, setPostLocation] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  const [showPostAddedSuccessfullyMessage, setShowPostAddedSuccessfullyMessage] = useState(false);
  const [showFailAddingPostMessage, setShowFailAddingPostMessage] = useState(false);
  const [showPostDeletedSuccessfullyMessage, setPostDeletedSuccessfullyMessage] = useState(false);
  const [showPostDeletingImageMessage, setPostDeletingImageMessage] = useState(false);
  const [showCommentAddedSuccessfully, setCommentAddedSuccessfully] = useState(false);
  const [showFailAddingComment, setFailAddingComment] = useState(false);
  const [showCommentBodyIsEmptyMessage, setCommentBodyIsEmptyMessage] = useState(false);
  const [showNoPostImageIsAttached, setNoPostImageIsAttached] = useState(false);
  const [showCommentDeletedSuccessfully, setCommentDeletedSuccessfully] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [commentInput] = useState('');
  const [commentTexts, setCommentTexts] = useState({});

  const handleAddComment = (postId) => {
    const commentText = commentTexts[postId];
    console.log("comment text - " + commentText);
    // Create a JSON object with the comment body
    const commentData = {
      commentBody: commentText,
    };

    console.log("comment data :" + {commentData});

    axios
      .post(`http://localhost:8080/comments/${getUsernameFromToken()}/${postId}`, commentData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        // Handle successful comment submission
        // You may want to refresh the comments for the specific post here
        // Clear the comment input field
        fetchPosts();
        setCommentTexts((prevCommentTexts) => ({
          ...prevCommentTexts,
          [postId]: '',
        }));

        setCommentAddedSuccessfully(true);

        setTimeout(() => {
          setCommentAddedSuccessfully(false);
        }, 4000);
      })

      .catch((error) => {
        setCommentTexts((prevCommentTexts) => ({
          ...prevCommentTexts,
          [postId]: '',
        }));
        
        if (!commentInput) {
          // Handle error for null comment input
          // For example, you can show an error message or take appropriate action
          setCommentBodyIsEmptyMessage(true);
  
          setTimeout(() => {
            setCommentBodyIsEmptyMessage(false);
          }, 4000);
        } else {
          setFailAddingComment(true);
  
          setTimeout(() => {
            setFailAddingComment(false);
          }, 4000);
          // Handle other errors if needed
        }
        // Handle error if needed
      });
  };

  const handleDeleteComment = (commentId) => {
    // Send a request to delete the comment with commentId
    axios
      .delete(`http://localhost:8080/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
        },
      })
      .then(() => {
        
        setCommentDeletedSuccessfully(true);
  
        setTimeout(() => {
          setCommentDeletedSuccessfully(false);
        }, 4000);

        fetchPosts();
      })
      .catch((error) => {
        // Handle errors if needed
        console.error(error);
      });
  };
  

  const handleDeletePost = (postId) => {
    setPostToDelete(postId);
    setShowDeleteConfirmation(true);
  };

  const fetchPosts = () => {
    axios
      .get('http://localhost:8080/posts', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
        },
      })
      .then((response) => {
        setPosts(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    // Fetch posts data when the component mounts
    fetchPosts();
    // Refresh and fetch posts every minute
    const refreshInterval = setInterval(fetchPosts, 60000); // 60000 milliseconds = 1 minute

    // Clear the interval when the component unmounts
    return () => clearInterval(refreshInterval);
  }, []);

  const toggleComments = (post) => {
    if (selectedPost === post) {
      setSelectedPost(null);
    } else {
      setSelectedPost(post);
    }
  };
  
const calculateTimeDifference = (postedAt) => {
    const currentDate = new Date();
    const [time, date] = postedAt.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    const [day, month, year] = date.split('-').map(Number);
  
    if (!isNaN(hours) && !isNaN(minutes) && !isNaN(day) && !isNaN(month) && !isNaN(year)) {
      // Create a Date object for the post's date and time
      const postDate = new Date(year, month - 1, day, hours, minutes); // Months are zero-based (0-11)
  
      // Calculate the time difference in milliseconds
      const timeDifference = currentDate - postDate;
  
      // Calculate days, hours, and minutes
      const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      const hoursDifference = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutesDifference = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
  
      if (daysDifference > 0) {
        // Display days if difference is greater than 0
        return `${daysDifference}d`;
      } else if (hoursDifference > 0) {
        // Display hours if difference is greater than 0
        return `${hoursDifference}h`;
      } else if (minutesDifference > 0) {
        // Display minutes if difference is greater than 0
        return `${minutesDifference}m`;
      } else {
        // Display seconds if no significant difference
        return 'Just now';
      }
    }
  
    // Handle invalid date or time format
    return 'Invalid Date or Time Format';
  };
  
  const handleCommentInputChange = (postId, text) => {
    setCommentTexts((prevCommentTexts) => ({
      ...prevCommentTexts,
      [postId]: text,
    }));
  };
  
  const handleAddPostClick = () => {
    // Open the "Add Post" popup
    setAddingPost(true);
  };

  const handlePostAdded = () => {
    // Close the "Add Post" popup and clear form data
    setAddingPost(false);
    setPostDescription('');
    setPostLocation('');
    setSelectedImage(null);

    // Fetch the updated posts after adding a new post
    axios
      .get('http://localhost:8080/posts', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
        },
      })
      .then((response) => {
        setPosts(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleImageChange = (e) => {
    // Handle file input change and store the selected image
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  const handleUploadClick = () => {
    // Create a FormData object to send the multipart request

    if (!selectedImage) {
      // Handle the case where no image is attached
      setNoPostImageIsAttached(true);

      setTimeout(() => {
        setNoPostImageIsAttached(false);
      }, 4000);

      return; // Prevent further execution of the function
    }

    const formData = new FormData();
  
    const postDto = {
      description: postDescription || "", // Set to an empty string if null
      location: postLocation || "",       // Set to an empty string if null
    };
    
    // Create a Blob containing the JSON data
    const postDtoBlob = new Blob([JSON.stringify(postDto)], {
      type: 'application/json',
    });
    
    // Append the Blob to the FormData
    formData.append('postDto', postDtoBlob);
  
    // Append the image file to the FormData
    formData.append('postPicture', selectedImage);
  
    axios
      .post(`http://localhost:8080/posts/add/${getUsernameFromToken()}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setShowPostAddedSuccessfullyMessage(true);

          setTimeout(() => {
            setShowPostAddedSuccessfullyMessage(false);
          }, 4000);
        } else {
          setShowFailAddingPostMessage(true);

          setTimeout(() => {
            setShowFailAddingPostMessage(false);
          }, 4000);
        }
        handlePostAdded();
      })
      .catch((error) => {
        console.error(error);
        // Handle error if needed
      });
  };
  
  const confirmDelete = () => {
    // Send a request to delete the post with postToDelete as the post ID
    axios
      .delete(`http://localhost:8080/posts/self/${postToDelete}/${currentUser}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
        },
      })
      .then(() => {
        // Handle successful deletion, e.g., remove the post from the UI
        // and close the delete confirmation dialog
          
        setPostDeletedSuccessfullyMessage(true);

        setTimeout(() => {
          setPostDeletedSuccessfullyMessage(false);
        }, 4000);

        const updatedPosts = posts.filter((post) => post.postId !== postToDelete);
        setPosts(updatedPosts);
        setPostToDelete(null);
        setShowDeleteConfirmation(false);
      })
      .catch((error) => {
        setPostDeletingImageMessage(true);

        setTimeout(() => {
          setPostDeletingImageMessage(false);
        }, 4000);
      });

  };

  const cancelDelete = () => {
    // Clear the postToDelete and close the delete confirmation dialog
    setPostToDelete(null);
    setShowDeleteConfirmation(false);
  };
  
  return (
    <div className="posts-container">
        {selectedPost && (
          <div className="blur-background"></div>
        )}
        {showPostAddedSuccessfullyMessage && (
          <div className="post-added-successfully">Post added successfully!</div>
        )}
        {showFailAddingPostMessage && (
          <div className="post-added-unsuccessfully">There was an error adding your post!</div>
        )}

        {showPostDeletedSuccessfullyMessage && (
          <div className="post-deleted-successfully">Post deleted successfully!</div>
        )}
        {showPostDeletingImageMessage && (
          <div className="post-deleted-unsuccessfully">There was an error deleting your post!</div>
        )}

        {showCommentAddedSuccessfully && (
          <div className="comment-added-successfully">Comment added successfully!</div>
        )}
        {showFailAddingComment && (
          <div className="comment-added-unsuccessfully">There was an error adding your comment!</div>
        )}

        {showCommentBodyIsEmptyMessage && (
          <div className="comment-added-unsuccessfully">Comment body is empty!</div>
        )}

        {showNoPostImageIsAttached && (
          <div className="comment-added-unsuccessfully">You have to upload a picture before uploading!</div>
        )}

        {showCommentDeletedSuccessfully && (
          <div className="comment-added-successfully">Comment deleted!</div>
        )}

      {posts.map((post, index) => (
        <div
        key={post.postId}
        className="post"
        >
          <div className="user-info">
            <img
              src={`http://localhost:8080/users/profile-picture/${post.user.username}`}
              alt={`${post.user.username}'s profile`}
              className="user-avatar"
            />
            <div className="user-details">
              <span className="post-username">{post.user.username}
                <span className="username-dot"> · </span>
                <span className="post-date">
                  {calculateTimeDifference(post.postedAt)}
                  {calculateTimeDifference(post.postedAt) !== 'Just now' ? ' ago' : ''}
                </span>
              </span>
              <span className="post-location">{post.location}</span>
              {/* <span className="post-date">{post.postedAt}</span> */}
            </div>
          </div>
          <img
            src={`http://localhost:8080/posts/picture/${post.postId}`}
            alt="Post"
            className="post-image"
          />

          {post.user.username === currentUser && (
            <button className="delete-post-button" onClick={() => handleDeletePost(post.postId)}>
              <FontAwesomeIcon icon={faTimes} /> {/* Use the appropriate icon */}
            </button>
          )}

          {showDeleteConfirmation && (
            <div className="delete-confirmation">
              <p>Are you sure you want to delete this post?</p>
              <button className="delete-confirm" onClick={confirmDelete}>
                Yes
              </button>
              <button className="delete-cancel" onClick={cancelDelete}>
                Cancel
              </button>
            </div>
          )}

          <div className="post-description">
            <p>{post.description}</p>
          </div>
          <div className="comments-button">
            {post.comments.length > 0 && (
                <button
                    className={`view-comments-button ${selectedPost === post ? 'hidden' : ''}`}
                    onClick={() => toggleComments(post)}
                >
                    View All {post.comments.length} Comments
                </button>
                
             )}
          </div>

          <div className="comments-button">
            
              <div className="comment-input-container">
                <input
                  type="text"
                  className="add-comment-input"
                  placeholder="Add a comment..."
                  value={commentTexts[post.postId] || ''}
                  onChange={(e) => handleCommentInputChange(post.postId, e.target.value)}
                  />
                <button
                  className="add-comment-button"
                  onClick={() => handleAddComment(post.postId, commentTexts[post.postId])}
                  >
                  Send
                </button>
              </div>
            
          </div>

          {index !== posts.length - 1 && <hr className="posts-dividing-hr" />}
          <div className={`comments-window ${selectedPost === post ? 'show-comments' : ''}`}>
            <button
              className="close-comments-button"
              onClick={() => toggleComments(post)}
            >
              X
            </button>
            
            {post.comments.slice().reverse().map((comment) => (
              <div key={comment.id} className="comment">
                <img
                  src={`http://localhost:8080/users/profile-picture/${comment.user.username}`}
                  alt={`${comment.user.username}'s profile`}
                  className="comment-avatar"
                />
                <div className="comment-details">
                  <span className="comment-username">{comment.user.username}
                    <span className="comment-dot"> · </span>
                    <span className="comment-date">
                       {calculateTimeDifference(comment.postedAt)}
                       {calculateTimeDifference(comment.postedAt) !== 'Just now' ? ' ago' : ''}   
                    </span>
                  </span>
                  
                  <p className="comment-body">{comment.commentBody}</p>
                  {/* <div className="posts-comments-dividing-hr" >
                    
                  </div> */}
                
                </div>
                {comment.user.username === currentUser && (
                  <FontAwesomeIcon
                    icon={faTimes}
                    className="delete-comment-icon"
                    onClick={() => handleDeleteComment(comment.id)}
                  />
                )}
              </div>           
            ))}
          </div>               
        </div>
      ))}
      <div onClick={handleAddPostClick} className="add-post-button">
        <FontAwesomeIcon icon={faPlus} />
      </div>
      {addingPost && (
        <div className="add-post-popup">
          <div className="add-post-header">
            <span>Add new post</span>
            <FontAwesomeIcon icon={faTimes} onClick={() => setAddingPost(false)} />
          </div>
          <input
            type="text"
            className="add-post-input"
            placeholder="Post description"
            value={postDescription}
            onChange={(e) => setPostDescription(e.target.value)}
          />
          <input
            type="text"
            className="add-post-input"
            placeholder="Post location"
            value={postLocation}
            onChange={(e) => setPostLocation(e.target.value)}
          />
          <input type="file" id="file-upload" accept="image/*" onChange={handleImageChange} />
          {selectedImage && <span>Selected image: {selectedImage.name}</span>}
          <button onClick={handleUploadClick} className="add-post-upload-button">Upload</button>
        </div>
      )}
    </div>
    
  );
}

export default PostsPage;
