import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import { GoogleMap, LoadScript, Marker, DistanceMatrixService } from '@react-google-maps/api';
import IconPlus from '../../components/Icon/IconPlus';
import ReactModal from 'react-modal';
import { v4 as uuidv4 } from 'uuid';
import { googleMapsApiKey } from '../../config/config';

const mapContainerStyle = {
    height: '400px',
    width: '100%',
};

const defaultCenter = { lat: 10.8505, lng: 76.2711 };

const Booking = () => {
    const db = getFirestore();
    const navigate = useNavigate();
    const [bookingId, setBookingId] = useState<string>('');
    useEffect(() => {
        const newBookingId = uuidv4();
        setBookingId(newBookingId);
    }, []);
    const [bookingDetails, setBookingDetails] = useState({
        company: '',
        fileNumber: '',
        customerName: '',
        phoneNumber: '',
        mobileNumber: '',
        totalSalary: '',
        serviceType: '',
        serviceVehicle: '',
        driver: '',
        vehicleNumber: '',
        vehicleModel: '',
        comments: '',
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalDistance, setModalDistance] = useState([]);
    const [selectedDriver, setSelectedDriver] = useState(null);
   
    const [serviceType, setServiceType] = useState('');
    const [pickupLocation, setPickupLocation] = useState(null);
    const [dropoffLocation, setDropoffLocation] = useState(null);
    const [distance, setDistance] = useState('');
    const [drivers, setDrivers] = useState([]);
    const distanceNumeric = parseFloat(distance.replace('km', ''));
    console.log('service', serviceType);
    const openModal = (distance) => {
        setIsModalOpen(true);
        setModalDistance(distance);
        console.log(distance);
    };
    const closeModal = () => {
        setIsModalOpen(false);
        
    };
    const handleInputChange = (field, value) => {
        console.log('Field:', field);
        console.log('Value:', value);
        setBookingDetails({ ...bookingDetails, [field]: value });

        if (field === 'distance') {
            openModal(value);
        } else if (field === 'serviceType') {
            setServiceType(value);
            openModal();
        } else if (field === 'selectedDriver') {
            console.log('Selected Driver ID:', value); // Log the selected driver ID
            setSelectedDriver(value); // Update selectedDriver state with the driver's id
        }
    };
    
   
    const setupAutocomplete = (inputRef, setter) => {
        if (!inputRef) return;
    
        const autocomplete = new window.google.maps.places.Autocomplete(inputRef);
        autocomplete.setFields(['geometry', 'name']); // Include name field to get the place name
        autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (place.geometry) {
                const location = {
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng(),
                    name: place.name // Get the name of the place
                };
                setter(location); // Update the state with the selected location
            }
        });
    };
    
    useEffect(() => {
        if (pickupLocation && dropoffLocation) {
            const service = new window.google.maps.DistanceMatrixService();
            service.getDistanceMatrix(
                {
                    origins: [pickupLocation],
                    destinations: [dropoffLocation],
                    travelMode: 'DRIVING',
                },
                (response, status) => {
                    if (status === 'OK') {
                        const distance = response.rows[0].elements[0].distance.text;
                        setDistance(distance);
                        setBookingDetails({ ...bookingDetails, distance: distance });
                    } else {
                        console.error('Error calculating distance:', status);
                    }
                }
            );
        }
    }, [pickupLocation, dropoffLocation]);
   // Function to calculate total salary for a driver
   const calculateTotalSalary = (basicSalaryValue, distanceValue, kmValueNumeric, perKmValueNumeric) => {
    console.log('Basic Salary Value:', basicSalaryValue);
    console.log('Distance Value:', distanceValue);
    console.log('Km Value Numeric:', kmValueNumeric);
    console.log('Per Km Value Numeric:', perKmValueNumeric);
    const distanceString = typeof distanceValue === 'string' ? distanceValue : '';
    const distanceNumeric = parseFloat(distanceString.replace('km', ''));
    console.log('Is Distance Numeric?', !isNaN(distanceNumeric));
    const totalSalary = basicSalaryValue + (distanceNumeric - kmValueNumeric) * perKmValueNumeric;
    console.log('Total Salary:', totalSalary);

    return totalSalary;
};




    useEffect(() => {
        const fetchDrivers = async () => {
            try {
                const driversCollection = collection(db, 'driver');
                const snapshot = await getDocs(driversCollection);
    
                const filteredDrivers = snapshot.docs
                    .map((doc) => ({
                        id: doc.id, // Assign the id property here
                        ...doc.data(),
                    }))
                    .filter((driver) => driver.selectedServices.includes(serviceType))
                    .map((driver) => {
                        
                        const basicSalary = parseFloat(driver.basicSalaries[serviceType]);
                        const basicSalaryKm = parseFloat(driver.basicSalaryKm[serviceType]);
                        const salaryPerKm = parseFloat(driver.salaryPerKm[serviceType]);
                        const totalSalary = calculateTotalSalary(
                            basicSalary,
                            distance,
                            basicSalaryKm,
                            salaryPerKm
                        );
                    
                        console.log('Basic Salary:', basicSalary);
                        console.log('Distance:', distance);
                        console.log('Basic Salary per Km:', basicSalaryKm);
                        console.log('Salary per Km:', salaryPerKm);
                        console.log('Total Salary:', totalSalary);
                    
                        return {
                            id: driver.id,
                            driverName: driver.driverName,
                            idnumber: driver.idnumber,
                            personalphone: driver.personalphone,
                            phone: driver.phone,
                            basicSalary: basicSalary,
                            basicSalaryKm: basicSalaryKm,
                            salaryPerKm: salaryPerKm,
                            totalSalary: totalSalary
                        };
                    });
                    
                console.log('Filtered Drivers:', filteredDrivers);
    
                setDrivers(filteredDrivers);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
    
        if (serviceType) {
            fetchDrivers().catch(console.error);
        } else {
            setDrivers([]); // Reset drivers if serviceType is not provided
        }
    }, [db, serviceType]);
    
    
    const handleAddBooking = async () => {
        try {
            const selectedDriverObject = drivers.find((driver) => driver.id === selectedDriver);
            const driverName = selectedDriverObject ? selectedDriverObject.driverName : '';
    
            // Calculate total salary based on the selected driver and other factors
            const totalSalary = selectedDriverObject ? selectedDriverObject.totalSalary : '';
    
            const bookingData = {
                ...bookingDetails,
                driver: driverName,
                totalSalary: totalSalary, // Include totalSalary in the booking data
                pickupLocation: pickupLocation,
                dropoffLocation: dropoffLocation
            };
    
            // Add the booking data to the Firestore collection
            const docRef = await addDoc(collection(db, 'bookings'), bookingData);
    
            // Log the ID of the newly created document
            console.log('Document written with ID: ', docRef.id);
    
            // Navigate to the desired page
            navigate('/bookings/newbooking');
        } catch (error) {
            console.error('Error adding document: ', error);
        }
    };
    
    return (
        <div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <h5 className="font-semibold text-lg dark:text-white-light">Add Bookings</h5>

                <div style={{ padding: '6px', flex: 1, marginTop: '2rem', marginRight: '6rem', marginLeft: '6rem', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', borderRadius: '10px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', padding: '1rem' }}>
                        <h5 className="font-semibold text-lg dark:text-white-light mb-5 p-4">Book Now</h5>
                        <div style={{ padding: '1rem' }}>
                            <h5 className="font-semibold text-lg dark:text-white-light">
                                R<span className="text-danger">S</span>A{bookingId}
                            </h5>
                        </div>{' '}
                        <div style={{ width: '100%' }}>
                            <div style={{ display: 'flex', alignItems: 'center', marginTop: '1rem' }}>
                                <label htmlFor="company" style={{ marginRight: '0.5rem', marginLeft: '0.5rem', width: '33%', marginBottom: '0', color: '#333' }}>
                                    Company
                                </label>
                                <select
                                    id="company"
                                    name="company"
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem',
                                        border: '1px solid #ccc',
                                        borderRadius: '5px',
                                        fontSize: '1rem',
                                        outline: 'none',
                                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                    }}
                                    onChange={(e) => handleInputChange('company', e.target.value)}
                                >
                                    <option value="">Select Company</option>
                                    <option value="rsa">RSA</option>
                                    <option value="self">Self</option>
                                </select>
                            </div>
                            <div className="flex items-center mt-4">
                                <label htmlFor="fileNumber" className="ltr:mr-3 rtl:ml-2 w-1/3 mb-0">
                                    File Number
                                </label>
                                <input
                                    id="fileNumber"
                                    type="text"
                                    name="fileNumber"
                                    className="form-input lg:w-[250px] w-2/3"
                                    placeholder="Enter File Number"
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem',
                                        border: '1px solid #ccc',
                                        borderRadius: '5px',
                                        fontSize: '1rem',
                                        outline: 'none',
                                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                    }}
                                    onChange={(e) => handleInputChange('fileNumber', e.target.value)}
                                />
                            </div>
                            <div className="mt-4 flex items-center">
                                <label htmlFor="customerName" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
                                    Customer Name
                                </label>
                                <input
                                    id="customerName"
                                    type="text"
                                    name="customerName"
                                    className="form-input flex-1"
                                    placeholder="Enter Name"
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem',
                                        border: '1px solid #ccc',
                                        borderRadius: '5px',
                                        fontSize: '1rem',
                                        outline: 'none',
                                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                    }}
                                    onChange={(e) => handleInputChange('customerName', e.target.value)}
                                />
                            </div>
                            <div className="mt-4 flex items-center">
                                <label htmlFor="phoneNumber" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
                                    Phone Number
                                </label>
                                <input
                                    id="phoneNumber"
                                    type="phoneNumber"
                                    name="phoneNumber"
                                    className="form-input flex-1"
                                    placeholder="Enter Phone number"
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem',
                                        border: '1px solid #ccc',
                                        borderRadius: '5px',
                                        fontSize: '1rem',
                                        outline: 'none',
                                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                    }}
                                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                                />
                            </div>
                            <div className="mt-4 flex items-center">
                                <label htmlFor="mobileNumber" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
                                    Mobile Number
                                </label>
                                <input
                                    id="mobileNumber"
                                    type="text"
                                    name="mobileNumber"
                                    className="form-input flex-1"
                                    placeholder="Enter Mobile number"
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem',
                                        border: '1px solid #ccc',
                                        borderRadius: '5px',
                                        fontSize: '1rem',
                                        outline: 'none',
                                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                    }}
                                    onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                                />
                            </div>{' '}
                            <div style={{ width: '100%' }}>
                                  
                                <LoadScript googleMapsApiKey={googleMapsApiKey} libraries={['places']}>
                                    <div className="flex items-center mt-4">
                                        <label htmlFor="pickupLocation" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
                                            Pickup Location
                                        </label>
                                        <div className="search-box ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
                                            <input
                                                className="form-input flex-1"
                                                style={{
                                                    width: '100%',
                                                    padding: '0.5rem',
                                                    border: '1px solid #ccc',
                                                    borderRadius: '5px',
                                                    fontSize: '1rem',
                                                    outline: 'none',
                                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                                }}
                                                type="text"
                                                placeholder="Pickup Location"
                                                ref={(node) => setupAutocomplete(node, setPickupLocation)}
                                                onChange={(e) => handleInputChange('pickupLocation', e.target.value)}
                                            />
                                            {pickupLocation && <div>{`pickupLocation Lat/Lng: ${pickupLocation.lat}, ${pickupLocation.lng}`}</div>}
                                        </div>
                                    </div>
                                    <div className="flex items-center mt-4">
                                        <label htmlFor="dropoffLocation" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
                                            Drop off Location
                                        </label>
                                        <div className="search-box ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
                                            <input
                                                className="form-input flex-1"
                                                style={{
                                                    width: '100%',
                                                    padding: '0.5rem',
                                                    border: '1px solid #ccc',
                                                    borderRadius: '5px',
                                                    fontSize: '1rem',
                                                    outline: 'none',
                                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                                }}
                                                type="text"
                                                placeholder="Drop off Location"
                                                ref={(node) => setupAutocomplete(node, setDropoffLocation)}
                                                onChange={(e) => handleInputChange('dropoffLocation', e.target.value)}
                                            />
                                            {dropoffLocation && <div>{`dropoffLocation Lat/Lng: ${dropoffLocation.lat}, ${dropoffLocation.lng}`}</div>}
                                        </div>
                                    </div>

                                    <GoogleMap mapContainerStyle={mapContainerStyle} center={defaultCenter} zoom={8}>
                                        {pickupLocation && (
                                            <Marker
                                                position={pickupLocation}
                                                icon={{
                                                    url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png', // URL of the custom marker icon
                                                    scaledSize: new window.google.maps.Size(40, 40), // Size of the marker
                                                }}
                                            />
                                        )}
                                        {dropoffLocation && <Marker position={dropoffLocation} />}
                                        {pickupLocation && dropoffLocation && (
                                            <DistanceMatrixService
                                                options={{
                                                    destinations: [{ lat: dropoffLocation.lat, lng: dropoffLocation.lng }],
                                                    origins: [{ lat: pickupLocation.lat, lng: pickupLocation.lng }],
                                                    travelMode: 'DRIVING',
                                                }}
                                                callback={(response) => {
                                                    if (response?.rows && response?.rows.length) {
                                                        const distanceText = response.rows[0]?.elements[0]?.distance?.text;
                                                        setDistance(distanceText);
                                                    }
                                                }}
                                            />
                                        )}
                                    </GoogleMap>
                                </LoadScript>
                            </div>
                            <div className="mt-4 flex items-center">
                                <label htmlFor="distance" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
                                    Distance (KM)
                                </label>
                                <input
                                    id="distance"
                                    type="text"
                                    name="distance"
                                    className="form-input flex-1"
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem',
                                        border: '1px solid #ccc',
                                        borderRadius: '5px',
                                        fontSize: '1rem',
                                        outline: 'none',
                                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                    }}
                                    onChange={(e) => handleInputChange('distance', e.target.value)}
                                    value={distance}
                                    readOnly
                                />
                            </div>
                            <div className="flex items-center mt-4">
                                <label htmlFor="serviceType" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
                                    Service Type
                                </label>
                                <select
                                    id="serviceType"
                                    name="serviceType"
                                    className="form-select flex-1"
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem',
                                        border: '1px solid #ccc',
                                        borderRadius: '5px',
                                        fontSize: '1rem',
                                        outline: 'none',
                                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                    }}
                                    onChange={(e) => handleInputChange('serviceType', e.target.value)}
                                >
                                    <option value="">Select Service Type</option>
                                    <option value="Flat bed">Flat bed</option>
                                    <option value="Under Lift">Under Lift</option>
                                    <option value="Rsr By Car">Rsr By Car</option>
                                    <option value="Rsr By Bike">Rsr By Bike</option>
                                    <option value="Custody">Custody</option>
                                    <option value="Hydra Crane">Hydra Crane</option>
                                    <option value="Jump start">Jump start</option>
                                    <option value="Tow Wheeler Fbt">Tow Wheeler Fbt</option>
                                    <option value="Zero Digri Flat Bed">Zero Digri Flat Bed</option>
                                    <option value="Undet Lift 407">Undet Lift 407</option>
                                    <option value="S Lorry Crane Bed">S Lorry Crane Bed</option>
                                </select>
                            </div>
                            <div className="flex items-center mt-4">
                                <label htmlFor="serviceVehicle" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
                                    Service Vehicle
                                </label>
                                <select
                                    id="serviceVehicle"
                                    name="serviceVehicle"
                                    className="form-select flex-1"
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem',
                                        border: '1px solid #ccc',
                                        borderRadius: '5px',
                                        fontSize: '1rem',
                                        outline: 'none',
                                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                    }}
                                    onChange={(e) => handleInputChange('serviceVehicle', e.target.value)}
                                >
                                    <option value=""></option>
                                    <option value="United States">United States</option>
                                    <option value="United Kingdom">United Kingdom</option>
                                    <option value="Zimbabwe">Zimbabwe</option>
                                </select>
                                <Link to="/showrooms/showroom" className="bg-success text-white p-2 ml-2" style={{ borderRadius: '20px' }}>
                                    <IconPlus />
                                </Link>
                            </div>
                            <div className="flex items-center mt-4">
    <label htmlFor="driver" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
        Driver
    </label>
    <div className="form-input flex-1" style={{ position: 'relative', width: '100%' }}>
        <input
            id="driver"
            type="text"
            name="driver"
            className="w-full"
            placeholder="Select your driver"
            style={{
                padding: '0.5rem',
                border: '1px solid #ccc',
                borderRadius: '5px',
                fontSize: '1rem',
                outline: 'none',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
            value={
                selectedDriver
                    ? `${drivers.find((driver) => driver.id === selectedDriver).driverName} - Total Salary: ${
                          selectedDriver
                              ? calculateTotalSalary(
                                    drivers.find((driver) => driver.id === selectedDriver).basicSalary,
                                    distance,
                                    drivers.find((driver) => driver.id === selectedDriver).basicSalaryKm,
                                    drivers.find((driver) => driver.id === selectedDriver).salaryPerKm
                                )
                              : ''
                      }`
                    : ''
            }
            onClick={() => openModal(distance)}
        />
    </div>

                                <ReactModal
                                    isOpen={isModalOpen}
                                    onRequestClose={closeModal}
                                    style={{
                                        overlay: {
                                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                        },
                                        content: {
                                            top: '50%',
                                            left: '50%',
                                            right: 'auto',
                                            bottom: 'auto',
                                            marginRight: '-50%',
                                            transform: 'translate(-50%, -50%)',
                                            borderRadius: '10px',
                                            boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
                                            padding: '20px',
                                        },
                                    }}
                                >
                                    <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Available Drivers for {serviceType}</h2>
                                    <div className="grid grid-cols-1 gap-4">
                                    {drivers.map((driver) => {
    console.log('Driver Object:', driver.id); // Log the driver object here
    return (
        <div key={driver.id} className="flex items-center border border-gray-200 p-2 rounded-lg">
            <table className="panel p-4" style={{ borderCollapse: 'collapse', width: '100%', maxWidth: '600px', margin: 'auto' }}>
                <thead>
                    <tr>
                        <th>Driver Name</th>
                        <th>Total Salary</th>
                        <th>Select</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{driver.driverName}</td>
                        <td>{driver.totalSalary}</td>
                        <td>
                            <input
                                type="radio"
                                name="selectedDriver"
                                value={driver.id}
                                checked={selectedDriver === driver.id}
                                onChange={() => handleInputChange('selectedDriver', driver.id)}
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
})}



</div>

                                    <button onClick={closeModal}>Close</button>
                                </ReactModal>
                            </div>
                            <div className="mt-4 flex items-center">
                                <label htmlFor="vehicleNumber" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
                                    Vehicle Number
                                </label>
                                <input
                                    id="vehicleNumber"
                                    type="text"
                                    name="vehicleNumber"
                                    className="form-input flex-1"
                                    placeholder="Enter vehicle number"
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem',
                                        border: '1px solid #ccc',
                                        borderRadius: '5px',
                                        fontSize: '1rem',
                                        outline: 'none',
                                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                    }}
                                    onChange={(e) => handleInputChange('vehicleNumber', e.target.value)}
                                />
                            </div>
                            <div className="flex items-center mt-4">
                                <label htmlFor="vehicleModel" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
                                    Vehicle Model
                                </label>
                                <select
                                    id="vehicleModel"
                                    name="vehicleModel"
                                    className="form-select flex-1"
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem',
                                        border: '1px solid #ccc',
                                        borderRadius: '5px',
                                        fontSize: '1rem',
                                        outline: 'none',
                                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                    }}
                                    onChange={(e) => handleInputChange('vehicleModel', e.target.value)}
                                >
                                    <option value=""></option>
                                    <option value="United States">United States</option>
                                    <option value="Zimbabwe">Zimbabwe</option>
                                </select>
                            </div>
                            <div className="mt-4 flex items-center">
                                <textarea
                                    id="reciever-name"
                                    name="reciever-name"
                                    className="form-input flex-1"
                                    placeholder="Comments"
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem',
                                        border: '1px solid #ccc',
                                        borderRadius: '5px',
                                        fontSize: '1rem',
                                        outline: 'none',
                                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                    }}
                                    onChange={(e) => handleInputChange('comments', e.target.value)}
                                />
                            </div>
                            <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                                <button
                                    type="button"
                                    onClick={handleAddBooking}
                                    style={{
                                        backgroundColor: '#28a745',
                                        color: '#fff',
                                        padding: '0.5rem',
                                        width: '100%',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Booking;
// const handleAddBooking = async () => {
//     try {
//         const pickupResponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${pickupLocation.lat},${pickupLocation.lng}&key=saaas`);
//         const pickupData = await pickupResponse.json();
//         const pickupPlacename = pickupData.results[0].formatted_address;

//         // Fetch placename for dropoff location
//         const dropoffResponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${dropoffLocation.lat},${dropoffLocation.lng}&key=saaas`);
//         const dropoffData = await dropoffResponse.json();
//         const dropoffPlacename = dropoffData.results[0].formatted_address;

//         const selectedDriverObject = drivers.find((driver) => driver.id === selectedDriver);
//         const driverName = selectedDriverObject ? selectedDriverObject.driverName : '';
//         const totalSalary = calculateTotalSalary(selectedDriverObject.basicSalary, distanceNumeric, selectedDriverObject.salarykm);

//         const bookingData = {
//             ...bookingDetails,
//             driver: driverName,
//             totalSalary: totalSalary,
//             pickupLocation: {
//                 lat: pickupLocation.lat,
//                 lng: pickupLocation.lng,
//                 placename: pickupPlacename,
//             },
//             dropoffLocation: {
//                 lat: dropoffLocation.lat,
//                 lng: dropoffLocation.lng,
//                 placename: dropoffPlacename,
//             },
//         };

//         const docRef = await addDoc(collection(db, 'bookings'), bookingData);
//         console.log('Document written with ID: ', docRef.id);
//         navigate('/bookings/newbooking');
//     } catch (error) {
//         console.error('Error adding document: ', error);
//     }
// };
// const handleAddBooking = async () => {
//     try {
//         // Assume pickupPlacename and dropoffPlacename are obtained before calling this function
//         const selectedDriverObject = drivers.find((driver) => driver.id === selectedDriver);
//         const driverName = selectedDriverObject ? selectedDriverObject.driverName : '';
//         const totalSalary = calculateTotalSalary(selectedDriverObject.basicSalary, distanceNumeric, selectedDriverObject.salarykm);

//         const bookingData = {
//             ...bookingDetails,
//             driver: driverName,
//             totalSalary: totalSalary,
//             pickupLocation: {
//                 lat: pickupLocation.lat,
//                 lng: pickupLocation.lng,
//                 placename: pickupPlacename,
//             },
//             dropoffLocation: {
//                 lat: dropoffLocation.lat,
//                 lng: dropoffLocation.lng,
//                 placename: dropoffPlacename,
//             },
//         };

//         const docRef = await addDoc(collection(db, 'bookings'), bookingData);
//         console.log('Document written with ID: ', docRef.id);
//         navigate('/bookings/newbooking');
//     } catch (error) {
//         console.error('Error adding document: ', error);
//     }
// };
