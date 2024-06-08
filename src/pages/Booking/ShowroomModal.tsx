import React, { useState, useEffect, useRef } from 'react';
import './ShowroomModal.css'; // Import CSS for styling
import { collection, addDoc, getFirestore, onSnapshot } from 'firebase/firestore'; 

const ShowroomModal = () => {
  const [Location, setLocation] = useState('');
  const [ShowRoom, setShowRoom] = useState('');
  const [Description, setDescription] = useState('');
  const [UserName, setUserName] = useState('');
  const [Password, setPassword] = useState('');
  const [TollFree, setTollFree] = useState(''); // Add state for TollFree
  const [ShowRoomId, setShowRoomId] = useState(''); // Add state for ShowRoomId
  const [PhoneNumber, setPhoneNumber] = useState(''); // Add state for PhoneNumber
  const [AvailableServices, setAvailableServices] = useState([]); // Add state for AvailableServices
  const [MobileNumber, setMobileNumber] = useState(''); // Add state for MobileNumber
  const [LocationLatLng, setLocationLatLng] = useState({ lat: '', lng: '' }); // Add state for LocationLatLng
  const [State, setState] = useState(''); // Add state for State
  const [District, setDistrict] = useState(''); // Add state for District
  const [HasInsurance, setHasInsurance] = useState(''); // Add state for HasInsurance
  const [InsuranceAmount, setInsuranceAmount] = useState(''); // Add state for InsuranceAmount
  const [HasInsuranceBody, setHasInsuranceBody] = useState(''); // Add state for HasInsuranceBody
  const [InsuranceAmountBody, setInsuranceAmountBody] = useState(''); // Add state for InsuranceAmountBody
  const [Img, setImg] = useState(''); // Add state for Img

  const [showrooms, setShowrooms] = useState([]); // State for holding list of showrooms
  const db = getFirestore();
  const inputRef = useRef(null); // Ref for input element

  const setupAutocomplete = (inputRef, setter) => {
    if (!inputRef.current) return;
  
    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current);
    autocomplete.setFields(['geometry', 'name']);
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        const locationName = place.name; // Extract only the name of the location
        setter(locationName);
      }
    });
  };
  

  useEffect(() => {
    setupAutocomplete(inputRef, setLocation); 
  }, []);

  const handleInputChange = (e) => {
    setLocation(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'showroom'), {
        Location: Location,
        ShowRoom: ShowRoom,
        description: Description,
        userName: UserName,
        password: Password,
        tollfree: TollFree,
        showroomId: ShowRoomId,
        phoneNumber: PhoneNumber,
        availableServices: AvailableServices,
        mobileNumber: MobileNumber,
        locationLatLng: LocationLatLng,
        state: State,
        district: District,
        hasInsurance: HasInsurance,
        insuranceAmount: InsuranceAmount,
        hasInsuranceBody: HasInsuranceBody,
        insuranceAmountBody: InsuranceAmountBody,
        img: Img, 
        status: 'new showroom', 
        createdAt: new Date()
      });
      console.log('Showroom added successfully');
setLocation('');
setShowRoom('');
setDescription('');
setUserName('');
setPassword('');
setTollFree(''); 
setShowRoomId('');
setPhoneNumber('');
setAvailableServices([]);
setMobileNumber('');
setLocationLatLng({ lat: '', lng: '' });
setState('');
setDistrict('');
setHasInsurance('');
setInsuranceAmount('');
setHasInsuranceBody('');
setInsuranceAmountBody('');
setImg('');

    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };
  

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'showroom'), (snapshot) => {
      const showroomsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setShowrooms(showroomsList);
    });

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
            ref={inputRef}
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
