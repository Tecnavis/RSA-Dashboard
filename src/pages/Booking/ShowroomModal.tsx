import React, { useState, useEffect } from 'react';
import './ShowroomModal.css'; // Import CSS for styling
import { collection, addDoc, getFirestore, onSnapshot } from 'firebase/firestore'; 

const ShowroomModal = () => {
  const [Location, setLocation] = useState('');
  const [showrooms, setShowrooms] = useState([]); // State for holding list of showrooms
  const db = getFirestore();

  const handleInputChange = (e) => {
    setLocation(e.target.value);
  };

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

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'showroom'), (snapshot) => {
      const showroomsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setShowrooms(showroomsList);
    });

    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, [db]);

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
      
      {/* <div className="showroom-list">
        <h3>Showroom List</h3>
        <ul>
          {showrooms.map(showroom => (
            <li key={showroom.id}>
              <p><strong>Name:</strong> {showroom.Location}</p>
              <p><strong>Status:</strong> {showroom.status}</p>
              <p><strong>Created At:</strong> {showroom.createdAt ? new Date(showroom.createdAt.seconds * 1000).toLocaleString() : 'N/A'}</p>
            </li>
          ))}
        </ul>
      </div> */}
    </div>
  );
};

export default ShowroomModal;
