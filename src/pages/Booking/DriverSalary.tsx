// import React, { useEffect, useState, useRef } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
// import { GoogleMap, LoadScript, Marker, DistanceMatrixService } from '@react-google-maps/api';
// import IconPlus from '../../components/Icon/IconPlus';
// import ReactModal from 'react-modal';

// const mapContainerStyle = {
//     height: '400px',
//     width: '100%',
// };

// const defaultCenter = { lat: 10.8505, lng: 76.2711 };

// const Booking = () => {
//     const db = getFirestore();
//     const navigate = useNavigate();
//     const [pickupClicked, setPickupClicked] = useState(false);
//     const [dropoffClicked, setDropoffClicked] = useState(false);
   
//     const [bookingDetails, setBookingDetails] = useState({
//         location: '',
//         company: '',
//         country:'',
//         fileNumber: '',
//         showroom: '',
//         customerName: '',
//         phoneNumber: '',
//         mobileNumber: '',
//         pickupLocation: '',
//         dropoffLocation: '',
//         serviceType: '',
//         serviceVehicle: '',
//         driver: '',
//         vehicleNumber: '',
//         vehicleModel: '',
//         comments: '',
//     });
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [modalDistance, setModalDistance] = useState([]);

//     const [selectedDriver, setSelectedDriver] = useState(null); // State to store the selected driver

//     const [serviceType, setServiceType] = useState('');

//     // const [selectedOption, setSelectedOption] = useState('');
//     const [pickupLocation, setPickupLocation] = useState(null);
//     const [dropoffLocation, setDropoffLocation] = useState(null);
//     const [distance, setDistance] = useState('');
//     const handlePickupClick = () => {
//         setPickupClicked(true);
//     };

//     const handleDropoffClick = () => {
//         setDropoffClicked(true);
//     };
//     const openModal = (distance) => {
//         setIsModalOpen(true);
//         setModalDistance(distance); // Set the modal distance to the provided value
//         console.log(distance)
//     };
//     const closeModal = () => {
//         setIsModalOpen(false); // Use setIsModalOpen instead of setModalOpen
//     };
    
    
//     const handleInputChange = (field, value) => {
//         setBookingDetails({ ...bookingDetails, [field]: value });
    
//         if (field === 'distance') {
//             openModal(value);
//         } else if (field === 'serviceType') {
//             setServiceType(value);
//             openModal();
//         } else if (field === 'selectedDriver') { // Handle selected driver
//             setSelectedDriver(value); // Update selectedDriver state with the selected driver ID
//         }
//     };
    
    
//     const setupAutocomplete = (inputRef, setter) => {
//         if (!inputRef) return;

//         const autocomplete = new window.google.maps.places.Autocomplete(inputRef);
//         autocomplete.setFields(['geometry']);
//         autocomplete.addListener('place_changed', () => {
//             const place = autocomplete.getPlace();
//             if (place.geometry) {
//                 setter({
//                     lat: place.geometry.location.lat(),
//                     lng: place.geometry.location.lng(),
//                 });
//             }
//         });
//     };

   

//     const handleAddBooking = async () => {
//         try {
//             const bookingData = { ...bookingDetails, driver: selectedDriver }; // Include selectedDriver in booking data
//             const docRef = await addDoc(collection(db, 'bookings'), bookingData);
//             console.log('Document written with ID: ', docRef.id);
//             navigate('/bookings/newbooking');
//         } catch (error) {
//             console.error('Error adding document: ', error);
//         }
//     };
    
//     useEffect(() => {
//         if (pickupLocation && dropoffLocation) {
//             const service = new window.google.maps.DistanceMatrixService();
//             service.getDistanceMatrix(
//                 {
//                     origins: [pickupLocation],
//                     destinations: [dropoffLocation],
//                     travelMode: 'DRIVING',
//                 },
//                 (response, status) => {
//                     if (status === 'OK') {
//                         const distance = response.rows[0].elements[0].distance.text;
//                         setDistance(distance);
//                         setBookingDetails({ ...bookingDetails, distance: distance });
//                     } else {
//                         console.error('Error calculating distance:', status);
//                     }
//                 }
//             );
//         }
//     }, [pickupLocation, dropoffLocation]);
//     const [drivers, setDrivers] = useState([]);
//     const distanceNumeric = parseFloat(distance.replace('km', ''));

