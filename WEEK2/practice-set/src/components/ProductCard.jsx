import React, { useState } from 'react';
import styles from './ProductCard.module.css';

export default function ProductCard({ name, price, description, category, inStock }) {
  const [quantity, setQuantity] = useState(1);

  function addOne() {
    setQuantity(quantity + 1);
  }

  function removeOne() {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  }

  return (
    <div className={styles.card}>
      <span className={styles.category}>{category}</span>
      <h3 className={styles.title}>{name}</h3>
      <p className={styles.desc}>{description}</p>
      
      <div className={styles.priceRow}>
        <span className={styles.price}>${price}</span>
        <span className={inStock ? styles.instock : styles.outstock}>
          {inStock ? 'In Stock' : 'Out of Stock'}
        </span>
      </div>

      <div className={styles.actions}>
        <div className={styles.counter}>
          <button onClick={removeOne} className={styles.btnCount}>-</button>
          <span className={styles.countText}>{quantity}</span>
          <button onClick={addOne} className={styles.btnCount}>+</button>
        </div>
        <button className={styles.btnBuy} disabled={!inStock}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}
