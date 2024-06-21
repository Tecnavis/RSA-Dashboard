import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { GoogleMap } from '@react-google-maps/api';
import ReactModal from 'react-modal';
import { v4 as uuid } from 'uuid';
import { query, where } from 'firebase/firestore';
import { serverTimestamp } from 'firebase/firestore';
import useGoogleMaps from './GoogleMaps';
import MyMapComponent from './MyMapComponent';
import VehicleSection from './VehicleSection';
import IconPlus from '../../components/Icon/IconPlus';
import ShowroomModal from './ShowroomModal';
import BaseLocationModal from '../BaseLocation/BaseLocationModal';

interface Showroom {
    id: string;
    name: string;
}
const Booking = () => {
    const db = getFirestore();
    const navigate = useNavigate();
    const [bookingId, setBookingId] = useState<string>('');
    useEffect(() => {
        const newBookingId = uuid().substring(0, 6);
        setBookingId(newBookingId);
    }, []);
    const googleMapsLoaded = useGoogleMaps();
    const [updatedTotalSalary, setUpdatedTotalSalary] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');

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
        vehicleSection: '',
        comments: '',
    });
    const { state } = useLocation();
    const [map, setMap] = useState(null);
    const [isModalOpen1, setIsModalOpen1] = useState(false);

    const openModal1 = () => setIsModalOpen1(true);
    const closeModal1 = () => setIsModalOpen1(false);
    const [Location, setLocation] = useState('');

    console.log('loc', Location);
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
    const [showShowroomModal, setShowShowroomModal] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [serviceDetails, setServiceDetails] = useState('');
    const [serviceType, setServiceType] = useState('');
    const [pickupLocation, setPickupLocation] = useState(null);
    const [dropoffLocation, setDropoffLocation] = useState(null);
    const [baseLocation, setBaseLocation] = useState(null);
    const [trappedLocation, setTrappedLocation] = useState('');
    const [selectedShowroomLocation, setSelectedShowroomLocation] = useState('');
    const [totalSalary, setTotalSalary] = useState(0);

    const [showroomLocation, setShowroomLocation] = useState('');

    const [showrooms, setShowrooms] = useState<Showroom[]>([]);
    const [selectedShowroom, setSelectedShowroom] = useState('');
    const [distance, setDistance] = useState('');
    const [drivers, setDrivers] = useState([]);
    const distanceNumeric = parseFloat(distance.replace('km', ''));
    const [editData, setEditData] = useState(null);
    const [insuranceAmount, setInsuranceAmount] = useState('');

    const [manualInput, setManualInput] = useState(pickupLocation ? pickupLocation.name : '');
    const [manualInput1, setManualInput1] = useState(dropoffLocation ? dropoffLocation.name : '');

    useEffect(() => {
        setManualInput(pickupLocation ? pickupLocation.name : '');
    }, [pickupLocation]);

    useEffect(() => {
        if (state && state.editData) {
            setEditData(state.editData);
            setBookingId(state.editData.bookingId || '');
            setTrappedLocation(state.editData.trappedLocation || '');
            setInsuranceAmount(state.editData.insuranceAmount || '');
            setSelectedShowroomLocation(state.editData.selectedShowroomLocation || '');
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
            setShowroomLocation(state.editData.showroomLocation || '');
            setLocation(state.editData.Location || '');
            setUpdatedTotalSalary(state.editData.updatedTotalSalary || '');
            setDistance(state.editData.distance || '');
            setSelectedDriver(state.editData.selectedDriver || '');
            setBaseLocation(state.editData.baseLocation || '');

            setSelectedShowroom(state.editData.selectedShowroom || '');
            setShowrooms(state.editData.showrooms || '');

            setPickupLocation(state.editData.pickupLocation || '');
            setServiceType(state.editData.serviceType || '');
            setTotalSalary(state.editData.totalSalary || '');
            setDropoffLocation(state.editData.dropoffLocation || '');
            if (state.editData.selectedShowroom === showroomLocation) {
                setShowroomLocation(state.editData.selectedShowroom);
            }
        }
    }, [state, showroomLocation]);
    console.log('Selected Base Location:', baseLocation);

    const openModal = () => {
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
    };
    const handleUpdatedTotalSalary = (newTotalSalary) => {
        setUpdatedTotalSalary(newTotalSalary);
    };
    useEffect(() => {
        setManualInput1(dropoffLocation ? dropoffLocation.name : '');
    }, [dropoffLocation]);

    const handleManualChange1 = (field, value) => {
        setDropoffLocation((prev) => ({ ...prev, [field]: value }));
    };

    const handleLocationChange1 = (e) => {
        const value = e.target.value;
        setManualInput1(value);
        handleInputChange('dropoffLocation', value);
    };
    const handleLocationChange = (e) => {
        const value = e.target.value;
        setManualInput(value);
        handleInputChange('pickupLocation', value);
    };
    const handleInsuranceAmountChange = (amount) => {
        setInsuranceAmount(amount);
    };
    const updateShowroomLocation = (location) => {
        setShowroomLocation(location);
    };
    const handleManualChange = (field, value) => {
        setPickupLocation((prev) => ({ ...prev, [field]: value }));
    };
    
    const handleInputChange = (field, value) => {
        console.log('Field:', field);
        console.log('Value:', value);
        if (field === 'selectedShowroom') {
            setSelectedShowroom(value);
            const selectedShowroomName = showrooms.find((showroom) => showroom.id === value)?.Location;
            console.log('Selected Showroom:', selectedShowroomName);
        }
        switch (field) {
            case 'customerName':
                setCustomerName(value || '');
                break;
            case 'company':
                setCompany(value);
                setFileNumber(value === 'self' ? bookingId : '');
                break;
            // case 'selectedShowroom':
            //     setSelectedShowroom(value);
            //     break;
            case 'searchTerm':
                setSearchTerm(value);
                break;
            case 'showroomLocation':
                setShowroomLocation(value || '');
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
            case 'updatedTotalSalary':
                setUpdatedTotalSalary(value || '');
                break;
            case 'distance':
                setDistance(value || '');
                openModal();
                break;
            case 'serviceVehicle':
                setServiceVehicle(value || '');
                break;
            case 'dropoffLocation':
                if (typeof value === 'string') {
                    setDropoffLocation({ ...dropoffLocation, name: value });
                } else {
                    setDropoffLocation({ ...dropoffLocation, name: value.name });
                }
                break;
            case 'mobileNumber':
                setMobileNumber(value || '');
                break;
            case 'phoneNumber':
                setPhoneNumber(value || '');
                break;
            case 'pickupLocation':
                if (typeof value === 'string') {
                    setPickupLocation({ ...pickupLocation, name: value });
                } else {
                    setPickupLocation({ ...pickupLocation, name: value.name });
                }
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
            case 'Location':
                setLocation(value || '');
                break;
            case 'trappedLocation':
                setTrappedLocation(value || '');
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
                const selectedDriverTotalDistance = totalDistances.find((dist) => dist.driverId === value)?.totalDistance || 0;
                setTotalDistance(selectedDriverTotalDistance);
                break;
            case 'vehicleNumber':
                setVehicleNumber(value || '');
                break;
            case 'selectedShowroom':
                setSelectedShowroom(value || '');
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
        // setupAutocomplete(document.getElementById('baseLocationInput'), setBaseLocation);
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

    // const driversWithDistances = drivers.map((driver, index) => ({
    //     driver,
    //     pickupDistance: pickupDistances[index] !== null ? pickupDistances[index] : Infinity,
    // }));

    // driversWithDistances.sort((a, b) => {
    //     if (a.driver.companyName === 'RSA' && b.driver.companyName !== 'RSA') {
    //         return -1;
    //     }
    //     if (a.driver.companyName !== 'RSA' && b.driver.companyName === 'RSA') {
    //         return 1;
    //     }
    //     return b.pickupDistance - a.pickupDistance;
    // });

    const [totalDistance, setTotalDistance] = useState([]);
    const [totalDistances, setTotalDistances] = useState([]);

    const calculateTotalSalary = (salary, totalDistance, basicSalaryKM, salaryPerKM) => {
        const numericBasicSalary = Number(salary) || 0;
        const numericTotalDistance = Number(totalDistance) || 0;
        const numericKmValueNumeric = Number(basicSalaryKM) || 0;
        const numericPerKmValueNumeric = Number(salaryPerKM) || 0;
        console.log('numericBasicSalary', numericBasicSalary);
        console.log('numericTotalDistance', numericTotalDistance);

        console.log('numericKmValueNumeric', numericKmValueNumeric);

        console.log('numericPerKmValueNumeric', numericPerKmValueNumeric);

        if (numericTotalDistance > numericKmValueNumeric) {
            return numericBasicSalary + (numericTotalDistance - numericKmValueNumeric) * numericPerKmValueNumeric;
        } else {
            return numericBasicSalary;
        }
    };

    const fetchTravelDistance = async (origin, destination) => {
        return new Promise((resolve, reject) => {
            const service = new window.google.maps.DistanceMatrixService();
            service.getDistanceMatrix(
                {
                    origins: [origin],
                    destinations: [destination],
                    travelMode: window.google.maps.TravelMode.DRIVING,
                },
                (response, status) => {
                    if (status === 'OK') {
                        const element = response.rows[0].elements[0];
                        const distance = element.distance.value / 1000; // distance in kilometers
                        const duration = element.duration.value / 60; // duration in minutes
                        resolve({ distance, duration });
                    } else {
                        reject(new Error('Error fetching travel distance and duration'));
                    }
                }
            );
        });
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
                    }))
                    .filter((driver) => driver.selectedServices && driver.selectedServices.includes(serviceType));

                const distancePromises = filteredDrivers.map(async (driver) => {
                    if (driver.currentLocation && driver.currentLocation.latitude && driver.currentLocation.longitude) {
                        const origin = new window.google.maps.LatLng(driver.currentLocation.latitude, driver.currentLocation.longitude);
                        const destination = new window.google.maps.LatLng(pickupLocation.lat, pickupLocation.lng);
                        const { distance, duration } = await fetchTravelDistance(origin, destination);
                        return { distance, duration };
                    } else {
                        return { distance: 0, duration: 0 };
                    }
                });

                const resolvedDistances = await Promise.all(distancePromises);

                setPickupDistances(resolvedDistances);
                setDrivers(filteredDrivers);
            } catch (error) {
                console.error('Error fetching drivers:', error);
            }
        };

        if (serviceType && serviceDetails && window.google) {
            fetchDrivers().catch(console.error);
        } else {
            setDrivers([]);
        }
    }, [serviceType, serviceDetails, pickupLocation, distanceNumeric]);
    useEffect(() => {
        if (pickupDistances.length > 0 && drivers.length > 0) {
            const totalDistances = drivers.map((driver, index) => {
                const numericPickupDistance = pickupDistances[index] || 0; // Default to 0 if pickupDistance is not available
                const totalDistance = distanceNumeric;
                return { driverId: driver.id, totalDistance };
            });
            setTotalDistances(totalDistances); // Set totalDistances state
        }
    }, [pickupDistances, drivers, distanceNumeric]);

    useEffect(() => {
        if (pickupDistances.length > 0 && totalDistances.length > 0) {
            console.log('Drivers:', drivers);
            console.log('Pickup Distances:', pickupDistances);
            console.log('Total Distances:', totalDistances);
            console.log('Service Details:', serviceDetails);

            const totalSalaries = drivers.map((driver) => {
                const totalDistanceObj = totalDistances.find((dist) => dist.driverId === driver.id);
                const totalDistance = totalDistanceObj ? totalDistanceObj.totalDistance : 0;

                // Log the values to the console
                console.log('Calculating salary for driver:', driver.id);
                console.log('serviceDetails.salary:', serviceDetails.salary);
                console.log('totalDistance:', totalDistance);
                console.log('serviceDetails.basicSalaryKM:', serviceDetails.basicSalaryKM);
                console.log('serviceDetails.salaryPerKM:', serviceDetails.salaryPerKM);

                return calculateTotalSalary(serviceDetails.salary, totalDistance, serviceDetails.basicSalaryKM, serviceDetails.salaryPerKM).toFixed(2);
            });

            const totalSalary = totalSalaries.reduce((acc, salary) => parseFloat(salary), 0);
            setTotalSalary(totalSalary);
            // Assuming updatedTotalSalary calculation here
            setUpdatedTotalSalary(totalSalary); // For example, adding 10% for insurance
        }
    }, [pickupDistances, drivers, serviceDetails, totalDistances, distanceNumeric]);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'showroom'), (snapshot) => {
            const filteredShowroomList = snapshot.docs
                .map((doc) => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        name: data.name || 'Unnamed Showroom',
                        Location: data.Location || 'Unknown Location',
                        ...data,
                    };
                })
                .filter((showroom) => showroom.name.toLowerCase().includes(searchTerm.toLowerCase()));
            setShowrooms(filteredShowroomList);
        });
        return () => unsubscribe();
    }, [db, searchTerm]);
    useEffect(() => {
        if (selectedShowroom) {
            const showroom = showrooms.find((s) => s.id === selectedShowroom);
            const location = showroom ? showroom.Location : '';
            setShowroomLocation(location);
        }
    }, [selectedShowroom, showrooms]);
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
                baseLocation: baseLocation || '',
                showroomId: selectedShowroom,
                showroomLocation: showroomLocation,
                Location: Location || '',
                company: company || '',
                showroom: selectedShowroom || '',
                customerName: customerName || '',
                mobileNumber: mobileNumber || '',
                phoneNumber: phoneNumber || '',
                serviceType: serviceType || '',
                serviceVehicle: serviceVehicle || '',
                vehicleModel: vehicleModel || '',
                vehicleSection: vehicleSection || '',
                vehicleNumber: vehicleNumber || '',
                fileNumber: finalFileNumber,
                selectedDriver: selectedDriver || '',
                trappedLocation: trappedLocation || '',
                updatedTotalSalary: updatedTotalSalary || '',
                insuranceAmount: insuranceAmount || '',
                paymentStatus: 'Not Paid',
            };
            if (editData) {
                bookingData.newStatus = 'Edited by Admin';
                bookingData.editedTime = currentDate.toLocaleString();
            }
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
        <div style={{ backgroundColor: '#e6f7ff', padding: '2rem', borderRadius: '10px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h5 className="font-semibold text-lg dark:text-white-light">Add Bookings</h5>

                <div
                    style={{
                        padding: '6px',
                        flex: 1,
                        marginTop: '2rem',
                        marginRight: '6rem',
                        marginLeft: '6rem',
                        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                        borderRadius: '10px',
                        background: 'lightblue',
                    }}
                >
                    <div style={{ display: 'flex', flexWrap: 'wrap', padding: '1rem' }}>
                        <h5 className="font-semibold text-lg dark:text-white-light mb-5 p-4">Book Now</h5>

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
                                        value={`PMNA${bookingId}`}
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
                                                    onChange={handleLocationChange}
                                                    value={manualInput}
                                                />
                                            </div>
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
                                                    placeholder="Latitude"
                                                    value={pickupLocation && pickupLocation.lat ? pickupLocation.lat : ''}
                                                    onChange={(e) => handleManualChange('lat', e.target.value)}
                                                />
                                            </div>
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
                                                    placeholder="Longitude"
                                                    value={pickupLocation && pickupLocation.lng ? pickupLocation.lng : ''}
                                                    onChange={(e) => handleManualChange('lng', e.target.value)}
                                                />
                                            </div>
                                            <a
                                                href={`https://www.google.co.in/maps/@${pickupLocation?.lat || '11.0527369'},${pickupLocation?.lng || '76.0747136'},15z?entry=ttu`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{
                                                    borderRadius: '40px',
                                                    background: 'linear-gradient(135deg, #32CD32, #228B22)',
                                                    color: 'white',
                                                    marginLeft: '10px',
                                                    padding: '10px',
                                                    border: 'none',
                                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                                    cursor: 'pointer',
                                                    transition: 'background 0.3s ease',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                                onMouseOver={(e) => (e.currentTarget.style.background = 'linear-gradient(135deg, #228B22, #006400)')}
                                                onMouseOut={(e) => (e.currentTarget.style.background = 'linear-gradient(135deg, #32CD32, #228B22)')}
                                            >
                                                <IconPlus />
                                            </a>{' '}
                                        </div>
                                        
                                        <div className="flex items-center mt-4">
                                            <label htmlFor="dropoffLocation" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
                                                Dropoff Location
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
                                                    placeholder="dropoff Location"
                                                    ref={(node) => setupAutocomplete(node, setDropoffLocation)}
                                                    onChange={handleLocationChange1}
                                                    value={manualInput1}
                                                />
                                            </div>
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
                                                    placeholder="Latitude"
                                                    value={dropoffLocation && dropoffLocation.lat ? dropoffLocation.lat : ''}
                                                    onChange={(e) => handleManualChange1('lat', e.target.value)}
                                                />
                                            </div>
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
                                                    placeholder="Longitude"
                                                    value={dropoffLocation && dropoffLocation.lng ? dropoffLocation.lng : ''}
                                                    onChange={(e) => handleManualChange1('lng', e.target.value)}
                                                />
                                            </div>
                                            <a
                                                href={`https://www.google.co.in/maps/@${dropoffLocation?.lat || '11.0527369'},${dropoffLocation?.lng || '76.0747136'},15z?entry=ttu`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{
                                                    borderRadius: '40px',
                                                    background: 'linear-gradient(135deg, #32CD32, #228B22)',
                                                    color: 'white',
                                                    marginLeft: '10px',
                                                    padding: '10px',
                                                    border: 'none',
                                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                                    cursor: 'pointer',
                                                    transition: 'background 0.3s ease',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                                onMouseOver={(e) => (e.currentTarget.style.background = 'linear-gradient(135deg, #228B22, #006400)')}
                                                onMouseOut={(e) => (e.currentTarget.style.background = 'linear-gradient(135deg, #32CD32, #228B22)')}
                                            >
                                                <IconPlus />
                                            </a>{' '}
                                        </div>
                                        <div className="mt-4 flex items-center">
                                            <label htmlFor="baseLocation" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
                                                Start Location
                                            </label>
                                            <input
                                                id="baseLocation"
                                                type="text"
                                                name="baseLocation"
                                                className="form-input flex-1"
                                                placeholder="select start location"
                                                value={baseLocation ? `${baseLocation.name} , ${baseLocation.lat} , ${baseLocation.lng}` : ''}
                                                style={{
                                                    width: '100%',
                                                    padding: '0.5rem',
                                                    border: '1px solid #ccc',
                                                    borderRadius: '5px',
                                                    fontSize: '1rem',
                                                    outline: 'none',
                                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                                }}
                                                readOnly
                                            />
                                            <button
                                                onClick={openModal1}
                                                style={{
                                                    borderRadius: '40px',
                                                    background: 'linear-gradient(135deg, #32CD32, #228B22)',
                                                    color: 'white',
                                                    marginLeft: '10px',
                                                    padding: '10px',
                                                    border: 'none',
                                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                                    cursor: 'pointer',
                                                    transition: 'background 0.3s ease',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                                onMouseOver={(e) => (e.currentTarget.style.background = 'linear-gradient(135deg, #228B22, #006400)')}
                                                onMouseOut={(e) => (e.currentTarget.style.background = 'linear-gradient(135deg, #32CD32, #228B22)')}
                                            >
                                                <IconPlus />
                                            </button>
                                        </div>

                                        {isModalOpen1 && (
                                            <div
                                                className="modal"
                                                style={{
                                                    position: 'fixed',
                                                    zIndex: 1,
                                                    left: 0,
                                                    top: 0,
                                                    width: '100%',
                                                    height: '100%',
                                                    overflow: 'auto',
                                                    backgroundColor: 'rgb(0,0,0)',
                                                    backgroundColor: 'rgba(0,0,0,0.4)',
                                                }}
                                            >
                                                <div
                                                    className="modal-content"
                                                    style={{
                                                        backgroundColor: '#fefefe',
                                                        margin: '15% auto',
                                                        padding: '20px',
                                                        border: '1px solid #888',
                                                        width: '80%',
                                                        boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
                                                        borderRadius: '10px',
                                                    }}
                                                >
                                                    <div
                                                        className="modal-header"
                                                        style={{
                                                            display: 'flex',
                                                            justifyContent: 'flex-end',
                                                            borderBottom: '1px solid #eee',
                                                            paddingBottom: '10px',
                                                        }}
                                                    >
                                                        <span
                                                            className="close"
                                                            onClick={closeModal1}
                                                            style={{
                                                                color: '#aaa',
                                                                fontSize: '28px',
                                                                fontWeight: 'bold',
                                                                cursor: 'pointer',
                                                                transition: '0.3s',
                                                            }}
                                                        >
                                                            &times;
                                                        </span>
                                                    </div>
                                                    <div className="modal-body">
                                                        <BaseLocationModal onClose={closeModal1} setBaseLocation={setBaseLocation} pickupLocation={pickupLocation} />
                                                    </div>
                                                    <div
                                                        className="modal-footer"
                                                        style={{
                                                            padding: '10px',
                                                            borderTop: '1px solid #eee',
                                                            textAlign: 'right',
                                                        }}
                                                    >
                                                        <button
                                                            onClick={closeModal1}
                                                            style={{
                                                                padding: '10px 20px',
                                                                border: 'none',
                                                                borderRadius: '5px',
                                                                background: '#f44336',
                                                                color: '#fff',
                                                                cursor: 'pointer',
                                                                transition: 'background 0.3s ease',
                                                            }}
                                                            onMouseOver={(e) => (e.currentTarget.style.background = '#d32f2f')}
                                                            onMouseOut={(e) => (e.currentTarget.style.background = '#f44336')}
                                                        >
                                                            Close
                                                        </button>{' '}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        <div className="flex items-center mt-4">
                                            <label htmlFor="Location" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
                                                Showroom Name
                                            </label>
                                            <select
                                                id="Location"
                                                name="Location"
                                                className="form-input flex-1"
                                                value={selectedShowroom}
                                                onChange={(e) => handleInputChange('selectedShowroom', e.target.value)}
                                            >
                                                <option value="">Select a showroom</option>
                                                {Array.isArray(showrooms) &&
                                                    showrooms.map((showroom) => (
                                                        <option key={showroom.id} value={showroom.id}>
                                                            {showroom.Location}
                                                        </option>
                                                    ))}
                                            </select>
                                            <button
                                                onClick={() => setShowShowroomModal(true)}
                                                style={{
                                                    borderRadius: '40px',
                                                    background: 'linear-gradient(135deg, #32CD32, #228B22)',
                                                    color: 'white',
                                                    margin: '10px',
                                                    padding: '10px 10px',
                                                    border: 'none',
                                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                                    cursor: 'pointer',
                                                    transition: 'background 0.3s ease',
                                                }}
                                                onMouseOver={(e) => (e.currentTarget.style.background = 'linear-gradient(135deg, #228B22, #006400)')}
                                                onMouseOut={(e) => (e.currentTarget.style.background = 'linear-gradient(135deg, #32CD32, #228B22)')}
                                            >
                                                Add Showroom
                                            </button>
                                        </div>
                                        {showShowroomModal && <ShowroomModal onClose={() => setShowShowroomModal(false)} updateShowroomLocation={updateShowroomLocation} />}
                                        <div>
    Selected Showroom Name:
</div>
<div  style={{ fontSize: '1.1em', fontWeight: 'bold', color: '#333', marginTop: '10px',background:"white" ,padding:"10px",borderRadius:"10px"}}> {showroomLocation}</div>
<br/>
                                        <GoogleMap>
                                            <MyMapComponent map={map} pickupLocation={pickupLocation} dropoffLocation={dropoffLocation} baseLocation={baseLocation} />
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
                                <label htmlFor="trappedLocation" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
                                    Trapped Location
                                </label>
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        id="onRoad"
                                        name="trappedLocation"
                                        value="onRoad"
                                        checked={trappedLocation === 'onRoad'}
                                        onChange={(e) => handleInputChange('trappedLocation', e.target.value)}
                                        className="mr-2"
                                    />
                                    <label htmlFor="onRoad" className="mr-4">
                                        On Road
                                    </label>
                                    <input
                                        type="radio"
                                        id="inHouse"
                                        name="trappedLocation"
                                        value="inHouse"
                                        checked={trappedLocation === 'inHouse'}
                                        onChange={(e) => handleInputChange('trappedLocation', e.target.value)}
                                        className="mr-2"
                                    />
                                    <label htmlFor="inHouse" className="mr-4">
                                        In House
                                    </label>
                                    <input
                                        type="radio"
                                        id="outsideOfRoad"
                                        name="trappedLocation"
                                        value="outsideOfRoad"
                                        checked={trappedLocation === 'outsideOfRoad'}
                                        onChange={(e) => handleInputChange('trappedLocation', e.target.value)}
                                        className="mr-2"
                                    />
                                    <label htmlFor="outsideOfRoad" className="text-danger">
                                        Outside of Road
                                    </label>
                                </div>
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
            {drivers
                .map((driver, index) => ({
                    driver,
                    pickupDistanceData: pickupDistances[index] || { distance: 0, duration: 0 },
                }))
                .sort((a, b) => {
                    if (a.driver.companyName === 'RSA' && b.driver.companyName !== 'RSA') {
                        return -1;
                    }
                    if (a.driver.companyName !== 'RSA' && b.driver.companyName === 'RSA') {
                        return 1;
                    }
                    return a.pickupDistanceData.distance - b.pickupDistanceData.distance;
                })
                .map(({ driver, pickupDistanceData }, index) => {
                    const totalDistance = totalDistances.find((dist) => dist.driverId === driver.id)?.totalDistance || 0;
                    const driverTotalSalary = calculateTotalSalary(
                        serviceDetails.salary,
                        totalDistance,
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
                                                                                <th>Company Name</th>

                                        serviceVehicle
                                        <th>Distance to Pickup (km)</th>
                                        <th>Duration (min)</th>
                                        <th>Select</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td style={{ fontSize: '18px', fontWeight: 'bold',color:'green' }}>{driver.driverName || 'Unknown Driver'}</td>
                                        <td>{driver.companyName || 'Unknown Company'}</td>
                                        {/* <td>{driver.serviceType.serviceVehicle || 'Unknown Company'}</td> */}

                                        <td>{pickupDistanceData.distance.toFixed(2)} km</td>
                                        <td>{pickupDistanceData.duration.toFixed(2)} minutes</td>
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
                        </div>
                        <React.Fragment>
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
                            <div>
                                <VehicleSection
                                    showroomLocation={showroomLocation}
                                    totalSalary={totalSalary}
                                    onUpdateTotalSalary={handleUpdatedTotalSalary}
                                    onInsuranceAmountChange={handleInsuranceAmountChange}
                                />
                                <div className="mt-4 flex items-center">
                                    <label htmlFor="totalSalary" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
                                        Total Amount without insurance
                                    </label>
                                    <div className="form-input flex-1">
                                        <input
                                            id="totalSalary"
                                            type="text"
                                            name="totalSalary"
                                            className="w-full  text-bold"
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
                                    <label htmlFor="updatedTotalSalary" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
                                        Payable Amount (with insurance)
                                    </label>
                                    <div className="form-input flex-1">
                                        <input
                                            id="updatedTotalSalary"
                                            type="text"
                                            name="updatedTotalSalary"
                                            className="w-full text-danger"
                                            style={{
                                                padding: '0.5rem',
                                                border: '1px solid #ccc',
                                                borderRadius: '5px',
                                                fontSize: '2rem',
                                                outline: 'none',
                                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                            }}
                                            value={updatedTotalSalary}
                                            readOnly
                                        />
                                    </div>
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
    );
};

export default Booking;