//     useEffect(() => {
//         const fetchDrivers = async () => {
//             try {
//                 const driversCollection = collection(db, 'driver');
//                 const snapshot = await getDocs(driversCollection);

//                 const filteredDrivers = snapshot.docs
//                     .map(doc => ({ id: doc.id, ...doc.data() }))
//                     .filter(driver => driver.service === serviceType);

//                 setDrivers(filteredDrivers);
//             } catch (error) {
//                 console.error('Error fetching data:', error);
//             }
//         };

//         if (serviceType && distance) {
//             fetchDrivers().catch(console.error);
//         }
//     }, [db, serviceType, distance]);

//     const calculateTotalSalary = (basicSalary, distance, salaryPerKm) => {
//         if (distance <= 20) {
//             return basicSalary; // If distance is less than or equal to 20 km, return basic salary
//         }
    
//         const basicSalaryPer20Km = basicSalary; // Assuming basic salary is for every 20 km
//         const num20KmIntervals = Math.floor(distance / distance); // Calculate how many intervals of 20 km are there
//         const remainingDistance = distance - 20; // Calculate the remaining distance
//         const totalSalary = basicSalaryPer20Km * num20KmIntervals + remainingDistance * salaryPerKm;
//         return totalSalary;
//     };
//     return (
//         <div>
//             <div style={{ display: 'flex', flexDirection: 'column' }}>
//                 <h5 className="font-semibold text-lg dark:text-white-light">Add Bookings</h5>

//                 <div style={{ padding: '6px', flex: 1, marginTop: '2rem', marginRight: '6rem', marginLeft: '6rem', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', borderRadius: '10px' }}>
//                     <div style={{ display: 'flex', flexWrap: 'wrap', padding: '1rem' }}>
//                         <h5 className="font-semibold text-lg dark:text-white-light mb-5">Book Now</h5>

