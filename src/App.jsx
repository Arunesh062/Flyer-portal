import { useState } from 'react';
import { collection, addDoc } from "firebase/firestore";
import { db } from './firebase';

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function App() {
  const [name, setName] = useState('');
  const [month, setMonth] = useState(months[new Date().getMonth()]);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus({ type: '', message: '' });
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setStatus({ type: 'error', message: 'Please enter your name' });
      return;
    }
    if (!file) {
      setStatus({ type: 'error', message: 'Please select a flyer to upload' });
      return;
    }

    setUploading(true);
    setStatus({ type: '', message: '' });

    // TODO: You will add your Cloudinary details here later!
    const CLOUDINARY_UPLOAD_PRESET = "YOUR_UPLOAD_PRESET";
    const CLOUDINARY_CLOUD_NAME = "YOUR_CLOUD_NAME";

    try {
      if (CLOUDINARY_UPLOAD_PRESET === "YOUR_UPLOAD_PRESET") {
         setStatus({ type: 'error', message: 'Please configure Cloudinary Preset and Cloud Name in App.jsx!' });
         setUploading(false);
         return;
      }

      // 1. Upload to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      const cloudinaryRes = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`, {
        method: "POST",
        body: formData
      });

      const cloudinaryData = await cloudinaryRes.json();

      if (!cloudinaryRes.ok) {
        throw new Error(cloudinaryData.error?.message || 'Error uploading to Cloudinary');
      }

      const fileUrl = cloudinaryData.secure_url;

      // 2. Save Data to Firebase Firestore Database
      try {
        await addDoc(collection(db, "uploads"), {
          name: name,
          month: month,
          fileName: file.name,
          fileUrl: fileUrl,
          uploadedAt: new Date()
        });

        setStatus({ type: 'success', message: '🎉 Flyer uploaded successfully to Cloudinary & Firebase!' });
        setFile(null); // Reset file
      } catch (dbErr) {
        console.error("DB error:", dbErr);
        setStatus({ type: 'success', message: 'Flyer uploaded to Cloudinary, but Firebase Database failed. (Did you enable Firestore?)' });
      }

      setUploading(false);

    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', message: `Upload failed: ${err.message}` });
      setUploading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="glass-card">
        <h1 className="title">Flyer Portal</h1>
        <p className="subtitle">Upload your monthly designs securely to the cloud</p>

        {status.message && (
          <div className={status.type === 'error' ? 'error-msg' : 'success-msg'}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleUpload}>
          <div className="form-group">
            <label htmlFor="name">Your Name</label>
            <input 
              type="text" 
              id="name"
              className="form-input" 
              placeholder="e.g. John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="month">Month</label>
            <select 
              id="month"
              className="form-select"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            >
              {months.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div className="file-drop-area">
            <div className="file-icon">📁</div>
            <span className="file-msg">
              {file ? file.name : 'Choose a flyer or drag it here'}
            </span>
            <span className="file-submsg">
              {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'Supports PNG, JPG, PDF'}
            </span>
            <input type="file" onChange={handleFileChange} />
          </div>

          <button 
            type="submit" 
            className="submit-btn" 
            disabled={uploading || !file || !name.trim()}
          >
            {uploading ? <div className="spinner"></div> : 'Upload Flyer'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
