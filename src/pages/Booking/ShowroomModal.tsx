import React, { useState } from 'react';
import './ShowroomModal.css'; // Import CSS for styling
import { collection, addDoc, getFirestore } from 'firebase/firestore'; 

const ShowroomModal = () => {
  const [Location, setLocation] = useState('');

  const handleInputChange = (e) => {
    setLocation(e.target.value);
  };
  const db = getFirestore();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'showroom'), {
        Location: Location,
        status: 'new showroom', 
        createdAt: new Date()
      });
      console.log('Showroom Location added:', Location);
      setLocation(''); 
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  return (
    <div className="showroom-modal">
      <form onSubmit={handleSubmit} className="showroom-form">
        <div className="form-group">
          <label htmlFor="Location">Showroom Name:</label>
          <input
            type="text"
            id="Location"
            value={Location}
            onChange={handleInputChange}
            required
            className="form-control"
            placeholder="Enter showroom name"
          />
        </div>
        <button type="submit" className="btn btn-primary">Save Showroom</button>
      </form>
    </div>
  );
};

export default ShowroomModal;