//                         <div style={{ width: '100%' }}>
//                             <div style={{ display: 'flex', alignItems: 'center', marginTop: '1rem' }}>
//                                 <label htmlFor="country" style={{ marginRight: '0.5rem', marginLeft: '0.5rem', width: '33%', marginBottom: '0', color: '#333' }}>
//                                     Operation Base Location
//                                 </label>
//                                 <select
//                                     id="country"
//                                     name="country"
//                                     style={{
//                                         width: '100%',
//                                         padding: '0.5rem',
//                                         border: '1px solid #ccc',
//                                         borderRadius: '5px',
//                                         fontSize: '1rem',
//                                         outline: 'none',
//                                         boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
//                                     }}
//                                     onChange={(e) => handleInputChange('location', e.target.value)}
//                                 >
//                                     <option value="">Choose Location</option>
//                                     <option value="United States">United States</option>
//                                     <option value="Zimbabwe">Zimbabwe</option>
//                                 </select>
//                             </div>
//                             <div style={{ display: 'flex', alignItems: 'center', marginTop: '1rem' }}>
//                                 <label htmlFor="company" style={{ marginRight: '0.5rem', marginLeft: '0.5rem', width: '33%', marginBottom: '0', color: '#333' }}>
//                                     Company
//                                 </label>
//                                 <select
//                                     id="company"
//                                     name="company"
//                                     style={{
//                                         width: '100%',
//                                         padding: '0.5rem',
//                                         border: '1px solid #ccc',
//                                         borderRadius: '5px',
//                                         fontSize: '1rem',
//                                         outline: 'none',
//                                         boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
//                                     }}
//                                     onChange={(e) => handleInputChange('company', e.target.value)}
//                                 >
//                                     <option value="">Select Company</option>
//                                     <option value="United States">United States</option>
//                                     <option value="Zimbabwe">Zimbabwe</option>
//                                 </select>
//                             </div>
//                             <div className="flex items-center mt-4">
//                                 <label htmlFor="fileNumber" className="ltr:mr-3 rtl:ml-2 w-1/3 mb-0">
//                                     File Number
//                                 </label>
//                                 <input
//                                     id="fileNumber"
//                                     type="text"
//                                     name="fileNumber"
//                                     className="form-input lg:w-[250px] w-2/3"
//                                     placeholder="Enter File Number"
//                                     style={{
//                                         width: '100%',
//                                         padding: '0.5rem',
//                                         border: '1px solid #ccc',
//                                         borderRadius: '5px',
//                                         fontSize: '1rem',
//                                         outline: 'none',
//                                         boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
//                                     }}
//                                     onChange={(e) => handleInputChange('fileNumber', e.target.value)}
//                                 />
//                             </div>
//                             <div className="flex items-center mt-4">
//                                 <label htmlFor="showroom" className="ltr:mr-2 rtl:ml-2 w-1/4 mb-0">
//                                     ShowRoom
//                                 </label>
//                                 <select
//                                     id="showroom"
//                                     name="showroom"
//                                     className="form-select flex-1"
//                                     style={{
//                                         width: '100%',
//                                         padding: '0.5rem',
//                                         border: '1px solid #ccc',
//                                         borderRadius: '5px',
//                                         fontSize: '1rem',
//                                         outline: 'none',
//                                         boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
//                                     }}
//                                     onChange={(e) => handleInputChange('showroom', e.target.value)}
//                                 >
//                                     <option value="">Select ShowRoom</option>
//                                     <option value="United States">United States</option>

//                                     <option value="Zimbabwe">Zimbabwe</option>
//                                 </select>
//                                 <Link to="/showrooms/showroom" className="bg-success text-white p-2 ml-2" style={{ borderRadius: '20px' }}>
//                                     <IconPlus />
//                                 </Link>
//                             </div>
//                             <div className="mt-4 flex items-center">
//                                 <label htmlFor="customerName" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
//                                     Customer Name
//                                 </label>
//                                 <input
//                                     id="customerName"
//                                     type="text"
//                                     name="customerName"
//                                     className="form-input flex-1"
//                                     placeholder="Enter Name"
//                                     style={{
//                                         width: '100%',
//                                         padding: '0.5rem',
//                                         border: '1px solid #ccc',
//                                         borderRadius: '5px',
//                                         fontSize: '1rem',
//                                         outline: 'none',
//                                         boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
//                                     }}
//                                     onChange={(e) => handleInputChange('customerName', e.target.value)}
//                                 />
//                             </div>
//                             <div className="mt-4 flex items-center">
//                                 <label htmlFor="phoneNumber" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
//                                     Phone Number
//                                 </label>
//                                 <input
//                                     id="phoneNumber"
//                                     type="phoneNumber"
//                                     name="phoneNumber"
//                                     className="form-input flex-1"
//                                     placeholder="Enter Phone number"
//                                     style={{
//                                         width: '100%',
//                                         padding: '0.5rem',
//                                         border: '1px solid #ccc',
//                                         borderRadius: '5px',
//                                         fontSize: '1rem',
//                                         outline: 'none',
//                                         boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
//                                     }}
//                                     onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
//                                 />
//                             </div>
//                             <div className="mt-4 flex items-center">
//                                 <label htmlFor="mobileNumber" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
//                                     Mobile Number
//                                 </label>
//                                 <input
//                                     id="mobileNumber"
//                                     type="text"
//                                     name="mobileNumber"
//                                     className="form-input flex-1"
//                                     placeholder="Enter Mobile number"
//                                     style={{
//                                         width: '100%',
//                                         padding: '0.5rem',
//                                         border: '1px solid #ccc',
//                                         borderRadius: '5px',
//                                         fontSize: '1rem',
//                                         outline: 'none',
//                                         boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
//                                     }}
//                                     onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
//                                 />
//                             </div>{' '}
//                             <div style={{ width: '100%' }}>
                                
