import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc } from 'firebase/firestore';
import { GoogleMap } from '@react-google-maps/api';
import ReactModal from 'react-modal';
import { v4 as uuid } from 'uuid';
import { query, where } from 'firebase/firestore';
import { serverTimestamp } from 'firebase/firestore';
import useGoogleMaps from './GoogleMaps';
import MyMapComponent from './MyMapComponent';
import VehicleSection from './VehicleSection';

interface Showroom {
    id: string;
    name: string;
    // other properties
}
const Booking = () => {
    const db = getFirestore();
    const navigate = useNavigate();
    const [bookingId, setBookingId] = useState<string>('');
    useEffect(() => {
        const newBookingId = uuid().substring(0, 8);
        setBookingId(newBookingId);
    }, []);
    const googleMapsLoaded = useGoogleMaps();

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
        vehicleSection:'',
        comments: '',
    });
    const { state } = useLocation();
    const [map, setMap] = useState(null); 

    const [comments, setComments] = useState('');
    const [fileNumber, setFileNumber] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [company, setCompany] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [serviceVehicle, setServiceVehicle] = useState('');
    const [vehicleNumber, setVehicleNumber] = useState('');
    const [vehicleModel, setVehicleModel] = useState('');
    const [vehicleSection, setVehicleSection] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [serviceDetails, setServiceDetails] = useState('');
    const [serviceType, setServiceType] = useState('');
    const [pickupLocation, setPickupLocation] = useState(null);
    const [dropoffLocation, setDropoffLocation] = useState(null);
    const [baseLocation, setBaseLocation] = useState(null);  
    
    const [showrooms, setShowrooms] = useState<Showroom[]>([]);
    const [selectedShowroom, setSelectedShowroom] = useState('');
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
            setVehicleSection(state.editData.vehicleSection || '');

            
            setDistance(state.editData.distance || '');
            setSelectedDriver(state.editData.selectedDriver || '');
            setBaseLocation(state.editData.baseLocation || '');
            setShowrooms(state.editData.showrooms || []);
            
            setSelectedShowroom(state.editData.selectedShowroom || '');

            setPickupLocation(state.editData.pickupLocation || '');
            setServiceType(state.editData.serviceType || '');
            setTotalSalary(state.editData.totalSalary || '');
            setDropoffLocation(state.editData.dropoffLocation || '');
      
    }
    }, [state]);

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
                setCustomerName(value || '');
                break;
        case 'company':
                    setCompany(value);
                    setFileNumber(value === 'self' ? bookingId : '');
                    break;
         case 'fileNumber':
                    setFileNumber(value || '');
                    break;
            case 'bookingId':
                setBookingId(value || '');
                break;
            case 'comments':
                setComments(value || '');
                break;
            case 'distance':
                setDistance(value || '');
                openModal();
                break;
            case 'serviceVehicle':
                setServiceVehicle(value || '');
                break;
            case 'dropoffLocation':
                setDropoffLocation(value || '');
                break;
            case 'mobileNumber':
                setMobileNumber(value || '');
                break;
            case 'phoneNumber':
                setPhoneNumber(value || '');
                break;
            case 'pickupLocation':
                setPickupLocation(value || '');
                break;
            case 'totalSalary':
                setTotalSalary(value || '');
                break;
                
                case 'vehicleSection':
                    setVehicleSection(value || '');
                    break;
            case 'vehicleModel':
                setVehicleModel(value || '');
                break;
                case 'baseLocation':  
                setBaseLocation(value || '');
                break;
            case 'selectedDriver':
                console.log('Selected Driver ID:', value);
                setSelectedDriver(value);
                // Calculate total salary for the selected driver
                const selectedDriverTotalSalary = calculateTotalSalary(
                    serviceDetails.salary,
                    totalDistances.find((dist) => dist.driverId === value)?.totalDistance || 0,
                    serviceDetails.basicSalaryKM,
                    serviceDetails.salaryPerKM
                );
                // Update the Total Salary field with the calculated total salary
                setTotalSalary(selectedDriverTotalSalary);
                const selectedDriverTotalDistance = totalDistances.find(dist => dist.driverId === value)?.totalDistance || 0;
                setTotalDistance(selectedDriverTotalDistance);
                break;
                
            case 'vehicleNumber':
                setVehicleNumber(value || '');
                break;
                case 'showrooms':
                    setShowrooms(value || '');
                    break;
            default:
                break;
        }

        if (field === 'distance') {
            openModal(value);
        } else if (field === 'serviceType') {
            setServiceType(value || '');
            openModal();
        } else if (field === 'selectedDriver') {
            console.log('Selected Driver ID:', value);
            setSelectedDriver(value || '');
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
        setupAutocomplete(document.getElementById('baseLocationInput'), setBaseLocation);
        setupAutocomplete(document.getElementById('pickupLocationInput'), setPickupLocation);
        setupAutocomplete(document.getElementById('dropoffLocationInput'), setDropoffLocation);
    }, []);
    
    useEffect(() => {
        if (baseLocation && pickupLocation && dropoffLocation) {
            const service = new window.google.maps.DistanceMatrixService();
    
            const origins = [baseLocation, pickupLocation, dropoffLocation];
            const destinations = [pickupLocation, dropoffLocation, baseLocation];
    
            service.getDistanceMatrix(
                {
                    origins,
                    destinations,
                    travelMode: 'DRIVING',
                },
                (response, status) => {
                    if (status === 'OK') {
                        const distances = response.rows.map((row, index) => {
                            return row.elements[index].distance.value / 1000; // Distance in km
                        });
                        console.log('Distances:', distances);
    
                        const totalDistance = distances.reduce((acc, curr) => acc + curr, 0);
                        console.log('Total Distance:', totalDistance);
    
                        setDistance(`${totalDistance} km`);
                        setBookingDetails({ ...bookingDetails, distance: `${totalDistance} km` });
                    } else {
                        console.error('Error calculating distances:', status);
                    }
                }
            );
        }
    }, [baseLocation, pickupLocation, dropoffLocation]);
    
    

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

                        return {
                            id: doc.id,
                            ...driverData,
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

    const [totalSalary, setTotalSalary] = useState([]);

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
    console.log('first', pickupDistances);
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; 
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        return distance;
    };
    const driversWithDistances = drivers.map((driver, index) => ({
        driver,
        pickupDistance: pickupDistances[index] !== null ? pickupDistances[index] : Infinity,
    }));
    
    // Sort drivers: RSA company first, then by pickup distance
    driversWithDistances.sort((a, b) => {
        if (a.driver.companyName === 'RSA' && b.driver.companyName !== 'RSA') {
            return -1;
        }
        if (a.driver.companyName !== 'RSA' && b.driver.companyName === 'RSA') {
            return 1;
        }
        return b.pickupDistance - a.pickupDistance;
    });
    
    const [totalDistance, setTotalDistance] = useState([]);
    const [totalDistances, setTotalDistances] = useState([]);

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
                    }))
                    .filter((driver) => driver.selectedServices && driver.selectedServices.includes(serviceType))
                    .map((driver) => {
                        console.log('dist', distanceNumeric);
                        console.log('Driverrrrr ID:', driver.id);

                        return {
                            ...driver,
                            totalSalary: calculateTotalSalary(serviceDetails.salary, distanceNumeric, serviceDetails.basicSalaryKM, serviceDetails.salaryPerKM),
                        };
                    });

                const pickupDistances = filteredDrivers.map((driver) => {
                    if (driver.currentLocation && driver.currentLocation.latitude && driver.currentLocation.longitude) {
                        const lat1 = driver.currentLocation.latitude;
                        const lng1 = driver.currentLocation.longitude;
                        return calculateDistance(pickupLocation.lat, pickupLocation.lng, lat1, lng1);
                    } else {
                        return null;
                    }
                });

                console.log('Pickup Distances:', pickupDistances);
                setPickupDistances(pickupDistances);
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
        if (pickupDistances.length > 0 && drivers.length > 0) {
            const totalDistances = drivers.map((driver, index) => {
                const numericPickupDistance = pickupDistances[index] || 0; // Default to 0 if pickupDistance is not available
                const totalDistance = distanceNumeric ;
                return { driverId: driver.id, totalDistance };
            });
            console.log('Total Distances:', totalDistances);
            setTotalDistances(totalDistances); // Set totalDistances state
        }
    }, [pickupDistances, drivers, distanceNumeric]);

    useEffect(() => {
        if (pickupDistances.length > 0) {
            const totalSalaries = drivers.map((driver, index) => {
                const numericPickupDistance = pickupDistances[index];

                console.log('distanceNumericcc', distanceNumeric);

                console.log('numericPickupDistance', numericPickupDistance);

                return calculateTotalSalary(
                    serviceDetails.salary,
                    totalDistances.find((dist) => dist.driverId === driver.id)?.totalDistance || 0,
                    serviceDetails.basicSalaryKM,
                    serviceDetails.salaryPerKM,
                    numericPickupDistance
                );
            });
            console.log('total amount array', totalSalaries);
            // Calculate total salary for all drivers
            const totalSalary = totalSalaries.reduce((acc, salary) => acc + salary, 0);
            setTotalSalary(totalSalary);
        }
    }, [pickupDistances, drivers, serviceDetails, totalDistances]);

    console.log('totalDistancetotalDistance', totalDistance);

    const calculateTotalSalary = (salary, totalDistances, kmValueNumeric, perKmValueNumeric) => {
        const numericBasicSalary = Number(salary);
        const numericDistanceNumeric = Number(distanceNumeric);
        const numericKmValueNumeric = Number(kmValueNumeric);
        const numericPerKmValueNumeric = Number(perKmValueNumeric);
        const numericTotalDistances = Number(totalDistances);

        console.log('Total Distance with Pickup:', numericTotalDistances);

        if (numericTotalDistances > numericKmValueNumeric) {
            return numericBasicSalary + (numericTotalDistances - numericKmValueNumeric) * numericPerKmValueNumeric;
        } else {
            return numericBasicSalary;
        }
    };
    useEffect(() => {
        const fetchShowrooms = async () => {
            try {
                const showroomCollection = collection(db, 'showroom');
                const snapshot = await getDocs(showroomCollection);
                const showroomList = snapshot.docs.map((doc) => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        name: data.name || 'Unnamed Showroom', // Default value if name is undefined
                        ...data,
                    };
                });
                console.log('Fetched showrooms:', showroomList);
                setShowrooms(showroomList);
            } catch (error) {
                console.error('Error fetching showrooms:', error);
                setShowrooms([]);
            }
        };

        fetchShowrooms();
    }, [db]);
    const addOrUpdateItem = async () => {
        try {
            const selectedDriverObject = drivers.find((driver) => driver.id === selectedDriver);
            const driverName = selectedDriverObject ? selectedDriverObject.driverName : '';
            const currentDate = new Date();
            const dateTime = currentDate.toLocaleString();
            let finalFileNumber = ''; 

            if (company === 'self') {
                finalFileNumber = bookingId; 
            } else if (company === 'rsa') {
                finalFileNumber = fileNumber; 
            }
    
            const bookingData = {
                ...bookingDetails,
                driver: driverName,
                totalSalary: totalSalary,
                pickupLocation: pickupLocation,
                dropoffLocation: dropoffLocation,
                status: 'booking added',
                dateTime: dateTime,
                bookingId: `${bookingId}`,
                createdAt: serverTimestamp(),
                comments: comments || '',
                totalDistance: totalDistance, 
                baseLocation:baseLocation || '',
                company: company || '',
                showroom: selectedShowroom || '',                customerName: customerName || '',
                mobileNumber: mobileNumber || '',
                phoneNumber: phoneNumber || '',
                serviceType: serviceType || '',
                serviceVehicle: serviceVehicle || '',
                vehicleModel: vehicleModel || '',
                vehicleSection:vehicleSection || '',
                vehicleNumber: vehicleNumber || '',
                fileNumber: finalFileNumber, 
                selectedDriver: selectedDriver || '',
            };

            console.log('Data to be added/updated:', bookingData); // Log the data before adding or updating

            if (editData) {
                const docRef = doc(db, 'bookings', editData.id);
                await updateDoc(docRef, bookingData);
                console.log('Document updated');
            } else {
                const docRef = await addDoc(collection(db, 'bookings'), bookingData);
                console.log('Document written with ID: ', docRef.id);
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
                                {bookingId}
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
                        <option value="rsa">RSA Work</option>
                        <option value="self">Payment Work</option>
                    </select>
                </div>
                {company === 'self' ? (
                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '1rem' }}>
                        <label htmlFor="fileNumber" style={{ marginRight: '0.5rem', marginLeft: '0.5rem', width: '33%', marginBottom: '0', color: '#333' }}>
                            File Number
                        </label>
                        <input
                            id="fileNumber"
                            type="text"
                            name="fileNumber"
                            placeholder="Enter File Number"
                            className="form-input lg:w-[250px] w-2/3"
                            value={bookingId}
                            readOnly
                            style={{
                                width: '100%',
                                padding: '0.5rem',
                                border: '1px solid #ccc',
                                borderRadius: '5px',
                                fontSize: '1rem',
                                outline: 'none',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                backgroundColor: '#f1f1f1', // read-only background color
                            }}
                        />
                    </div>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '1rem' }}>
                        <label htmlFor="fileNumber" style={{ marginRight: '0.5rem', marginLeft: '0.5rem', width: '33%', marginBottom: '0', color: '#333' }}>
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
                        <label htmlFor="baseLocation" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
                            Base Location
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
                                placeholder="Base Location"
                                ref={(node) => setupAutocomplete(node, setBaseLocation)}
                                onChange={(e) => handleInputChange('baseLocation', e.target.value)}
                                value={baseLocation ? baseLocation.name : ''}
                            />
                            {baseLocation && <div>{`baseLocation Lat/Lng: ${baseLocation.lat}, ${baseLocation.lng}`}</div>}
                        </div>
                    </div> 
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
                                        
                                        <GoogleMap>
                                            <MyMapComponent map={map} pickupLocation={pickupLocation} dropoffLocation={dropoffLocation}  baseLocation={baseLocation}/>
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
                                required
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
        <button
            onClick={closeModal}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-1"
            style={{ marginLeft: 'auto', marginRight: '20px' }}
        >
            OK
        </button>
    </div>

    <div style={{ marginTop: '10px' }}>
        <div className="grid grid-cols-1 gap-4">
            {driversWithDistances
                .sort((a, b) => (a.driver.companyName === 'RSA' ? -1 : 1))
                .map(({ driver, pickupDistance }) => {
                    console.log('Driver ID:', driver.id);
                    console.log('Total Distances:', totalDistances);
                    const totalDistance = totalDistances.find((dist) => dist.driverId === driver.id)?.totalDistance;
                    const driverTotalSalary = calculateTotalSalary(
                        serviceDetails.salary,
                        totalDistances.find((dist) => dist.driverId === driver.id)?.totalDistance || 0,
                        serviceDetails.basicSalaryKM,
                        serviceDetails.salaryPerKM
                    ).toFixed(2);
                    return (
                        <div key={driver.id} className="flex items-center border border-gray-200 p-2 rounded-lg">
                            <table className="panel p-4 w-full">
                                <thead>
                                    <tr>
                                        <th>Driver Name</th>
                                        <th>Company Name</th>
                                        <th>Distance to Pickup (km)</th> 
                                        <th>Select</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{driver.driverName || 'Unknown Driver'}</td>
                                        <td>{driver.companyName || 'Unknown Company'}</td>
                                        <td>{pickupDistance.toFixed(2)} km</td>
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
    </div>
</ReactModal>

                            </div>
                            <React.Fragment>
                                <div className="mt-4 flex items-center">
                                    <label htmlFor="totalSalary" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
                                        Payable Amount
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
                                {/* <div className="mt-4 flex items-center">
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
                                            value={totalDistance}
                                            readOnly
                                        />
                                    </div>
                                </div> */}
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
                            <label htmlFor="showroom" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
                            Showroom Name
                                </label>
            <select
                id="showroom"
                name="showroom"
                className="form-input flex-1"
                value={selectedShowroom}
                onChange={(e) => setSelectedShowroom(e.target.value)}
            >
                <option value="">Select a showroom</option>
                {Array.isArray(showrooms) && showrooms.map(showroom => (
                    <option key={showroom.id} value={showroom.id}>
                        {showroom.Location}
                    </option>
                ))}
            </select>
        </div>
        <br/>
        <div className="flex items-center" style={{ marginBottom: '1rem' }}>
                        <label htmlFor="vehicleSection" className="w-1/3 mb-0" style={{ marginRight: '1rem' }}>Service Center</label>
                       <VehicleSection/>
                        {/* <select
                            id="vehicleSection"
                            name="vehicleSection"
                            className="form-select flex-1"
                            value={vehicleSection}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid #ccc',
                                borderRadius: '5px',
                                fontSize: '1rem',
                                outline: 'none',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                            }}
                            onChange={(e) => handleInputChange('vehicleSection', e.target.value)}
                        >
                            <option value="">Select Service Section</option>
                            <option value="Service Center">Service Center</option>
                            <option value="Body Shopes">Body Shopes</option>
                            <option value="ShowRooms">ShowRooms</option>
                        </select> */}
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
                              
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={addOrUpdateItem}
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
