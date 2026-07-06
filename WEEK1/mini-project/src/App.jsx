import React, { useState } from 'react';
import postsData from './data/posts.json';
import BlogHeader from './components/BlogHeader';
import SearchBar from './components/SearchBar';
import CategoryFilters from './components/CategoryFilters';
import PostCard from './components/PostCard';
import BlogFooter from './components/BlogFooter';
import './App.css';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Coding', 'Design', 'Acoustics', 'Career'];

  const filteredPosts = postsData.filter(function(post) {
    var query = searchQuery.toLowerCase().trim();
    var matchesSearch = 
      post.title.toLowerCase().indexOf(query) !== -1 || 
      post.summary.toLowerCase().indexOf(query) !== -1 || 
      post.content.toLowerCase().indexOf(query) !== -1;
      
    var matchesCategory = activeCategory === 'All' || post.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  function handleReset() {
    setSearchQuery('');
    setActiveCategory('All');
  }

  return (
    <div className="blog-app-wrapper">
      <BlogHeader 
        title="Akash's Blog" 
        subtitle="Insights and tutorials on code, design and modern React components."
        activePostsCount={filteredPosts.length}
      />

      <main className="blog-main-content">
        <section className="controls">
          <SearchBar 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          <CategoryFilters 
            categories={categories}
            activeCategory={activeCategory}
            onCategorySelect={setActiveCategory}
          />
        </section>

        <section className="posts-container">
          {filteredPosts.length > 0 ? (
            <div className="posts-grid">
              {filteredPosts.map(function(post) {
                return (
                  <PostCard 
                    key={post.id}
                    title={post.title}
                    summary={post.summary}
                    content={post.content}
                    category={post.category}
                    date={post.date}
                    author={post.author}
                    readTime={post.readTime}
                    emoji={post.emoji}
                  />
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <h2>No Posts Found</h2>
              <p>We couldn't find anything matching "{searchQuery}".</p>
              <button className="btn-clear" onClick={handleReset}>
                Reset Search
              </button>
            </div>
          )}
        </section>
      </main>

      <BlogFooter 
        copyright="© 2026 Akash Singh. Coursework Mini Project."
      />
    </div>
  );
}
