import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './FeedPage.module.css';

export default function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [commentInputs, setCommentInputs] = useState({});
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(function() {
    if (!token) {
      navigate('/auth');
      return;
    }

    fetchPosts();
  }, [token]);

  async function fetchPosts() {
    try {
      const response = await fetch('http://localhost:5007/api/posts');
      const data = await response.json();
      if (response.ok) {
        setPosts(data);
      }
    } catch (err) {
      setErrorMsg('Failed to connect to backend feed');
    }
  }

  async function handleCreatePost(e) {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      const response = await fetch('http://localhost:5007/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content })
      });
      const data = await response.json();
      if (response.ok) {
        setPosts([data, ...posts]);
        setContent("");
      } else {
        setErrorMsg(data.error || 'Failed to publish post');
      }
    } catch (err) {
      setErrorMsg('Failed to connect to server');
    }
  }

  async function handleLike(id) {
    try {
      const response = await fetch(`http://localhost:5007/api/posts/${id}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setPosts(posts.map(function(p) {
          return p._id === id ? data : p;
        }));
      }
    } catch (err) {
      setErrorMsg('Failed to toggle like');
    }
  }

  async function handleAddComment(e, id) {
    e.preventDefault();
    const commentVal = commentInputs[id];
    if (!commentVal || !commentVal.trim()) return;

    try {
      const response = await fetch(`http://localhost:5007/api/posts/${id}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: commentVal })
      });
      const data = await response.json();
      if (response.ok) {
        setPosts(posts.map(function(p) {
          return p._id === id ? data : p;
        }));
        setCommentInputs({ ...commentInputs, [id]: "" });
      }
    } catch (err) {
      setErrorMsg('Failed to add comment');
    }
  }

  function handleCommentInputChange(id, val) {
    setCommentInputs({ ...commentInputs, [id]: val });
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h2 className={styles.title}>Social Feed Board</h2>
        
        {errorMsg && <div className={styles.error}>{errorMsg}</div>}

        <form onSubmit={handleCreatePost} className={styles.postForm}>
          <textarea 
            value={content}
            onChange={function(e) { setContent(e.target.value); }}
            placeholder="Share something with the world..."
            rows="3"
            required
            className={styles.textarea}
          />
          <button type="submit" className={styles.btnPublish}>Publish Post</button>
        </form>

        <div className={styles.feed}>
          {posts.map(function(post) {
            return (
              <div key={post._id} className={styles.postCard}>
                <div className={styles.postHeader}>
                  <span className={styles.username}>
                    @{post.author ? post.author.username : 'Deleted User'}
                  </span>
                  <span className={styles.date}>
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p className={styles.postContent}>{post.content}</p>

                <div className={styles.actions}>
                  <button onClick={function() { handleLike(post._id); }} className={styles.btnLike}>
                    ❤️ {post.likes.length} Likes
                  </button>
                </div>

                <div className={styles.commentsBox}>
                  <span className={styles.commentsHeading}>Comments ({post.comments.length})</span>
                  
                  <div className={styles.commentsList}>
                    {post.comments.map(function(c, i) {
                      return (
                        <div key={i} className={styles.commentRow}>
                          <span className={styles.commentUser}>
                            @{c.author ? c.author.username : 'User'}:
                          </span>
                          <span className={styles.commentText}>{c.content}</span>
                        </div>
                      );
                    })}
                  </div>

                  <form 
                    onSubmit={function(e) { handleAddComment(e, post._id); }} 
                    className={styles.commentForm}
                  >
                    <input 
                      type="text" 
                      value={commentInputs[post._id] || ""}
                      onChange={function(e) { handleCommentInputChange(post._id, e.target.value); }}
                      placeholder="Write a comment..."
                      required
                      className={styles.commentInput}
                    />
                    <button type="submit" className={styles.btnComment}>Post</button>
                  </form>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
