import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc } from 'firebase/firestore';
import { GoogleMap, LoadScript, Marker, DistanceMatrixService } from '@react-google-maps/api';
import ReactModal from 'react-modal';
import { v4 as uuid } from 'uuid';
import { googleMapsApiKey ,googleMapsLibraries} from '../../config/config';
import { query, where } from 'firebase/firestore';
import { serverTimestamp } from 'firebase/firestore';
import useGoogleMaps from './GoogleMaps';
import MyMapComponent from './MyMapComponent';

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
        const newBookingId = uuid().substring(0, 6);
        setBookingId(newBookingId);
    }, []);
    const googleMapsLoaded = useGoogleMaps(googleMapsApiKey);

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
    const { state } = useLocation();
    const [map, setMap] = useState(null); // Initialize map state

    const [idnumber, setIdnumber] = useState('');
    const [comments, setComments] = useState('');
    const [fileNumber, setFileNumber] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [company, setCompany] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [serviceVehicle, setServiceVehicle] = useState('');
    const [vehicleNumber, setVehicleNumber] = useState('');
    const [vehicleModel, setVehicleModel] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [serviceDetails, setServiceDetails] = useState('');
    const [serviceType, setServiceType] = useState('');
    const [pickupLocation, setPickupLocation] = useState(null);
    const [dropoffLocation, setDropoffLocation] = useState(null);
    const [distance, setDistance] = useState('');
    const [drivers, setDrivers] = useState([]);
    const distanceNumeric = parseFloat(distance.replace('km', ''));
    const [editData, setEditData] = useState(null);
    useEffect(() => {
        if (state && state.editData) {
            setEditData(state.editData);
            setBookingId(state.editData.bookingId || '');
            setComments(state.editData.comments || '');
            setFileNumber(state.editData.fileNumber || '');
            setCompany(state.editData.company || '');
            setCustomerName(state.editData.customerName || '');
            setPhoneNumber(state.editData.phoneNumber || '');
            setMobileNumber(state.editData.mobileNumber || '');
            setVehicleNumber(state.editData.vehicleNumber || '');
            setServiceVehicle(state.editData.serviceVehicle || '');
            setVehicleModel(state.editData.vehicleModel || '');
            setDistance(state.editData.distance || '');
            setSelectedDriver(state.editData.selectedDriver || '');
            setPickupLocation(state.editData.pickupLocation || '');
            setServiceType(state.editData.serviceType || '');
            setTotalSalary(state.editData.totalSalary || '');
            setDropoffLocation(state.editData.dropoffLocation || '');

        }
    }, [state]);

    console.log("sgy",)
    const openModal = () => {
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
    };
    const handleInputChange = (field, value) => {
        console.log('Field:', field);
        console.log('Value:', value);
        
    switch (field) {
        case 'customerName':
            setCustomerName(value);
            break;
        case 'fileNumber':
            setFileNumber(value);
            break;
            case 'company':
                setCompany(value);
                console.log('Company:', value); // Add this line for debugging
                if (value === 'self') {
                    setFileNumber(`RSA${bookingId}`);
                    console.log('File Number:', `RSA${bookingId}`); // Add this line for debugging
                    setBookingDetails({ ...bookingDetails, fileNumber: `RSA${bookingId}` });
                } else if (value === 'RSA') {
                    setBookingDetails({ ...bookingDetails }); // You can omit fileNumber from updating
                }
                break;
            
            case 'bookingId':
                setBookingId(value);
                break;
            case 'comments':
                setComments(value);
                break;
            case 'distance':
                setDistance(value);
                break;
            case 'serviceVehicle':
                setServiceVehicle(value);
                break;
            case 'dropoffLocation':
                setDropoffLocation(value);
                break;
            case 'mobileNumber':
                setMobileNumber(value);
                break;
            case 'phoneNumber':
                setPhoneNumber(value);
                break;
            case 'pickupLocation':
                setPickupLocation(value);
                break;
            case 'totalSalary':
                setTotalSalary(value);
                break;
            case 'vehicleModel':
                setVehicleModel(value);
                break;
            case 'vehicleNumber':
                setVehicleNumber(value);
                break;
            default:
                break;
        }
        
        if (field === 'distance') {
            openModal(value);
        } else if (field === 'serviceType') {
            setServiceType(value);
            openModal();
        } else if (field === 'selectedDriver') {
            console.log('Selected Driver ID:', value);
            setSelectedDriver(value);
        }
    };
    
    const setupAutocomplete = (inputRef, setter) => {
        if (!inputRef) return;

        const autocomplete = new window.google.maps.places.Autocomplete(inputRef);
        autocomplete.setFields(['geometry', 'name']); 
        autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (place.geometry) {
                const location = {
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng(),
                    name: place.name,
                };
                setter(location);
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

   
    

    useEffect(() => {
        const fetchDrivers = async () => {
            if (!serviceType || !serviceDetails) {
                console.log('Service details not found, cannot proceed with fetching drivers.');
                setDrivers([]);
                return;
            }

            try {
                const driversCollection = collection(db, 'driver');
                const snapshot = await getDocs(driversCollection);
                const filteredDrivers = snapshot.docs
                    .map((doc) => {
                        const driverData = doc.data();
                        if (!driverData.selectedServices.includes(serviceType)) {
                            return null;
                        }

                        const totalSalary = calculateTotalSalary(serviceDetails.salary, driverData.distance, serviceDetails.basicSalaryKM, serviceDetails.salaryPerKM);

                        return {
                            id: doc.id,
                            ...driverData,
                            totalSalary,
                        };
                    })
                    .filter(Boolean);

                console.log('Filtered Drivers:', filteredDrivers);
                setDrivers(filteredDrivers);
            } catch (error) {
                console.error('Error fetching drivers:', error);
            }
        };

        if (serviceType && serviceDetails) {
            fetchDrivers().catch(console.error);
        } else {
            setDrivers([]);
        }
    }, [db, serviceType, serviceDetails]);

    const [totalSalary, setTotalSalary] = useState(0);

    useEffect(() => {
        const fetchServiceDetails = async () => {
            if (!serviceType) {
                console.log('No service type selected');
                setServiceDetails({});
                return;
            }

            try {
                const serviceQuery = query(collection(db, 'service'), where('name', '==', serviceType));
                const snapshot = await getDocs(serviceQuery);
                if (snapshot.empty) {
                    console.log('No matching service details found.');
                    setServiceDetails({});
                    return;
                }
                const details = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))[0];
                console.log('Fetched service details: ', details);
                setServiceDetails(details);
            } catch (error) {
                console.error('Error fetching service details:', error);
                setServiceDetails({});
            }
        };

        fetchServiceDetails();
    }, [db, serviceType]);

    const [pickupDistances, setPickupDistances] = useState([]);
    console.log("first",pickupDistances)
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Radius of the Earth in kilometers
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        return distance;
    };

    useEffect(() => {
        const fetchDrivers = async () => {
            try {
                const driversCollection = collection(db, 'driver');
                const snapshot = await getDocs(driversCollection);

                if (!serviceDetails) {
                    console.log('Service details not found, cannot proceed with fetching drivers.');
                    return;
                }

                const filteredDrivers = snapshot.docs
                    .map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                        distanceNumeric: doc.data().distance, // Assuming distance is stored in the Firestore document
                    }))
                    .filter((driver) => driver.selectedServices && driver.selectedServices.includes(serviceType))
                    .map((driver) => ({
                        ...driver,
                        totalSalary: calculateTotalSalary(serviceDetails.salary, driver.distanceNumeric, serviceDetails.basicSalaryKM, serviceDetails.salaryPerKM),
                    }));

                const total = filteredDrivers.reduce((acc, driver) => acc + driver.totalSalary, 0);
                setTotalSalary(total);

                console.log('Filtered Drivers:', filteredDrivers);

                // Find current location data from the filtered drivers
                const currentLocationDriver = filteredDrivers.find(driver => driver.currentLocation);
                if (currentLocationDriver && currentLocationDriver.currentLocation.latitude && currentLocationDriver.currentLocation.longitude) {
                    const lat1 = currentLocationDriver.currentLocation.latitude;
                    const lng1 = currentLocationDriver.currentLocation.longitude;

                    const pickupDistances = filteredDrivers.map(driver => {
                        return calculateDistance(pickupLocation.lat, pickupLocation.lng, lat1, lng1);
                    });

                    console.log('Pickup Distances:', pickupDistances);

                    setPickupDistances(pickupDistances);
                } else {
                    console.log('Current location data not found or incomplete in the drivers collection.');
                }

                setDrivers(filteredDrivers);
            } catch (error) {
                console.error('Error fetching drivers:', error);
            }
        };

        if (serviceType && serviceDetails) {
            fetchDrivers().catch(console.error);
        } else {
            setDrivers([]);
        }
    }, [serviceType, serviceDetails, pickupLocation]);

    useEffect(() => {
        if (pickupDistances.length > 0) {
            // Calculate total salary using pickup distances
            const totalSalaries = drivers.map((driver, index) => {
                const numericPickupDistance = pickupDistances[index];
                console.log(distanceNumeric);

                return calculateTotalSalary(
                    serviceDetails.salary,
                    distanceNumeric,
                    serviceDetails.basicSalaryKM,
                    serviceDetails.salaryPerKM,
                    numericPickupDistance
                );
            });
            // Sum up the total salaries
            const total = totalSalaries.reduce((acc, salary) =>  salary, 0);
            setTotalSalary(total);
        }
    }, [pickupDistances, drivers, serviceDetails]);
    const [totalDistance, setTotalDistance] = useState(0);
    const calculateTotalSalary = (salary, distanceNumeric, kmValueNumeric, perKmValueNumeric, pickupDistance) => {
        const numericBasicSalary = Number(salary);
    
        // Ensure distanceNumeric and pickupDistance are valid numbers
        if (isNaN(distanceNumeric) || isNaN(pickupDistance)) {
            console.error('Invalid distance or pickupDistance:', { distanceNumeric, pickupDistance });
            return numericBasicSalary;
        }
    
        // Adding the pickupDistance to the numericDistance
        const numericDistanceWithPickup = distanceNumeric + pickupDistance;
        console.log("Numeric Distance with Pickup:", numericDistanceWithPickup);
        setTotalDistance(numericDistanceWithPickup);

        const numericBasicSalaryKM = Number(kmValueNumeric);
        const numericSalaryPerKM = Number(perKmValueNumeric);
    
        if (numericDistanceWithPickup > numericBasicSalaryKM) {
            return numericBasicSalary + (numericDistanceWithPickup - numericBasicSalaryKM) * numericSalaryPerKM;
        } else {
            return numericBasicSalary;
        }
    };
    
    const addOrUpdateItem = async () => {
        try {
            const selectedDriverObject = drivers.find((driver) => driver.id === selectedDriver);
            const driverName = selectedDriverObject ? selectedDriverObject.driverName : '';
            // const totalSalary = selectedDriverObject ? selectedDriverObject.totalSalary : '';
            const currentDate = new Date();
            const dateTime = currentDate.toLocaleString();
            let fileNumber;

        if (company === 'self') {
            fileNumber = `RSA${bookingId}`;
        } else if (company === 'rsa') {
            fileNumber = bookingDetails.fileNumber || ''; // Use the existing fileNumber if available, otherwise set to empty string
        } else {
            fileNumber = ''; // Reset file number if the company is neither 'self' nor 'rsa'
        }
            const bookingData = {
                ...bookingDetails,
                driver: driverName,
                totalSalary: totalSalary,
                pickupLocation: pickupLocation,
                dropoffLocation: dropoffLocation,
                status: 'booking added',
                dateTime: dateTime,
                bookingId: `RSA${bookingId}`,
                createdAt: serverTimestamp() ,
                comments: comments,
                totalDistance: totalDistance, // Add total distance here

                company: company,
                customerName: customerName,
                mobileNumber:mobileNumber,
                phoneNumber:phoneNumber,
                serviceType:serviceType,
                serviceVehicle:serviceVehicle,
                vehicleModel:vehicleModel,
                vehicleNumber:vehicleNumber,
                fileNumber:fileNumber,
                selectedDriver: selectedDriver,
                
            };
    
            console.log('Data to be added/updated:', bookingData); // Log the data before adding or updating
    
            const docRef = await addDoc(collection(db, 'bookings'), bookingData);
            console.log('Document written with ID: ', docRef.id); // Log the document ID after it's added
    
            if (editData) {
                const docRef = doc(db, 'bookings', editData.id);
                await updateDoc(docRef, bookingData);
                console.log('Document updated');
            } else {
                console.log('Document added');
            }
    
            navigate('/bookings/newbooking');
        } catch (e) {
            console.error('Error adding/updating document: ', e);
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
                            value={company}
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
                    {company === 'self' && (
                        <div className="flex items-center mt-4">
                            <label htmlFor="fileNumber" className="ltr:mr-3 rtl:ml-2 w-1/3 mb-0">
                                File Number
                            </label>
                            <h5 className="font-semibold text-lg dark:text-white-light">
                                R<span className="text-danger">S</span>A{bookingId}
                            </h5>
                        </div>
                    )}
                    {company !== 'self' && (
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
                                value={fileNumber}
                                onChange={(e) => handleInputChange('fileNumber', e.target.value)}
                            />
                        </div>
                    )}


{/* </div> */}

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
                                    value={customerName}
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
                                    value={phoneNumber}
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
                                    value={mobileNumber}
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
                                  
                            {googleMapsLoaded && (
    <div>
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
                    value={pickupLocation ? pickupLocation.name : ''}
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
                    value={dropoffLocation ? dropoffLocation.name : ''}
                />
                {dropoffLocation && <div>{`dropoffLocation Lat/Lng: ${dropoffLocation.lat}, ${dropoffLocation.lng}`}</div>}
            </div>
        </div>
        {/* Your Google Maps components */}
        <GoogleMap mapContainerStyle={mapContainerStyle} center={defaultCenter} onLoad={(map) => setMap(map)}>
            <MyMapComponent map={map} pickupLocation={pickupLocation} dropoffLocation={dropoffLocation} />
        </GoogleMap>
    </div>
)}


                            </div>
                            <div className="mt-4 flex items-center">
                                <label htmlFor="distance" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
                                    Distance (KM)
                                </label>
                                <input
                                    id="distance"
                                    type="string"
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
                                    value={serviceType}
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
        Service Vehicle Number
    </label>
    <input
        id="serviceVehicle"
        type="text"
        name="serviceVehicle"
        className="form-input flex-1"
        placeholder="Enter Service Vehicle Number"
        value={serviceVehicle}
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
    />
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
                                        value={selectedDriver && drivers.find((driver) => driver.id === selectedDriver)?.driverName}
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
            transform: 'translate(-50%, -50%)',
            borderRadius: '10px',
            maxWidth: '90vw',
            maxHeight: '80vh', 
            boxShadow: '0 0 20px rgba(0, 0, 0, 0.7)',
            padding: '20px',
            overflow: 'auto', 
        },
    }}
