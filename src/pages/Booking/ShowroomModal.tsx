import React, { useState, useEffect, useRef } from 'react';
import './ShowroomModal.css';
import { collection, addDoc, getFirestore, onSnapshot } from 'firebase/firestore';

const ShowroomModal = ({ updateShowroomLocation }) => {
    const [Location, setLocation] = useState('');
    const [ShowRoom, setShowRoom] = useState('');
    const [Description, setDescription] = useState('');
    const [UserName, setUserName] = useState('');
    const [Password, setPassword] = useState('');
    const [TollFree, setTollFree] = useState('');
    const [ShowRoomId, setShowRoomId] = useState('');
    const [PhoneNumber, setPhoneNumber] = useState('');
    const [AvailableServices, setAvailableServices] = useState([]);
    const [MobileNumber, setMobileNumber] = useState('');
    const [LocationLatLng, setLocationLatLng] = useState({ lat: '', lng: '' });
    const [State, setState] = useState('');
    const [District, setDistrict] = useState('');
    const [HasInsurance, setHasInsurance] = useState('');
    const [InsuranceAmount, setInsuranceAmount] = useState('');
    const [HasInsuranceBody, setHasInsuranceBody] = useState('');
    const [InsuranceAmountBody, setInsuranceAmountBody] = useState('');
    const [Img, setImg] = useState('');

    const [showrooms, setShowrooms] = useState([]);
    const db = getFirestore();
    const inputRef = useRef(null);

    const setupAutocomplete = (inputRef, setter) => {
        if (!inputRef.current) return;

        const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current);
        autocomplete.setFields(['geometry', 'name']);
        autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (place.geometry) {
                const locationName = place.name;
                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();
                const formattedLocation = `${locationName}, ${lat}, ${lng}`;
                setLocation(formattedLocation);
                setLocationLatLng({ lat, lng });
            }
        });
    };

    useEffect(() => {
        setupAutocomplete(inputRef, setLocation);
    }, []);

    const handleInputChange = (e) => {
        setShowRoom(e.target.value);
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
            console.log('Updating showroom location to:', Location);
            updateShowroomLocation(Location); // Update the parent component with the selected location

            // Reset form fields
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
                        value={ShowRoom}
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
