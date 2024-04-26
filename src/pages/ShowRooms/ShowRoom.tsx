import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { addDoc, collection, getFirestore, getDocs, doc, updateDoc } from 'firebase/firestore';
import IconMapPin from '../../components/Icon/IconMapPin';

const ShowRoom = () => {
  const [showRoom, setShowRoom] = useState({
    img: '',
    ShowRoom: '',
    description: '',
    Location: '',
    Map: '',
  });
  const [existingShowRooms, setExistingShowRooms] = useState([]);
  const [editRoomId, setEditRoomId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShowRoom({ ...showRoom, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const db = getFirestore();
    try {
      if (editRoomId) {
        // Update existing showroom
        const roomRef = doc(db, 'showroom', editRoomId);
        await updateDoc(roomRef, showRoom);
        alert('Showroom updated successfully');
        setEditRoomId(null);
      } else {
        // Add new showroom
        await addDoc(collection(db, 'showroom'), showRoom);
        alert('Showroom added successfully');
      }
      // Clear the form after successful submission
      setShowRoom({
        img: '',
        ShowRoom: '',
        description: '',
        Location: '',
        Map: '',
      });
      // Fetch updated list of showrooms
      fetchShowRooms();
    } catch (error) {
      console.error('Error adding/updating showroom:', error);
    }
  };

  const fetchShowRooms = async () => {
    const db = getFirestore();
    try {
      const querySnapshot = await getDocs(collection(db, 'showroom'));
      const rooms = [];
      querySnapshot.forEach((doc) => {
        rooms.push({ id: doc.id, ...doc.data() });
      });
      setExistingShowRooms(rooms);
    } catch (error) {
      console.error('Error fetching showrooms:', error);
    }
  };

  const handleEdit = (roomId) => {
    // Find the showroom by ID
    const roomToEdit = existingShowRooms.find((room) => room.id === roomId);
    // Populate form fields with showroom details
    setShowRoom(roomToEdit);
    // Set the ID of the showroom being edited
    setEditRoomId(roomId);
  };

  useEffect(() => {
    // Fetch showrooms when the component mounts
    fetchShowRooms();
  }, []);

  return (
    <div className="mb-5">
      <h5 className="font-semibold text-lg dark:text-white-light mb-5">Showroom Details</h5>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="ShowRoom"
          value={showRoom.ShowRoom}
          onChange={handleChange}
          placeholder="Showroom Name"
          className="form-input w-full mb-3"
          required
        />
        <input
          type="text"
          name="img"
          value={showRoom.img}
          onChange={handleChange}
          placeholder="Image URL"
          className="form-input w-full mb-3"
          required
        />
        <input
          type="text"
          name="Location"
          value={showRoom.Location}
          onChange={handleChange}
          placeholder="Location"
          className="form-input w-full mb-3"
          required
        />
        <input
          type="text"
          name="Map"
          value={showRoom.Map}
          onChange={handleChange}
          placeholder="Map URL"
          className="form-input w-full mb-3"
          required
        />
        <textarea
          name="description"
          value={showRoom.description}
          onChange={handleChange}
          placeholder="Description"
          className="form-textarea w-full mb-3"
          required
        />
        <button type="submit" className="btn btn-primary">Add Showroom</button>
      </form>

      <div>
        <h5 className="font-semibold text-lg dark:text-white-light mt-8">Existing Showrooms</h5>
        <ul style={{ listStyleType: 'none', padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
  {existingShowRooms.map((room) => (
    <li key={room.id}>
      <div style={{ 
        border: '1px solid #ccc', 
        borderRadius: '8px', 
        padding: '20px', 
        marginBottom: '20px', 
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
        transition: 'transform 0.3s ease-in-out',
        textAlign:"center"
        }}>
        <p style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>{room.ShowRoom}</p>
        <img src={room.img} alt={room.ShowRoom} style={{ maxWidth: '100%', height: 'auto', marginBottom: '10px' }} />
        <p style={{ marginBottom: '10px' }}>{room.Location}</p>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',color:"blue" }}>
  <Link to={room.Map} className='map-pin-link'><IconMapPin className='map-pin-icon'/></Link>
</div>

        <p style={{ marginBottom: 0 }}>{room.description}</p>
        <button 
  className='btn btn-primary' 
  onClick={() => handleEdit(room.id)} 
  style={{ 
    marginTop: '10px',
    display: 'flex',
    justifyContent: 'center',
  }}
>
  Edit
</button>

      </div>
    </li>
  ))}
</ul>



      </div>
    </div>
  );
};

export default ShowRoom;
