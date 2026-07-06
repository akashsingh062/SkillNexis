import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './StorePage.module.css';

export default function StorePage({ cart, onAddToCart, onClearCart }) {
  const [products, setProducts] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(function() {
    if (!token) {
      navigate('/auth');
      return;
    }

    fetchProducts();
  }, [token]);

  async function fetchProducts() {
    try {
      const response = await fetch('http://localhost:5005/api/products');
      const data = await response.json();
      if (response.ok) {
        setProducts(data);
      } else {
        setErrorMsg('Failed to load products');
      }
    } catch (err) {
      setErrorMsg('Failed to connect to backend server');
    }
  }

  const cartTotal = cart.reduce(function(acc, item) {
    return acc + (item.price * item.quantity);
  }, 0);

  return (
    <div className={styles.wrapper}>
      <div className={styles.grid}>
        
        <div className={styles.catalogCol}>
          <h2 className={styles.title}>Audio Store Catalog</h2>
          {errorMsg && <div className={styles.error}>{errorMsg}</div>}
          
          <div className={styles.productsGrid}>
            {products.map(function(item) {
              return (
                <div key={item._id} className={styles.productCard}>
                  <span className={styles.categoryTag}>{item.category}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <div className={styles.priceRow}>
                    <span className={styles.price}>${item.price}</span>
                    <button onClick={function() { onAddToCart(item); }} className={styles.btnAddToCart}>
                      Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.cartCol}>
          <div className={styles.cartCard}>
            <h3>Shopping Cart</h3>
            {cart.length === 0 ? (
              <p className={styles.emptyCart}>Your cart is empty.</p>
            ) : (
              <>
                <div className={styles.cartList}>
                  {cart.map(function(item, idx) {
                    return (
                      <div key={idx} className={styles.cartItem}>
                        <div className={styles.cartItemDetails}>
                          <span className={styles.itemTitle}>{item.title}</span>
                          <span className={styles.itemPrice}>${item.price} x {item.quantity}</span>
                        </div>
                        <span className={styles.itemSubtotal}>
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    );
                  })}
                </div>
                
                <div className={styles.totalRow}>
                  <span>Total:</span>
                  <span className={styles.totalAmount}>${cartTotal.toFixed(2)}</span>
                </div>

                <button onClick={onClearCart} className={styles.btnClear}>
                  Clear Cart
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
