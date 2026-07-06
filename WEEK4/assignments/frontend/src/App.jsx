import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import AuthPage from './pages/AuthPage';
import CatalogPage from './pages/CatalogPage';
import AdminPage from './pages/AdminPage';

export default function App() {
  const [cart, setCart] = useState([]);

  function handleAddToCart(product) {
    const existing = cart.find(function(item) {
      return item._id === product._id;
    });

    if (existing) {
      setCart(cart.map(function(item) {
        return item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item;
      }));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  }

  function handleClearCart() {
    setCart([]);
  }

  const cartCount = cart.reduce(function(acc, item) {
    return acc + item.quantity;
  }, 0);

  return (
    <BrowserRouter>
      <Navbar cartCount={cartCount} />
      <main className="app-main">
        <Routes>
          <Route 
            path="/" 
            element={
              <CatalogPage 
                cart={cart}
                onAddToCart={handleAddToCart}
                onClearCart={handleClearCart}
              />
            } 
          />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/auth" element={<AuthPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
