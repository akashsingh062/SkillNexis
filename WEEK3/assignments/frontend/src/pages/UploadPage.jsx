import React, { useState } from 'react';
import styles from './UploadPage.module.css';

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setUploadedUrl("");
    setErrorMsg("");
    setSuccessMsg("");
  }

  async function handleUpload(e) {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMsg("Please select an image file first");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await fetch('http://localhost:5003/api/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        setUploadedUrl(data.imageUrl);
        setSuccessMsg("Image uploaded successfully!");
      } else {
        setErrorMsg(data.error || "Failed to upload image");
      }
    } catch (err) {
      setErrorMsg("Failed to connect to backend server");
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    if (!uploadedUrl) return;
    navigator.clipboard.writeText(uploadedUrl);
    setSuccessMsg("URL copied to clipboard!");
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h2>Image Upload Service</h2>
        <p className={styles.subtitle}>Upload screenshots or assets to get public links for your To-Do tasks.</p>
        
        <form onSubmit={handleUpload} className={styles.form}>
          <div className={styles.dropzone}>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange}
              id="file-input"
              className={styles.fileInput}
              required
            />
            <label htmlFor="file-input" className={styles.dropLabel}>
              {selectedFile ? `Selected: ${selectedFile.name}` : 'Click here to choose an image'}
            </label>
          </div>

          {previewUrl && (
            <div className={styles.previewBox}>
              <h3>Selected Preview:</h3>
              <img src={previewUrl} alt="Preview" className={styles.previewImage} />
            </div>
          )}

          {errorMsg && <div className={styles.error}>{errorMsg}</div>}
          {successMsg && <div className={styles.success}>{successMsg}</div>}

          <button type="submit" disabled={loading} className={styles.btnUpload}>
            {loading ? 'Uploading...' : 'Upload Image'}
          </button>
        </form>

        {uploadedUrl && (
          <div className={styles.resultBox}>
            <h3>Uploaded Image URL:</h3>
            <div className={styles.copyRow}>
              <input 
                type="text" 
                value={uploadedUrl} 
                readOnly 
                className={styles.resultInput}
              />
              <button onClick={handleCopy} className={styles.btnCopy}>Copy</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
