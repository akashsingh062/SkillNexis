import React from 'react';
import ProductCard from '../components/ProductCard';
import styles from './ProductsPage.module.css';

export default function ProductsPage() {
  const products = [
    {
      id: 1,
      name: "Wireless ANC Headphones",
      price: 299.99,
      description: "Over-ear headphones with active noise cancellation and a 40-hour runtime.",
      category: "Acoustics",
      inStock: true
    },
    {
      id: 2,
      name: "Smart Exercise Watch",
      price: 199.99,
      description: "Tracks active steps, calories burned, heart patterns, and sleep habits.",
      category: "Wearables",
      inStock: true
    },
    {
      id: 3,
      name: "Studio Condenser Mic",
      price: 149.99,
      description: "Professional microphone for recording streams, vocal layouts, and podcasts.",
      category: "Audio",
      inStock: false
    }
  ];

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.heading}>Acoustics & Gear Catalog</h2>
      <div className={styles.grid}>
        {products.map(function(item) {
          return (
            <ProductCard 
              key={item.id}
              name={item.name}
              price={item.price}
              description={item.description}
              category={item.category}
              inStock={item.inStock}
            />
          );
        })}
      </div>
    </div>
  );
}