//                             <div className="flex items-center mt-4">
//                 <label htmlFor="pickupLocation" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
//                     Pickup Location
//                 </label>
//                 <div className="search-box ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
//                     <input
//                         className="form-input flex-1"
//                         style={{
//                             width: '100%',
//                             padding: '0.5rem',
//                             border: '1px solid #ccc',
//                             borderRadius: '5px',
//                             fontSize: '1rem',
//                             outline: 'none',
//                             boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
//                         }}
//                         type="text"
//                         placeholder="Pickup Location"
//                         onFocus={handlePickupClick}
//                         onChange={(e) => setPickupLocation(e.target.value)}
//                     />
//                 </div>
//             </div>
//             <div className="flex items-center mt-4">
//                 <label htmlFor="dropOffLocation" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
//                     Drop-off Location
//                 </label>
//                 <div className="search-box ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
//                     <input
//                         className="form-input flex-1"
//                         style={{
//                             width: '100%',
//                             padding: '0.5rem',
//                             border: '1px solid #ccc',
//                             borderRadius: '5px',
//                             fontSize: '1rem',
//                             outline: 'none',
//                             boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
//                         }}
//                         type="text"
//                         placeholder="Drop-off Location"
//                         onFocus={handleDropoffClick}
//                         onChange={(e) => setDropoffLocation(e.target.value)}
//                     />
//                 </div>
//             </div>
//             {(pickupClicked || dropoffClicked) && ( // Only show map if either pickup or dropoff field is clicked
//                 <LoadScript googleMapsApiKey="AIzaSyDCtC15ypeYqwvjn43ZVKkPsvQfPx9_BJc" libraries={['places']}>
//                     <GoogleMap mapContainerStyle={mapContainerStyle} center={defaultCenter} zoom={8}>
//                         {pickupLocation && <Marker position={pickupLocation} />}
//                         {dropoffLocation && <Marker position={dropoffLocation} />}
//                         {pickupLocation && dropoffLocation && (
//                                             <DistanceMatrixService
//                                                 options={{
//                                                     destinations: [{ lat: dropoffLocation.lat, lng: dropoffLocation.lng }],
//                                                     origins: [{ lat: pickupLocation.lat, lng: pickupLocation.lng }],
//                                                     travelMode: 'DRIVING',
//                                                 }}
//                                                 callback={(response) => {
//                                                     if (response?.rows && response?.rows.length) {
//                                                         const distanceText = response.rows[0]?.elements[0]?.distance?.text;
//                                                         setDistance(distanceText);
//                                                     }
//                                                 }}
//                                             />
//                                         )}                    </GoogleMap>
//                 </LoadScript>
//             )}
//         </div>
//                             <div className="mt-4 flex items-center">
//                                 <label htmlFor="distance" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
//                                     Distance (KM)
//                                 </label>
//                                 <input
//                                     id="distance"
//                                     type="text"
//                                     name="distance"
//                                     className="form-input flex-1"
//                                     style={{
//                                         width: '100%',
//                                         padding: '0.5rem',
//                                         border: '1px solid #ccc',
//                                         borderRadius: '5px',
//                                         fontSize: '1rem',
//                                         outline: 'none',
//                                         boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
//                                     }}
//                                     onChange={(e) => handleInputChange('distance', e.target.value)}
//                                     value={distance} // Bind value to the distance state variable
//                                     readOnly // Make the input field read-only to prevent user input
//                                 />
//                             </div>
//                             <div className="flex items-center mt-4">
//                                 <label htmlFor="serviceType" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
//                                     Service Type
//                                 </label>
//                                 <select
//                                     id="serviceType"
//                                     name="serviceType"
//                                     className="form-select flex-1"
//                                     style={{
//                                         width: '100%',
//                                         padding: '0.5rem',
//                                         border: '1px solid #ccc',
//                                         borderRadius: '5px',
//                                         fontSize: '1rem',
//                                         outline: 'none',
//                                         boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
//                                     }}
//                                     onChange={(e) => handleInputChange('serviceType', e.target.value)}
//                                 >
//                                     <option value="">Select Service Type</option>
//                                     <option value="Flat bed">Flat bed</option>
//                                     <option value="Under Lift">Under Lift</option>
//                                     <option value="Rsr By Car">Rsr By Car</option>
//                                     <option value="Rsr By Bike">Rsr By Bike</option>
//                                     <option value="Custody">Custody</option>
//                                     <option value="Hydra Crane">Hydra Crane</option>
//                                     <option value="Jump start">Jump start</option>
//                                     <option value="Tow Wheeler Fbt">Tow Wheeler Fbt</option>
//                                     <option value="Zero Digri Flat Bed">Zero Digri Flat Bed</option>
//                                     <option value="Undet Lift 407">Undet Lift 407</option>
//                                     <option value="S Lorry Crane Bed">S Lorry Crane Bed</option>
//                                 </select>
//                             </div>
//                             <div className="flex items-center mt-4">
//                                 <label htmlFor="serviceVehicle" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
//                                     Service Vehicle
//                                 </label>
//                                 <select
//                                     id="serviceVehicle"
//                                     name="serviceVehicle"
//                                     className="form-select flex-1"
//                                     style={{
//                                         width: '100%',
//                                         padding: '0.5rem',
//                                         border: '1px solid #ccc',
//                                         borderRadius: '5px',
//                                         fontSize: '1rem',
//                                         outline: 'none',
//                                         boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
//                                     }}
//                                     onChange={(e) => handleInputChange('serviceVehicle', e.target.value)}
//                                 >
//                                     <option value=""></option>
//                                     <option value="United States">United States</option>
//                                     <option value="United Kingdom">United Kingdom</option>
//                                     <option value="Zimbabwe">Zimbabwe</option>
//                                 </select>
//                                 <Link to="/showrooms/showroom" className="bg-success text-white p-2 ml-2" style={{ borderRadius: '20px' }}>
//                                     <IconPlus />
//                                 </Link>
//                             </div>
//                             <div className="flex items-center mt-4">
//     <label htmlFor="driver" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
//         Driver
//     </label>
//     <input
//     id="driver"
//     type="text"
//     name="driver"
//     className="form-input flex-1"
//     placeholder="Select your driver"
//     style={{
//         width: '100%',
//         padding: '0.5rem',
//         border: '1px solid #ccc',
//         borderRadius: '5px',
//         fontSize: '1rem',
//         outline: 'none',
//         boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
//     }}
//     value={selectedDriver ? drivers.find(driver => driver.id === selectedDriver).driverName : ''} // Display selected driver's name
//     onClick={() => openModal(distance)}
// />


