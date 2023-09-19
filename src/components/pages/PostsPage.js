import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PostsPage.css';

function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    // Fetch posts data with JWT token
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
  }, []);

  const toggleComments = (post) => {
    if (selectedPost === post) {
      setSelectedPost(null);
    } else {
      setSelectedPost(post);
    }
  };

  return (
    <div className="posts-container">
      {posts.map((post, index) => (
        <div key={post.postId} className="post">
          <div className="user-info">
            <img
              src={`http://localhost:8080/users/profile-picture/${post.user.username}`}
              alt={`${post.user.username}'s profile`}
              className="user-avatar"
            />
            <div className="user-details">
              <span className="username">{post.user.username}</span>
              <span className="post-date">{post.postedAt}</span>
            </div>
          </div>
          <img
            src={`http://localhost:8080/posts/picture/${post.postId}`}
            alt="Post"
            className="post-image"
          />
          <div className="comments-button">
            <button
              className={`view-comments-button ${selectedPost === post ? 'hidden' : ''}`}
              onClick={() => toggleComments(post)}
            >
              View Comments
            </button>
          </div>
          {index !== posts.length - 1 && <hr />}
          <div className={`comments-window ${selectedPost === post ? 'show-comments' : ''}`}>
            <button
              className="close-comments-button"
              onClick={() => toggleComments(post)}
            >
              X
            </button>
            {post.comments.map((comment) => (
              <div key={comment.id} className="comment">
                <img
                  src={`http://localhost:8080/users/profile-picture/${comment.user.username}`}
                  alt={`${comment.user.username}'s profile`}
                  className="comment-avatar"
                />
                <div className="comment-details">
                  <span className="comment-username">{comment.user.username}</span>
                  <p className="comment-body">{comment.commentBody}</p>
                </div>
                <span className="comment-date">{comment.postedAt}</span>
                
              </div>
            ))}
          </div>
                    
        </div>
      ))}
    </div>
  );
}

export default PostsPage;
