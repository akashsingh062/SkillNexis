import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AdminPage.module.css';

export default function AdminPage() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Audio");
  const [imageUrl, setImageUrl] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  useEffect(function() {
    if (!token || role !== 'admin') {
      navigate('/auth');
      return;
    }

    fetchOrders();
    fetchProducts();
  }, [token, role]);

  async function fetchOrders() {
    try {
      const response = await fetch('http://localhost:5006/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setOrders(data);
      }
    } catch (err) {
      setErrorMsg('Failed to load system orders');
    }
  }

  async function fetchProducts() {
    try {
      const response = await fetch('http://localhost:5006/api/products');
      const data = await response.json();
      if (response.ok) {
        setProducts(data);
      }
    } catch (err) {
      setErrorMsg('Failed to load products list');
    }
  }

  async function handleAddProduct(e) {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!title.trim() || !price) {
      setErrorMsg("Title and price are required");
      return;
    }

    try {
      const response = await fetch('http://localhost:5006/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          description,
          price: parseFloat(price),
          category,
          imageUrl
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMsg("Product created successfully!");
        setTitle("");
        setDescription("");
        setPrice("");
        setImageUrl("");
        fetchProducts();
      } else {
        setErrorMsg(data.error || 'Failed to create product');
      }
    } catch (err) {
      setErrorMsg('Failed to connect to backend server');
    }
  }

  async function handleUpdateStatus(id, newStatus) {
    try {
      const response = await fetch(`http://localhost:5006/api/orders/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        fetchOrders();
      }
    } catch (err) {
      setErrorMsg('Failed to update status');
    }
  }

  async function handleDeleteProduct(id) {
    try {
      const response = await fetch(`http://localhost:5006/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        fetchProducts();
      }
    } catch (err) {
      setErrorMsg('Failed to delete product');
    }
  }

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.mainTitle}>Admin Control Center</h2>
      {errorMsg && <div className={styles.error}>{errorMsg}</div>}
      {successMsg && <div className={styles.success}>{successMsg}</div>}

      <div className={styles.grid}>
        
        <div className={styles.leftCol}>
          <div className={styles.card}>
            <h3>Add New Store Product</h3>
            <form onSubmit={handleAddProduct} className={styles.form}>
              <div className={styles.field}>
                <label>Title</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={function(e) { setTitle(e.target.value); }} 
                  placeholder="e.g. Headphones Pro"
                  required
                />
              </div>

              <div className={styles.field}>
                <label>Description</label>
                <textarea 
                  value={description} 
                  onChange={function(e) { setDescription(e.target.value); }} 
                  placeholder="Product description..."
                  rows="3"
                />
              </div>

              <div className={styles.rowFields}>
                <div className={styles.field}>
                  <label>Price ($)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={price} 
                    onChange={function(e) { setPrice(e.target.value); }} 
                    placeholder="99.99"
                    required
                  />
                </div>

                <div className={styles.field}>
                  <label>Category</label>
                  <select value={category} onChange={function(e) { setCategory(e.target.value); }}>
                    <option value="Audio">Audio</option>
                    <option value="Mics">Mics</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
              </div>

              <div className={styles.field}>
                <label>Image Link URL</label>
                <input 
                  type="text" 
                  value={imageUrl} 
                  onChange={function(e) { setImageUrl(e.target.value); }} 
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <button type="submit" className={styles.btnSubmit}>Create Product</button>
            </form>
          </div>

          <div className={styles.cardProducts}>
            <h3>Catalog Inventory</h3>
            <div className={styles.productsList}>
              {products.map(function(item) {
                return (
                  <div key={item._id} className={styles.productRow}>
                    <div className={styles.productInfo}>
                      <span className={styles.productTitle}>{item.title}</span>
                      <span className={styles.productPrice}>${item.price.toFixed(2)} - {item.category}</span>
                    </div>
                    <button onClick={function() { handleDeleteProduct(item._id); }} className={styles.btnDeleteProduct}>
                      Remove
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className={styles.rightCol}>
          <div className={styles.cardOrders}>
            <h3>Customer Orders Ledger</h3>
            {orders.length === 0 ? (
              <p className={styles.empty}>No customer orders recorded yet.</p>
            ) : (
              <div className={styles.ordersList}>
                {orders.map(function(ord) {
                  return (
                    <div key={ord._id} className={styles.orderCard}>
                      <div className={styles.orderHeader}>
                        <div>
                          <span className={styles.userTag}>
                            Buyer: {ord.user ? ord.user.username : 'Deleted User'}
                          </span>
                          <p className={styles.dateTag}>
                            {new Date(ord.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={styles[`status${ord.status}`]}>{ord.status}</span>
                      </div>
                      
                      <div className={styles.itemsList}>
                        {ord.items.map(function(item, index) {
                          return (
                            <div key={index} className={styles.orderItemRow}>
                              <span>{item.title}</span>
                              <span>${item.price} x {item.quantity}</span>
                            </div>
                          );
                        })}
                      </div>

                      <div className={styles.orderFooter}>
                        <span className={styles.orderTotal}>Total: ${ord.total.toFixed(2)}</span>
                        <div className={styles.statusUpdateControl}>
                          <span>Modify Status:</span>
                          <select 
                            value={ord.status} 
                            onChange={function(e) { handleUpdateStatus(ord._id, e.target.value); }}
                            className={styles.statusSelect}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