// <ReactModal
//     isOpen={isModalOpen}
//     onRequestClose={closeModal}
//     style={{
//         overlay: {
//             backgroundColor: 'rgba(0, 0, 0, 0.5)',
//         },
//         content: {
//             top: '50%',
//             left: '50%',
//             right: 'auto',
//             bottom: 'auto',
//             marginRight: '-50%',
//             transform: 'translate(-50%, -50%)',
//             borderRadius: '10px',
//             boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
//             padding: '20px',
//         },
//     }}
// >
//     {/* Add your modal content here */}
//     <h2>Select Driver</h2>
//     <p>Service Type: {serviceType}</p> {/* Display service type in the modal */}
//     <div className="grid xl:grid-cols-1 gap-6 grid-cols-1">
//             <h2 style={{ textAlign: 'center' }}>Available Drivers of {serviceType} {distance}</h2>
//             {drivers.map((driver) => (
//                 <div key={driver.id} className="panel">
//                     <table className="panel p-4" style={{ borderCollapse: 'collapse', width: '100%', maxWidth: '600px', margin: 'auto' }}>
//                         <thead>
//                             <tr>
//                                 <th>Driver Name</th>
//                                 <th>Basic Salary</th>
//                                 <th>Salary/Km</th>
//                                 <th>Total Salary</th>
//                                 <th>Select</th> {/* Add a column for selection */}
//                             </tr>
//                         </thead>
//                         <tbody>
//                             <tr>
//                                 <td>{driver.driverName}</td>
//                                 <td>{driver.basicSalary}</td>
//                                 <td>{driver.salarykm}</td>
//                                 <td>{Number(calculateTotalSalary(driver.basicSalary, distanceNumeric, driver.salarykm))}</td>
//                                 <td>
//                                 <input
//     type="radio"
//     name="selectedDriver"
//     value={driver.id}
//     checked={selectedDriver === driver.id}
//     onChange={() => handleInputChange('selectedDriver', driver.id)} // Update selectedDriver state when clicked
// />