>
    <div style={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 999 }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Available Drivers for {serviceType}</h2>
        <button onClick={closeModal} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-1" style={{ marginLeft: 'auto', marginRight: '20px' }}>
            OK
        </button>
    </div>

    <div style={{ marginTop: '10px' }}>
    <div className="grid grid-cols-1 gap-4">
    {drivers.map((driver, index) => (
                <div key={driver.id} className="flex items-center border border-gray-200 p-2 rounded-lg">
                    <table className="panel p-4 w-full">
                        <thead>
                            <tr>
                                <th>Driver Name</th>
                                <th>Total Amount</th>
                                <th>Distance to Pickup (km)</th>
                                <th>Select</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{driver.driverName || 'Unknown Driver'}</td>
                                <td className="text-danger">{totalSalary}</td>
                                <td>{pickupDistances[index]} km</td> {/* Display pickup distance in km */}
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
            ))}
    </div>
</div>



</ReactModal>

                            </div>
                            
                            <React.Fragment>
                                <div className="mt-4 flex items-center">
                                    <label htmlFor="totalSalary" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
                                        Total Salary
                                    </label>
                                    <div className="form-input flex-1">
                                        <input
                                            id="totalSalary"
                                            type="text"
                                            name="totalSalary"
                                            className="w-full text-danger text-bold"
                                            style={{
                                                padding: '0.5rem',
                                                border: '1px solid #ccc',
                                                borderRadius: '5px',
                                                fontSize: '1rem',
                                                outline: 'none',
                                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                            }}
                                            value={totalSalary}
                                            readOnly
                                        />
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center">
        <label htmlFor="totalDistance" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
            Total Distance
        </label>
        <div className="form-input flex-1">
            <input
                id="totalDistance"
                type="text"
                name="totalDistance"
                className="w-full text-danger text-bold"
                style={{
                    padding: '0.5rem',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    fontSize: '1rem',
                    outline: 'none',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                }}
                value={totalDistance} // Bind value to totalDistance state
                readOnly
            />
        </div>
    </div>

                            </React.Fragment>
                            <div className="mt-4 flex items-center">
                                <label htmlFor="vehicleNumber" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
                                   Customer Vehicle Number
                                </label>
                                <input
                                    id="vehicleNumber"
                                    type="text"
                                    name="vehicleNumber"
                                    className="form-input flex-1"
                                    placeholder="Enter vehicle number"
                                    value={vehicleNumber}
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
                                    Brand Name
                                </label>
                                <input
                                    id="vehicleModel"
                                    name="vehicleModel"
                                    className="form-input flex-1"
                                    value={vehicleModel}
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
                                />
                                    
                                
                            </div>
                            <div className="mt-4 flex items-center">
                                <textarea
                                    id="reciever-name"
                                    name="reciever-name"
                                    className="form-input flex-1"
                                    placeholder="Comments"
                                    value={comments}
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
                                {/* <button
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
                                </button> */}
                                 <button type="button" className="btn btn-primary" onClick={addOrUpdateItem}   style={{
                                        backgroundColor: '#28a745',
                                        color: '#fff',
                                        padding: '0.5rem',
                                        width: '100%',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                    }}>
                {editData ? 'Update' : 'Save'}
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

