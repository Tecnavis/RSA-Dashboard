import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import IconPlus from '../../components/Icon/IconPlus';
import IconMapPin from '../../components/Icon/IconMapPin';
import { getFirestore, collection, addDoc } from 'firebase/firestore'; // Import necessary Firestore functions

const Booking = () => {
    const dispatch = useDispatch();
    const db = getFirestore(); // Get Firestore instance
const navigate = useNavigate()
    useEffect(() => {
        dispatch(setPageTitle('Booking Add'));
    }, [dispatch]);

    const [bookingDetails, setBookingDetails] = useState({
        location: '',
        company: '',
        fileNumber: '',
        showroom: '',
        customerName: '',
        phoneNumber: '',
        mobileNumber: '',
        pickupLocation: '',
        dropOffLocation: '',
        distance: '',
        serviceType: '',
        serviceVehicle: '',
        driver: '',
        vehicleNumber: '',
        vehicleModel: '',
        comments: '',
    });

    const handleInputChange = (field, value) => {
        setBookingDetails({ ...bookingDetails, [field]: value });
    };

    const handleAddBooking = async () => {
        try {
            // Add booking details to the Firestore collection
            const docRef = await addDoc(collection(db, 'bookings'), bookingDetails);
            console.log('Booking added with ID: ', docRef.id);

            // Optionally, you can clear the form after successful addition
            setBookingDetails({
                location: '',
                company: '',
                fileNumber: '',
                showroom: '',
                customerName: '',
                phoneNumber: '',
                mobileNumber: '',
                pickupLocation: '',
                dropOffLocation: '',
                distance: '',
                serviceType: '',
                serviceVehicle: '',
                driver: '',
                vehicleNumber: '',
                vehicleModel: '',
                comments: '',
            });
navigate("/bookings/newbooking")
            // You may want to redirect the user to a different page after adding the booking
            // history.push('/bookings');
        } catch (error) {
            console.error('Error adding document: ', error);
        }
    };
    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h5 className="font-semibold text-lg dark:text-white-light">Add Bookings </h5>

            <div style={{ padding: '6px', flex: 1, marginTop: '2rem', marginRight: '6rem', marginLeft: '6rem', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', borderRadius: '10px' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', padding: '1rem' }}>
                    <h5 className="font-semibold text-lg dark:text-white-light mb-5">Book Now</h5>

                    <div style={{ width: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginTop: '1rem' }}>
                            <label htmlFor="country" style={{ marginRight: '0.5rem', marginLeft: '0.5rem', width: '33%', marginBottom: '0', color: '#333' }}>
                                Operation Base Location
                            </label>
                            <select
                                id="country"
                                name="country"
                                style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    border: '1px solid #ccc',
                                    borderRadius: '5px',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                }}
                                onChange={(e) => handleInputChange('location', e.target.value)}
                            >
                                <option value="">Choose Location</option>
                                <option value="United States">United States</option>
                                <option value="Zambia">Zambia</option>
                                <option value="Zimbabwe">Zimbabwe</option>
                            </select>
                        </div>
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
                                <option value="United States">United States</option>
                                <option value="Zambia">Zambia</option>
                                <option value="Zimbabwe">Zimbabwe</option>
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
                        <div className="flex items-center mt-4">
                            <label htmlFor="showroom" className="ltr:mr-2 rtl:ml-2 w-1/4 mb-0">
                                ShowRoom
                            </label>
                            <select
                                id="showroom"
                                name="showroom"
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
                                onChange={(e) => handleInputChange('showroom', e.target.value)}
                            >
                                <option value="">Select ShowRoom</option>
                                <option value="United States">United States</option>
                                <option value="United Kingdom">United Kingdom</option>
                                <option value="Canada">Canada</option>

                                <option value="Zambia">Zambia</option>
                                <option value="Zimbabwe">Zimbabwe</option>
                            </select>
                            <Link to="/showrooms/showroom" className="bg-success text-white p-2 ml-2" style={{ borderRadius: '20px' }}>
                                <IconPlus />
                            </Link>
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
                        </div>

                        <div className="mt-4 flex items-center">
                            <label htmlFor="pickupLocation" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
                                Pickup Location
                            </label>
                            <input
                                id="pickupLocation"
                                type="text"
                                name="pickupLocation"
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
                                onChange={(e) => handleInputChange('pickupLocation', e.target.value)}

                            />
                            <IconMapPin className="ml-2 text-primary" />
                        </div>

                        <div className="mt-4 flex items-center">
                            <label htmlFor="dropOffLocation" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
                                Drop off Location
                            </label>
                            <input
                                id="dropOffLocation"
                                type="text"
                                name="dropOffLocation"
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
                                onChange={(e) => handleInputChange('dropOffLocation', e.target.value)}

                            />
                            <IconMapPin className="ml-2 text-primary" />
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
                                <option value=""></option>
                                <option value="United States">Flat bed</option>
                                <option value="United Kingdom">Under Lift</option>

                                <option value="Zambia">Rsr By Car</option>
                                <option value="Zimbabwe">Rsr By Bike</option>
                                <option value="United Kingdom">Custody</option>

                                <option value="United Kingdom">Hydra Crane</option>

                                <option value="United Kingdom">Jump start</option>

                                <option value="United Kingdom">Tow Wheeler Fbt</option>

                                <option value="United Kingdom">Zero Digri Flat Bed</option>

                                <option value="United Kingdom">Undet Lift 407</option>

                                <option value="United Kingdom">S Lorry Crane Bed</option>
                            </select>
                            <Link to="/showrooms/showroom" className="bg-success text-white p-2 ml-2" style={{ borderRadius: '20px' }}>
                                <IconPlus />
                            </Link>
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

                                <option value="Zambia">Zambia</option>
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
                            <select
                                id="driver"
                                name="driver"
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
                                onChange={(e) => handleInputChange('driver', e.target.value)}

                            >
                                <option value=""></option>
                                <option value="United States">United States</option>
                                <option value="United Kingdom">United Kingdom</option>
                                <option value="Canada">Canada</option>

                                <option value="Zambia">Zambia</option>
                                <option value="Zimbabwe">Zimbabwe</option>
                            </select>
                            <Link to="/users/driver" className="bg-success text-white p-2 ml-2" style={{ borderRadius: '20px' }}>
                                <IconPlus />
                            </Link>
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
                                <option value="United Kingdom">United Kingdom</option>
                                <option value="Canada">Canada</option>

                                <option value="Zambia">Zambia</option>
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
    );
};

export default Booking;
