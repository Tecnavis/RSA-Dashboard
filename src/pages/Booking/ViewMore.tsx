import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getFirestore, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

const ViewMore = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [bookingDetails, setBookingDetails] = useState(null);
    const db = getFirestore();
    const { search } = useLocation();
    const [showPickupDetails, setShowPickupDetails] = useState(false);
    const [showDropoffDetails, setShowDropoffDetails] = useState(false);
    const queryParams = new URLSearchParams(search);
    const [editData, setEditData] = useState(null);
    const [staffName, setStaffName] = useState('Admin');
    const [ShowRoom, setShowRoom] = useState('');

    useEffect(() => {
        const fetchBookingDetails = async () => {
            try {
                const docRef = doc(db, 'bookings', id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setBookingDetails({
                        ...data,
                        kilometer: data.kilometer || 'No data',
                        kilometerdrop: data.kilometerdrop || 'No data',
                        photo: data.photo,
                        photodrop: data.photodrop,
                        rcBookImageURLs: data.rcBookImageURLs || [],
                        vehicleImageURLs: data.vehicleImageURLs || [],
                        vehicleImgURLs: data.vehicleImgURLs || [],
                        fuelBillImageURLs: data.fuelBillImageURLs || [],
                    });
                    if (data.staffId) {
                        fetchStaffName(data.staffId);
                    }
                } else {
                    console.log(`Document with ID ${id} does not exist!`);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        const fetchStaffName = async (staffId) => {
            try {
                const staffDocRef = doc(db, 'users', staffId);
                const staffDocSnap = await getDoc(staffDocRef);

                if (staffDocSnap.exists()) {
                    setStaffName(staffDocSnap.data().name);
                } else {
                    console.log(`Staff with ID ${staffId} does not exist!`);
                }
            } catch (error) {
                console.error('Error fetching staff data:', error);
            }
        };

        fetchBookingDetails();
    }, [db, id]);

    const togglePickupDetails = () => {
        setShowPickupDetails(!showPickupDetails);
        setShowDropoffDetails(false);
    };

    const toggleDropoffDetails = () => {
        setShowDropoffDetails(!showDropoffDetails);
        setShowPickupDetails(false);
    };

    const handleDeleteBooking = async () => {
        const confirmDelete = window.confirm('Are you sure you want to delete this booking?');
        if (confirmDelete) {
            try {
                await deleteDoc(doc(db, 'bookings', id));
                console.log('Document successfully deleted!');
                navigate('/bookings/newbooking');
            } catch (error) {
                console.error('Error deleting document:', error);
            }
        }
    };

    if (!bookingDetails) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto my-8 p-4 bg-white shadow rounded-lg">
            <h5 className="font-semibold text-lg mb-5">Booking Details</h5>
            <div className="flex mb-5">
                <button onClick={togglePickupDetails} className="mr-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    {showPickupDetails ? 'Close' : 'Show Pickup Details'}
                </button>
                <button onClick={toggleDropoffDetails} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                    {showDropoffDetails ? 'Close' : 'Show Dropoff Details'}
                </button>
            </div>

            {showPickupDetails && (
                <div>
                    {bookingDetails.kilometer && (
                        <div className="my-4">
                            <strong>Pickup Kilometer:</strong> {bookingDetails.kilometer}
                        </div>
                    )}
                    {bookingDetails.photo && (
                        <div className="my-4 flex">
                            <strong>Pickup Km Photo:</strong>
                            <img src={bookingDetails.photo} alt="Pickup Km Photo" className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5" />
                        </div>
                    )}

                    <h3 className="text-xl font-bold mt-5">RC Book Images</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {bookingDetails.rcBookImageURLs.length > 0 ? (
                            bookingDetails.rcBookImageURLs.map((url, index) => (
                                <div key={index} className="max-w-xs">
                                    <img src={url} alt={`RC Book Image ${index}`} className="w-full h-auto" />
                                </div>
                            ))
                        ) : (
                            <p className="col-span-3">No RC Book Images available.</p>
                        )}
                    </div>

                    <h2 className="text-xl font-bold mt-5">Vehicle Images (Pickup)</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {bookingDetails.vehicleImageURLs.length > 0 ? (
                            bookingDetails.vehicleImageURLs.map((url, index) => (
                                <div key={index} className="max-w-xs">
                                    <img src={url} alt={`Vehicle Image ${index}`} className="w-full h-auto" />
                                </div>
                            ))
                        ) : (
                            <p className="col-span-full">No Vehicle Images available.</p>
                        )}
                    </div>
                </div>
            )}

            {showDropoffDetails && (
                <div>
                    {bookingDetails.kilometerdrop && (
                        <div className="my-4">
                            <strong>Dropoff Kilometer:</strong> {bookingDetails.kilometerdrop}
                        </div>
                    )}
                    {bookingDetails.photodrop && (
                        <div className="my-4 flex">
                            <strong>Dropoff Km Photo:</strong>
                            <img src={bookingDetails.photodrop} alt="Dropoff Km Photo" className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5" />
                        </div>
                    )}
                    <h3 className="text-xl font-bold mt-5">Fuel Bill Images</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {bookingDetails.fuelBillImageURLs.length > 0 ? (
                            bookingDetails.fuelBillImageURLs.map((url, index) => (
                                <div key={index} className="max-w-xs">
                                    <img src={url} alt={`Fuel Bill Image ${index}`} className="w-full h-auto" />
                                </div>
                            ))
                        ) : (
                            <p className="col-span-3">No Fuel Bill Images available.</p>
                        )}
                    </div>

                    <h2 className="text-xl font-bold mt-5">Vehicle Images (Dropoff)</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {bookingDetails.vehicleImgURLs.length > 0 ? (
                            bookingDetails.vehicleImgURLs.map((url, index) => (
                                <div key={index} className="max-w-xs">
                                    <img src={url} alt={`Vehicle Image ${index}`} className="w-full h-auto" />
                                </div>
                            ))
                        ) : (
                            <p className="col-span-full">No Vehicle Images available.</p>
                        )}
                    </div>
                </div>
            )}

            <table className="w-full border-collapse mt-5">
                <tbody>
                    <tr>
                        <td className="bg-gray-100 p-2 font-semibold">Date & Time :</td>
                        <td className="p-2">{bookingDetails.dateTime}</td>
                    </tr>
                    <tr>
                        <td className="bg-gray-100 p-2 font-semibold">Booking ID :</td>
                        <td className="p-2">{bookingDetails.bookingId}</td>
                    </tr>
                    <tr>
                        <td className="bg-gray-100 p-2 font-semibold">Staff Name :</td>
                        <td className="p-2">{staffName}</td>
                    </tr>
                    <tr>
                        <td className="bg-gray-100 p-2 font-semibold">Edited person :</td>
                        <td className="p-2">{bookingDetails.newStatus}, {bookingDetails.editedTime}</td>
                    </tr>
                    <tr>
                        <td className="bg-gray-100 p-2 font-semibold">Amount without insurance :</td>
                        <td className="p-2">{bookingDetails.totalSalary}</td>
                    </tr>
                    <tr>
                        <td className="bg-gray-100 p-2 font-semibold">Payable Amount with insurance:</td>
                        <td className="p-2">{bookingDetails.updatedTotalSalary}</td>
                    </tr>
                    <tr>
                        <td className="bg-gray-100 p-2 font-semibold">Company :</td>
                        <td className="p-2">{bookingDetails.company}</td>
                    </tr>
                    <tr>
                        <td className="bg-gray-100 p-2 font-semibold">Trapped Location :</td>
                        <td className="p-2">{bookingDetails.trappedLocation}</td>
                    </tr>
                    <tr>
                        <td className="bg-gray-100 p-2 font-semibold">Showroom :</td>
                        <td className="p-2">{bookingDetails.showroomLocation}</td>
                    </tr>
                    <tr>
                        <td className="bg-gray-100 p-2 font-semibold">File Number :</td>
                        <td className="p-2">{bookingDetails.fileNumber}</td>
                    </tr>
                    <tr>
                        <td className="bg-gray-100 p-2 font-semibold">Customer Name :</td>
                        <td className="p-2">{bookingDetails.customerName}</td>
                    </tr>
                    <tr>
                        <td className="bg-gray-100 p-2 font-semibold">Driver :</td>
                        <td className="p-2">{bookingDetails.driver}</td>
                    </tr>
                    <tr>
                        <td className="bg-gray-100 p-2 font-semibold">Customer Vehicle Number :</td>
                        <td className="p-2">{bookingDetails.vehicleNumber}</td>
                    </tr>
                    <tr>
                        <td className="bg-gray-100 p-2 font-semibold">Brand Name :</td>
                        <td className="p-2">{bookingDetails.vehicleModel}</td>
                    </tr>
                    <tr>
                        <td className="bg-gray-100 p-2 font-semibold">Phone Number :</td>
                        <td className="p-2">{bookingDetails.phoneNumber}</td>
                    </tr>
                    <tr>
                        <td className="bg-gray-100 p-2 font-semibold">Mobile Number :</td>
                        <td className="p-2">{bookingDetails.mobileNumber}</td>
                    </tr>
                    <tr>
                        <td className="bg-gray-100 p-2 font-semibold">Start Location:</td>
                        <td className="p-2">
                            {bookingDetails.baseLocation
                                ? `${bookingDetails.baseLocation.name}, Lat: ${bookingDetails.baseLocation.lat}, Lng: ${bookingDetails.baseLocation.lng}`
                                : 'Location not selected'}
                        </td>
                    </tr>
                    <tr>
                        <td className="bg-gray-100 p-2 font-semibold">Pickup Location:</td>
                        <td className="p-2">
                            {bookingDetails.pickupLocation
                                ? `${bookingDetails.pickupLocation.name}, Lat: ${bookingDetails.pickupLocation.lat}, Lng: ${bookingDetails.pickupLocation.lng}`
                                : 'Location not selected'}
                        </td>
                    </tr>
                    <tr>
                        <td className="bg-gray-100 p-2 font-semibold">Dropoff Location:</td>
                        <td className="p-2">
                            {bookingDetails.dropoffLocation
                                ? `${bookingDetails.dropoffLocation.name}, Lat: ${bookingDetails.dropoffLocation.lat}, Lng: ${bookingDetails.dropoffLocation.lng}`
                                : 'Location not selected'}
                        </td>
                    </tr>
                    <tr>
                        <td className="bg-gray-100 p-2 font-semibold">Distance :</td>
                        <td className="p-2">{bookingDetails.distance}</td>
                    </tr>
                    <tr>
                        <td className="bg-gray-100 p-2 font-semibold">Service Type :</td>
                        <td className="p-2">{bookingDetails.serviceType}</td>
                    </tr>
                    <tr>
                        <td className="bg-gray-100 p-2 font-semibold">Service Vehicle Number :</td>
                        <td className="p-2">{bookingDetails.serviceVehicle}</td>
                    </tr>
                    <tr>
                        <td className="bg-gray-100 p-2 font-semibold">Comments :</td>
                        <td className="p-2">{bookingDetails.comments}</td>
                    </tr>
                </tbody>
            </table>

            <div className="flex justify-end mt-5">
                <button onClick={handleDeleteBooking} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                    Delete Booking
                </button>
                {/* <button onClick={handleUpdateBooking} className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Update
                </button> */}
            </div>
        </div>
    );
};

export default ViewMore;
