import React, { useState } from 'react';
import './PostCard.css';

export default function PostCard({ title, summary, content, category, date, author, readTime, emoji = "📝" }) {
  const [isReadMore, setIsReadMore] = useState(false);

  function toggleRead() {
    setIsReadMore(!isReadMore);
  }

  return (
    <article className="post-card">
      <div className="card-top">
        <span className="post-emoji">{emoji}</span>
        <span className="post-category">{category}</span>
      </div>
      
      <div className="card-middle">
        <h3>{title}</h3>
        <p>{summary}</p>
        
        {isReadMore && (
          <div className="post-full-text">
            <p>{content}</p>
          </div>
        )}
      </div>

      <div className="card-actions">
        <button className="btn-read" onClick={toggleRead}>
          {isReadMore ? 'Read Less' : 'Read More'}
        </button>
      </div>

      <div className="card-bottom-row">
        <span>By {author}</span>
        <span>{date}</span>
      </div>
    </article>
  );
}
