import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import ReactModal from 'react-modal';
import { v4 as uuid } from 'uuid';
import { query, where } from 'firebase/firestore';
import { serverTimestamp } from 'firebase/firestore';
import VehicleSection from './VehicleSection';
import IconPlus from '../../components/Icon/IconPlus';
import ShowroomModal from './ShowroomModal';
import IconMapPin from '../../components/Icon/IconMapPin';
import Select from 'react-select';
import BaseLocationWithout from '../BaseLocation/BaseLocationWithout';
import { format } from 'date-fns';

interface Showroom {
    id: string;
    name: string;
}

const WithoutMapBooking = () => {
    const db = getFirestore();
    const navigate = useNavigate();
    const [bookingId, setBookingId] = useState<string>('');
    useEffect(() => {
        const newBookingId = uuid().substring(0, 6);
        setBookingId(newBookingId);
    }, []);
    const [updatedTotalSalary, setUpdatedTotalSalary] = useState(0);
    const [companies, setCompanies] = useState([]);

    const [bookingDetails, setBookingDetails] = useState({
        company: '',
        fileNumber: '',
        customerName: '',
        totalDriverSalary:'',
        phoneNumber: '',
        mobileNumber: '',
        totalSalary: '',
        serviceType: '',
        vehicleType: '',
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
    const [comments, setComments] = useState('');
    const [fileNumber, setFileNumber] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [vehicleType, setVehicleType] = useState('');
        const [totalDriverSalary, setTotalDriverSalary] = useState('');

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
    const [totalSalary, setTotalSalary] = useState(0);
    const [showroomLocation, setShowroomLocation] = useState('');
    const [insuranceAmountBody, setInsuranceAmountBody] = useState(0);
    const [showrooms, setShowrooms] = useState<Showroom[]>([]);
    const [distance, setDistance] = useState('');
    const [drivers, setDrivers] = useState([]);
    const distanceNumeric = parseFloat(distance.replace('km', ''));
    const [editData, setEditData] = useState(null);
    const [serviceTypes, setServiceTypes] = useState([]);
    const [showRooms, setShowRooms] = useState([]);
    const [manualDistance, setManualDistance] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState([]);
    const [currentDateTime, setCurrentDateTime] = useState('');
    const [manualInput, setManualInput] = useState(pickupLocation ? pickupLocation.name : '');
    const [manualInput1, setManualInput1] = useState(dropoffLocation ? dropoffLocation.name : '');
    const [disableFields, setDisableFields] = useState(false); // State to control field disabling
    const [pickupDistances, setPickupDistances] = useState([]);
    const [totalDistance, setTotalDistance] = useState([]);
    const [totalDistances, setTotalDistances] = useState([]);
    const [errors, setErrors] = useState({});
    useEffect(() => {
        if (state && state.editData) {
            const editData = state.editData;
            setEditData(editData);
            setBookingId(editData.bookingId || '');
            setTrappedLocation(editData.trappedLocation || '');
            setInsuranceAmountBody(editData.insuranceAmountBody || '');
            console.log('Insurance Amount Body:state', editData.insuranceAmountBody);
            setComments(editData.comments || '');
            setFileNumber(editData.fileNumber || '');
            setCompany(editData.company || '');
                        setTotalDriverSalary(editData.totalDriverSalary || '');

            setCustomerName(editData.customerName || '');
            setPhoneNumber(editData.phoneNumber || '');
            setVehicleType(editData.vehicleType || '');

            setMobileNumber(editData.mobileNumber || '');
            setVehicleNumber(editData.vehicleNumber || '');
            setServiceVehicle(editData.serviceVehicle || '');
            setVehicleModel(editData.vehicleModel || '');
            setVehicleSection(editData.vehicleSection || '');
            setShowroomLocation(editData.showroomLocation || '');
            setDistance(editData.distance || '');
            setSelectedDriver(editData.selectedDriver || '');
            setBaseLocation(editData.baseLocation || '');
            setShowrooms(editData.showrooms || []);
            setPickupLocation(editData.pickupLocation || '');
            setUpdatedTotalSalary(editData.updatedTotalSalary || '');
            console.log('updatedTotalSalaryyy', editData.updatedTotalSalary);

            setServiceType(editData.serviceType || '');
            setTotalSalary(editData.totalSalary || 0);
            setDropoffLocation(editData.dropoffLocation || '');
            setSelectedCompany(editData.selectedCompany || '');
            setDisableFields(false);
        }
    }, [state]);
    useEffect(() => {
        const now = new Date();
        const formattedDateTime = now.toLocaleString();
        setCurrentDateTime(formattedDateTime);
    }, []);
    useEffect(() => {
        setManualInput(pickupLocation ? pickupLocation.name : '');
    }, [pickupLocation]);
    useEffect(() => {
        if (trappedLocation === 'outsideOfRoad') {
            setDisableFields(true);
        } else {
            setDisableFields(false);
        }
    }, [trappedLocation]);
    const validateForm = () => {
        let tempErrors = {};
        let isValid = true;

        if (!phoneNumber.trim()) {
            tempErrors['phoneNumber'] = 'Phone number is required';
            isValid = false;
        } else if (!/^\d{10}$/.test(phoneNumber)) {
            tempErrors['phoneNumber'] = 'Phone number is invalid, must be 10 digits';
            isValid = false;
        }
        if (!mobileNumber.trim()) {
            tempErrors['mobileNumber'] = 'Mobile number is required';
            isValid = false;
        } else if (!/^\d{10}$/.test(phoneNumber)) {
            tempErrors['mobileNumber'] = 'Mobile number is invalid, must be 10 digits';
            isValid = false;
        }

        setErrors(tempErrors);
        return isValid;
    };
    useEffect(() => {
        if (company === 'rsa') {
            const fetchCompanies = async () => {
                try {
                    const driverCollection = collection(db, 'driver');
                    const q = query(driverCollection, where('companyName', '==', 'Company'));
                    const querySnapshot = await getDocs(q);
                    const companyList = querySnapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    })) as Company[];
                    setCompanies(companyList);
                } catch (error) {
                    console.error('Error fetching companies:', error);
                }
            };

            fetchCompanies();
        }
    }, [company, db]);

    useEffect(() => {
        const showroomsRef = collection(db, 'showroom');
        const unsubscribe = onSnapshot(showroomsRef, (snapshot) => {
            const showRoomsData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setShowrooms(showRoomsData);
        });

        return () => unsubscribe();
    }, [db]);
    const handleUpdatedTotalSalary = (newTotalSalary) => {
        setUpdatedTotalSalary(newTotalSalary);
    };

    useEffect(() => {
        if (totalSalary && insuranceAmountBody) {
            const calculatedTotalSalary = totalSalary - parseFloat(insuranceAmountBody);
            handleUpdatedTotalSalary(calculatedTotalSalary);
        }
    }, [totalSalary, insuranceAmountBody]);

    useEffect(() => {
        if (selectedDriver) {
            const selectedDriverData = drivers.find((driver) => driver.id === selectedDriver);
            if (selectedDriverData && selectedDriverData.serviceVehicle) {
                setServiceVehicle(renderServiceVehicle(selectedDriverData.serviceVehicle, serviceType));
            }
        }
    }, [selectedDriver, serviceType, drivers]);
    const handleAdjustValueChange = (adjustedValue) => {
        setUpdatedTotalSalary(adjustedValue);
    };

    const handleInputChange = (field, value) => {
        switch (field) {
            case 'showroomLocation':
                setShowroomLocation(value);
                const selectedShowroom = showRooms.find((show) => show.Location === value);
                if (selectedShowroom) {
                    setInsuranceAmountBody(selectedShowroom.insuranceAmountBody);
                    setDropoffLocation({
                        name: selectedShowroom.Location,
                        lat: selectedShowroom.locationLatLng.lat,
                        lng: selectedShowroom.locationLatLng.lng,
                    });
                } else {
                    setInsuranceAmountBody('');
                    setDropoffLocation('');
                }
                break;
            case 'totalSalary':
                setTotalSalary(value || 0);
                const newCalculatedSalary = value - parseFloat(insuranceAmountBody);
                handleUpdatedTotalSalary(newCalculatedSalary);
                break;
            case 'insuranceAmountBody':
                setInsuranceAmountBody(value || 0);
                const recalculatedTotalSalary = totalSalary - parseFloat(value);
                handleUpdatedTotalSalary(recalculatedTotalSalary);
                break;
            case 'adjustValue':
                handleAdjustValueChange({ target: { value } });
                break;
            case 'customerName':
                setCustomerName(value || '');
                break;
                case 'totalDriverSalary':
                setTotalDriverSalary(value || '');
                break;
                
            case 'company':
                setCompany(value);
                setFileNumber(value === 'self' ? bookingId : '');
                break;

            case 'fileNumber':
                setFileNumber(value || '');
                break;
            case 'selectedCompany':
                setSelectedCompany(value || '');
                break;

            case 'companies':
                setCompanies(value || '');
                break;
            case 'bookingId':
                setBookingId(value || '');
                break;
            case 'comments':
                setComments(value || '');
                break;
            case 'vehicleNumber':
                setVehicleNumber(value || '');
                break;

            case 'updatedTotalSalary':
                setUpdatedTotalSalary(value || '');
                break;

            case 'distance':
                setDistance(value || '');
                setManualDistance(true);
                break;
            case 'serviceVehicle':
                setServiceVehicle(value);
                break;
            case 'selectedDriver':
                setSelectedDriver(value);
                const selectedDriverData = drivers.find((driver) => driver.id === value);
                if (selectedDriverData && selectedDriverData.serviceVehicle) {
                    setServiceVehicle(renderServiceVehicle(selectedDriverData.serviceVehicle, serviceType));
                }
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
            case 'vehicleType':
                setVehicleType(value || '');
                break;

            case 'pickupLocation':
                if (typeof value === 'string') {
                    setPickupLocation({ ...pickupLocation, name: value });
                } else {
                    setPickupLocation({ ...pickupLocation, name: value.name });
                }
                break;

            case 'vehicleSection':
                setVehicleSection(value || '');
                break;
            case 'vehicleModel':
                setVehicleModel(value || '');
                break;
            case 'baseLocation':
                console.log('baseLocation', baseLocation);
                setBaseLocation(value || '');
                break;

            case 'trappedLocation':
                setDisableFields(value === 'outsideOfRoad'); // Disable fields if trappedLocation is 'outsideOfRoad'

                setTrappedLocation(value || '');
                break;

            case 'selectedDriver':
                setSelectedDriver(value);
                const selectedDriverDetails = drivers.find((driver) => driver.id === value);
                if (selectedDriverDetails) {
                    setServiceVehicle(selectedDriverDetails.serviceVehicle || '');
                }
                break;
            case 'showrooms':
                setShowrooms(value || '');
                break;
            default:
                break;
        }

        if (field === 'serviceType') {
            setServiceType(value || '');
            openModal();
        } else if (field === 'selectedDriver') {
            setSelectedDriver(value || '');
        }
    };
    const selectedDriverData = drivers.find((driver) => driver.id === selectedDriver);
    const openModal = () => {
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleInsuranceAmountBody = (amount) => {
        setInsuranceAmountBody(amount);
    };

    useEffect(() => {}, [showroomLocation]);
    useEffect(() => {}, [updatedTotalSalary]);

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

    const updateShowroomLocation = (location) => {
        setShowroomLocation(location);
    };
    const handleManualChange = (field, value) => {
        setPickupLocation((prev) => ({ ...prev, [field]: value }));
    };
    useEffect(() => {
        const fetchServiceTypes = async () => {
            try {
                const serviceCollection = collection(db, 'service');
                const snapshot = await getDocs(serviceCollection);
                const services = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                setServiceTypes(services);
            } catch (error) {
                console.error('Error fetching service types:', error);
            }
        };

        fetchServiceTypes();
    }, [db]);

    useEffect(() => {
        const db = getFirestore();
        const unsubscribe = onSnapshot(collection(db, 'showroom'), (snapshot) => {
            const showrooms = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setShowRooms(showrooms);
        });

        return () => unsubscribe();
    }, []);

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
                setServiceDetails(details);
            } catch (error) {
                console.error('Error fetching service details:', error);
                setServiceDetails({});
            }
        };

        fetchServiceDetails();
    }, [db, serviceType]);

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
            console.log('numericBasicSalaryy', numericTotalDistance - numericKmValueNumeric);

            return numericBasicSalary + (numericTotalDistance - numericKmValueNumeric) * numericPerKmValueNumeric;
        } else {
            return numericBasicSalary;
        }
    };

    useEffect(() => {
        if (drivers.length > 0) {
            const totalDistances = drivers.map((driver) => {
                return { driverId: driver.id, totalDistance: distanceNumeric };
            });
            console.log('Total Distances:', totalDistances);

            const totalSalaries = drivers.map((driver) => {
                return parseFloat(calculateTotalSalary(serviceDetails.salary, distanceNumeric, serviceDetails.basicSalaryKM, serviceDetails.salaryPerKM).toFixed(2));
            });

            const totalSalary = totalSalaries.reduce((acc, salary) => salary, 0);
            console.log('totalSalary', totalSalary);

            setTotalDistances(totalDistances); // Set totalDistances state
            setTotalSalary(totalSalary);
            // setUpdatedTotalSalary(totalSalary);
        }
    }, [drivers, serviceDetails, distanceNumeric]);

    const renderServiceVehicle = (serviceVehicle, serviceType) => {
        if (serviceVehicle && serviceVehicle[serviceType]) {
            return serviceVehicle[serviceType];
        } else {
            return 'Unknown Vehicle';
        }
    };
    const formatDate = (date) => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
        const year = date.getFullYear();
        const hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = (hours % 12 || 12).toString().padStart(2, '0');
    
        return `${day}/${month}/${year}, ${formattedHours}:${minutes}:${seconds} ${ampm}`;
    };
    
    const addOrUpdateItem = async () => {
        if (validateForm()) {
            try {
                const selectedDriverObject = drivers.find((driver) => driver.id === selectedDriver);
                const driverName = selectedDriverObject ? selectedDriverObject.driverName : '';
                const currentDate = new Date();
                const dateTime = formatDate(currentDate); // Use the formatted date
    
                let finalFileNumber = '';
    
                if (company === 'self') {
                    finalFileNumber = `PMNA${bookingId}`;
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
                    dateTime: dateTime, // Use the formatted date
                    bookingId: `${bookingId}`,
                    createdAt: serverTimestamp(),
                    comments: comments || '',
                    totalDistance: totalDistance,
                    distance: distance,
    
                    baseLocation: baseLocation || '',
                    showroomLocation: showroomLocation,
                    Location: Location || '',
                    company: company || '',
                    customerName: customerName || '',
                    totalDriverSalary: totalDriverSalary || '',
    
                    mobileNumber: mobileNumber || '',
                    phoneNumber: phoneNumber || '',
                    vehicleType: vehicleType || '',
                    serviceType: serviceType || '',
                    serviceVehicle: serviceVehicle || '',
                    vehicleModel: vehicleModel || '',
                    vehicleSection: vehicleSection || '',
                    vehicleNumber: vehicleNumber || '',
                    fileNumber: finalFileNumber,
                    selectedDriver: selectedDriver || '',
                    trappedLocation: trappedLocation || '',
                    updatedTotalSalary: updatedTotalSalary || '',
                    insuranceAmount: insuranceAmountBody || '',
                    paymentStatus: 'Not Paid',
                };
                if (editData) {
                    bookingData.newStatus = 'Edited by Admin';
                    bookingData.editedTime = formatDate(new Date());
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
        }
    };
    
    return (
        <div className="p-1 flex-1 mt-4 mx-24 shadow-lg rounded-lg bg-lightblue-100" style={{ background: 'lightblue' }}>
            <div className="flex justify-end w-full mb-4">
                <div
                    style={{
                        margin: '5px 0',
                        color: '#7f8c8d',
                        fontFamily: 'Georgia, serif',
                        fontSize: '16px',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        backgroundColor: '#ecf0f1',
                        border: '1px solid #bdc3c7',
                        minWidth: 'fit-content',
                    }}
                >
                    <h5 className="font-semibold text-lg dark:text-white-light">{currentDateTime}</h5>
                </div>
            </div>

            <div className="flex flex-wrap p-4">
                <h5 className="font-semibold text-lg dark:text-white-light mb-5">Book Now</h5>
                <div className="w-full">
                    <div className="flex items-center mt-4">
                        <label htmlFor="company" className="mr-2 ml-2 w-1/3 mb-0 text-gray-800 font-semibold">
                            Company
                        </label>
                        <select
                            id="company"
                            name="company"
                            value={company}
                            className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                            onChange={(e) => handleInputChange('company', e.target.value)}
                        >
                            <option value="">Select Company</option>
                            <option value="rsa">RSA Work</option>
                            <option value="self">Payment Work</option>
                        </select>
                    </div>
                    {company === 'rsa' && (
                        <div style={{ display: 'flex', alignItems: 'center', marginTop: '1rem' }}>
                            <label htmlFor="selectedCompany" style={{ marginRight: '0.5rem', marginLeft: '0.5rem', width: '33%', marginBottom: '0', color: '#333' }}>
                                Select Company
                            </label>
                            <select
                                id="selectedCompany"
                                name="selectedCompany"
                                style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    border: '1px solid #ccc',
                                    borderRadius: '5px',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                }}
                                onChange={(e) => handleInputChange('selectedCompany', e.target.value)}
                            >
                                <option value="">Select Company</option>
                                {companies.map((comp) => (
                                    <option key={comp.id} value={comp.id}>
                                        {comp.company}
                                    </option>
                                ))}
                            </select>
                            {companies.length === 0 && <p>No companies available</p>}
                        </div>
                    )}
                    {company === 'self' ? (
                        <div className="flex items-center mt-4">
                            <label htmlFor="fileNumber" className="mr-2 ml-2 w-1/3 mb-0 text-gray-800 font-semibold">
                                File Number
                            </label>
                            <input
                                id="fileNumber"
                                type="text"
                                name="fileNumber"
                                placeholder="Enter File Number"
                                className="form-input lg:w-[250px] w-2/3 p-2 border border-gray-300 rounded-lg shadow-sm bg-gray-100 focus:outline-none"
                                value={`PMNA${bookingId}`}
                                readOnly
                            />
                        </div>
                    ) : (
                        <div className="flex items-center mt-4">
                            <label htmlFor="fileNumber" className="mr-2 ml-2 w-1/3 mb-0 text-gray-800 font-semibold">
                                File Number
                            </label>
                            <input
                                id="fileNumber"
                                type="text"
                                name="fileNumber"
                                className="form-input lg:w-[250px] w-2/3 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                                placeholder="Enter File Number"
                                value={fileNumber}
                                onChange={(e) => handleInputChange('fileNumber', e.target.value)}
                            />
                        </div>
                    )}

                    <div className="flex items-center mt-4">
                        <label htmlFor="showrooms" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
                            Showrooms
                        </label>
                        {showrooms.length > 0 && (
                            <Select
                                id="showrooms"
                                name="showrooms"
                                value={showrooms.find((option) => option.value === showroomLocation)}
                                options={showrooms.map((show) => ({
                                    value: show.Location,
                                    label: show.Location,
                                }))}
                                onChange={(selectedOption) => handleInputChange('showroomLocation', selectedOption.value)}
                                isSearchable={true}
                                placeholder="Select showroom"
                                styles={{
                                    control: (provided) => ({
                                        ...provided,
                                        width: '100%',
                                        padding: '0.5rem',
                                        border: '1px solid #ccc',
                                        borderRadius: '5px',
                                        fontSize: '1rem',
                                        outline: 'none',
                                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                    }),
                                    placeholder: (provided) => ({
                                        ...provided,
                                        fontSize: '1rem',
                                    }),
                                }}
                            />
                        )}
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
                            <IconPlus />
                        </button>
                    </div>
                    <div style={{ fontSize: '1.1em', fontWeight: 'bold', color: '#333', marginTop: '10px', background: 'white', padding: '10px', borderRadius: '10px' }}> {showroomLocation}</div>
                    {showShowroomModal && <ShowroomModal onClose={() => setShowShowroomModal(false)} updateShowroomLocation={updateShowroomLocation} />}
                    <div style={{ width: '100%' }}>
                          
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
                                        background: 'transparent',
                                        color: 'blue',
                                        marginLeft: '10px',
                                        padding: '10px',
                                        border: 'none',
                                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
                                        cursor: 'pointer',
                                        transition: 'background 0.3s ease',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                    onMouseOver={(e) => (e.currentTarget.style.background = 'lightblue')}
                                    onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
                                >
                                    <IconMapPin />
                                </a>
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
                                        placeholder="Dropoff Location"
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
                                        background: 'transparent',
                                        color: 'blue',
                                        marginLeft: '10px',
                                        padding: '10px',
                                        border: 'none',
                                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
                                        cursor: 'pointer',
                                        transition: 'background 0.3s ease',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                    onMouseOver={(e) => (e.currentTarget.style.background = 'lightblue')}
                                    onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
                                >
                                    <IconMapPin />
                                </a>
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
                                        background: 'transparent',
                                        color: 'blue',
                                        marginLeft: '10px',
                                        padding: '10px',
                                        border: 'none',
                                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
                                        cursor: 'pointer',
                                        transition: 'background 0.3s ease',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                    onMouseOver={(e) => (e.currentTarget.style.background = 'lightblue')}
                                    onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
                                >
                                    <IconMapPin style={{ color: '#FF6347', fontSize: '1.5rem' }} />
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
                                        // backgroundColor: 'rgb(0,0,0)',
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
                                            <BaseLocationWithout onClose={closeModal1} setBaseLocation={setBaseLocation} />
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
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
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
                            readOnly={!manualDistance}
                            onClick={() => setManualDistance(true)}
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
                    {trappedLocation === 'outsideOfRoad' && (
                        <div className="flex items-center mt-4">
                            <label htmlFor="updatedTotalSalary" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
                                Updated Total Amount
                            </label>
                            <input
                                id="updatedTotalSalary"
                                type="text"
                                name="updatedTotalSalary"
                                className="form-input flex-1"
                                placeholder="Enter Total Salary"
                                value={updatedTotalSalary}
                                onChange={(e) => setUpdatedTotalSalary(e.target.value)}
                                required
                            />
                        </div>
                    )}
                    {!disableFields && (
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
                                {serviceTypes.map((service) => (
                                    <option key={service.id} value={service.name}>
                                        {service.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                    {!disableFields && (
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
                                            .sort((a, b) => {
                                                if (a.companyName === 'RSA' && b.companyName !== 'RSA') {
                                                    return -1;
                                                }
                                                if (a.companyName !== 'RSA' && b.companyName === 'RSA') {
                                                    return 1;
                                                }
                                                return 0;
                                            })
                                            .map((driver) => (
                                                <div key={driver.id} className="flex items-center border border-gray-200 p-2 rounded-lg">
                                                    <table className="panel p-4 w-full">
                                                        <thead>
                                                            <tr>
                                                                <th>Driver Name</th>
                                                                <th>Company Name</th>
                                                                <th>Select</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td style={{ fontSize: '18px', fontWeight: 'bold', color: 'green' }}>{driver.driverName || 'Unknown Driver'}</td>
                                                                <td>{driver.companyName || 'Unknown Company'}</td>
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
                    )}
                </div>
                {selectedDriver && selectedDriverData && (
                    <React.Fragment>
                        <div>
                            <VehicleSection
                                showroomLocation={showroomLocation}
                                totalSalary={totalSalary}
                                onUpdateTotalSalary={handleUpdatedTotalSalary}
                                insuranceAmountBody={insuranceAmountBody}
                                adjustValueCallback={handleAdjustValueChange}
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
                                <label htmlFor="insuranceAmountBody" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
                                    Insurance Amount Body
                                </label>
                                <div className="form-input flex-1">
                                    <input
                                        id="insuranceAmountBody"
                                        type="text"
                                        name="insuranceAmountBody"
                                        className="w-full"
                                        value={insuranceAmountBody}
                                        onChange={(e) => handleInputChange('insuranceAmountBody', e.target.value)}
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
                )}
                <div className="flex items-center mt-4" style={{ width: '100%' }}>
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
                        onChange={(e) => handleInputChange('serviceVehicle', e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            border: '1px solid #ccc',
                            borderRadius: '5px',
                            fontSize: '1rem',
                            outline: 'none',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        }}
                        required
                    />
                </div>
                <div className="mt-4 flex items-center" style={{ width: '100%' }}>
                    <label htmlFor="totalDriverSalary" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
                    Driver Salary
                    </label>
                    <input
                        id="totalDriverSalary"
                        type="text"
                        name="totalDriverSalary"
                        className="form-input flex-1"
                        placeholder="Enter Driver Salary"
                        value={totalDriverSalary}
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            border: '1px solid #ccc',
                            borderRadius: '5px',
                            fontSize: '1rem',
                            outline: 'none',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        }}
                        onChange={(e) => handleInputChange('totalDriverSalary', e.target.value)}
                    />
                </div>
                <div className="mt-4 flex items-center" style={{ width: '100%' }}>
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
                <div className="mt-4 flex items-center" style={{ width: '100%' }}>
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
                    {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
                </div>
                <div className="mt-4 flex items-center" style={{ width: '100%' }}>
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
                    {errors.mobileNumber && <p className="text-red-500 text-sm mt-1">{errors.mobileNumber}</p>}
                </div>{' '}
                <div className="mt-4 flex items-center" style={{ width: '100%' }}>
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
                <div className="mt-4 flex items-center" style={{ width: '100%' }}>
                    <label htmlFor="vehicleType" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
                        Vehicle Type(2 or 3 or 4 wheeler)
                    </label>
                    <input
                        id="vehicleType"
                        type="text"
                        name="vehicleType"
                        className="form-input flex-1"
                        placeholder="Enter vehicle Type"
                        value={vehicleType}
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            border: '1px solid #ccc',
                            borderRadius: '5px',
                            fontSize: '1rem',
                            outline: 'none',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        }}
                        onChange={(e) => handleInputChange('vehicleType', e.target.value)}
                    />
                </div>
                <div className="flex items-center mt-4" style={{ width: '100%' }}>
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

            <div className="mt-4 grid grid-cols-1 gap-4">
                <button
                    type="button"
                    className={`btn btn-primary bg-green-600 text-white py-2 w-full border-none rounded cursor-pointer ${editData ? 'hover:bg-green-700' : 'hover:bg-green-500'}`}
                    onClick={addOrUpdateItem}
                >
                    {editData ? 'Update' : 'Save'}
                </button>
            </div>
        </div>
    );
};

export default WithoutMapBooking;
