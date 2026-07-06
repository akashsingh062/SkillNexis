import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './FeedPage.module.css';

export default function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [commentInputs, setCommentInputs] = useState({});
  const [toasts, setToasts] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(function() {
    if (!token) {
      navigate('/auth');
      return;
    }

    fetchPosts();
  }, [token]);

  function triggerToast(msg, type = 'info') {
    const id = Date.now();
    setToasts(function(current) {
      return [...current, { id, msg, type }];
    });
    setTimeout(function() {
      setToasts(function(current) {
        return current.filter(function(t) { return t.id !== id; });
      });
    }, 3000);
  }

  async function fetchPosts() {
    try {
      const response = await fetch('http://localhost:5007/api/posts');
      const data = await response.json();
      if (response.ok) {
        setPosts(data);
      } else {
        triggerToast('Failed to load feed', 'error');
      }
    } catch (err) {
      triggerToast('Failed to connect to feed server', 'error');
    }
  }

  async function handleCreatePost(e) {
    e.preventDefault();
    if (!content.trim()) return;

    if (content.trim().length > 300) {
      triggerToast('Post exceeds the 300 character limit', 'error');
      return;
    }

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
        triggerToast('Post shared successfully!', 'success');
      } else {
        triggerToast(data.error || 'Failed to publish post', 'error');
      }
    } catch (err) {
      triggerToast('Failed to connect to server', 'error');
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
      triggerToast('Failed to like post', 'error');
    }
  }

  async function handleAddComment(e, id) {
    e.preventDefault();
    const commentVal = commentInputs[id];
    if (!commentVal || !commentVal.trim()) return;

    if (commentVal.trim().length > 150) {
      triggerToast('Comment exceeds the 150 character limit', 'error');
      return;
    }

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
        triggerToast('Comment added!', 'success');
      } else {
        triggerToast(data.error || 'Failed to add comment', 'error');
      }
    } catch (err) {
      triggerToast('Failed to add comment', 'error');
    }
  }

  function handleCommentInputChange(id, val) {
    setCommentInputs({ ...commentInputs, [id]: val });
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h2 className={styles.title}>Social Feed Board</h2>

        <form onSubmit={handleCreatePost} className={styles.postForm}>
          <div className={styles.textareaWrapper}>
            <textarea 
              value={content}
              onChange={function(e) { setContent(e.target.value); }}
              placeholder="Share something with the community..."
              rows="3"
              required
              className={styles.textarea}
            />
            <span className={styles.charCounter}>{content.length} / 300</span>
          </div>
          <button type="submit" className={styles.btnPublish}>Share Post</button>
        </form>

        <div className={styles.feed}>
          {posts.map(function(post) {
            return (
              <div key={post._id} className={styles.postCard}>
                <div className={styles.postHeader}>
                  <span className={styles.username}>
                    @{post.author ? post.author.username : 'User'}
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
                      placeholder="Add a comment... (max 150 chars)"
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

      <div className={styles.toastContainer}>
        {toasts.map(function(t) {
          return (
            <div key={t.id} className={styles[`toast_${t.type}`]}>
              {t.msg}
            </div>
          );
        })}
      </div>
    </div>
  );
}