//                                 </td>
//                             </tr>
//                         </tbody>
//                     </table>
//                 </div>
//             ))}
//         </div>
//             <button onClick={closeModal}>Close</button>
// </ReactModal>


   
// </div>

//                             <div className="mt-4 flex items-center">
//                                 <label htmlFor="vehicleNumber" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
//                                     Vehicle Number
//                                 </label>
//                                 <input
//                                     id="vehicleNumber"
//                                     type="text"
//                                     name="vehicleNumber"
//                                     className="form-input flex-1"
//                                     placeholder="Enter vehicle number"
//                                     style={{
//                                         width: '100%',
//                                         padding: '0.5rem',
//                                         border: '1px solid #ccc',
//                                         borderRadius: '5px',
//                                         fontSize: '1rem',
//                                         outline: 'none',
//                                         boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
//                                     }}
//                                     onChange={(e) => handleInputChange('vehicleNumber', e.target.value)}
//                                 />
//                             </div>
//                             <div className="flex items-center mt-4">
//                                 <label htmlFor="vehicleModel" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
//                                     Vehicle Model
//                                 </label>
//                                 <select
//                                     id="vehicleModel"
//                                     name="vehicleModel"
//                                     className="form-select flex-1"
//                                     style={{
//                                         width: '100%',
//                                         padding: '0.5rem',
//                                         border: '1px solid #ccc',
//                                         borderRadius: '5px',
//                                         fontSize: '1rem',
//                                         outline: 'none',
//                                         boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
//                                     }}
//                                     onChange={(e) => handleInputChange('vehicleModel', e.target.value)}
//                                 >
//                                     <option value=""></option>
//                                     <option value="United States">United States</option>
//                                     <option value="Zimbabwe">Zimbabwe</option>
//                                 </select>
//                             </div>
//                             <div className="mt-4 flex items-center">
//                                 <textarea
//                                     id="reciever-name"
//                                     name="reciever-name"
//                                     className="form-input flex-1"
//                                     placeholder="Comments"
//                                     style={{
//                                         width: '100%',
//                                         padding: '0.5rem',
//                                         border: '1px solid #ccc',
//                                         borderRadius: '5px',
//                                         fontSize: '1rem',
//                                         outline: 'none',
//                                         boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
//                                     }}
//                                     onChange={(e) => handleInputChange('comments', e.target.value)}
//                                 />
//                             </div>
//                             <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
//                                 <button
//                                     type="button"
//                                     onClick={handleAddBooking}
//                                     style={{
//                                         backgroundColor: '#28a745',
//                                         color: '#fff',
//                                         padding: '0.5rem',
//                                         width: '100%',
//                                         border: 'none',
//                                         borderRadius: '5px',
//                                         cursor: 'pointer',
//                                     }}
//                                 >
//                                     Save
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Booking;
