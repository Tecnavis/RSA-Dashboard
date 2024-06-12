import React, { useEffect, useState } from 'react';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import IconLoader from '../../../components/Icon/IconLoader';

const SalesSummary = () => {
    const [completedBookings, setCompletedBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null); // State to hold selected booking
    const [showModal, setShowModal] = useState(false); // State to control modal visibility
    const db = getFirestore();

    useEffect(() => {
        const fetchCompletedBookings = async () => {
            try {
                const q = query(collection(db, 'bookings'), where('status', '==', 'Order Completed'));
                const querySnapshot = await getDocs(q);
                const bookingsData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setCompletedBookings(bookingsData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching completed bookings:', error);
                setLoading(false);
            }
        };

        fetchCompletedBookings();
    }, [db]);

    // Function to handle click on bookingId link
    const handleBookingClick = (booking) => {
        setSelectedBooking(booking);
        setShowModal(true); // Display modal
    };

    return (
        <div className="p-5">
            <h5 className="font-semibold text-lg dark:text-white-light mb-5">Sales Summary</h5>
            {loading ? (
                <div className="flex justify-center items-center">
                    <span className="loader"> <IconLoader/></span> {/* Add a loading spinner or animation here */}
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white dark:bg-gray-800 border-collapse">
                        <thead className="bg-gray-200 dark:bg-gray-700">
                            <tr>
                                {['Date & Time', 'Booking Id', 'File Number', 'Driver Name', 'Driver Contact Number', 'Customer Name', 'Customer Contact Number', 'Pickup Location', 'Dropoff Location', 'ServiceType'].map((heading) => (
                                    <th key={heading} className="px-4 py-2 border-b-2 border-gray-300 dark:border-gray-700 text-left text-sm font-medium text-gray-600 dark:text-gray-300 tracking-wider">
                                        {heading}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {completedBookings.map((record) => (
                                <tr key={record.id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 text-sm">{record.dateTime}</td>
                                    <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 text-sm">
                                        <a href="#" onClick={() => handleBookingClick(record)} className="text-blue-500 hover:underline">
                                            {record.bookingId}
                                        </a>
                                    </td>
                                    <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 text-sm">{record.fileNumber}</td>
                                    <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 text-sm">{record.driver}</td>
                                    <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 text-sm">
                                        {record.driverContact} / {record.driverPersonalContact}
                                    </td>
                                    <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 text-sm">{record.customerName}</td>
                                    <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 text-sm">
                                        {record.phoneNumber} / {record.mobileNumber}
                                    </td>
                                    <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 text-sm">{record.pickupLocation ? record.pickupLocation.name : 'N/A'}</td>
                                    <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 text-sm">{record.dropoffLocation ? record.dropoffLocation.name : 'N/A'}</td>
                                    <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 text-sm">{record.serviceType}</td>                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal for displaying booking details */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl">
                        <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-700" onClick={() => setShowModal(false)}>
                            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full">
        <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-700" onClick={() => setShowModal(false)}>
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
        {/* Display booking details */}
        {selectedBooking && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl">
    <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Booking Details</h2>

    <div className="grid grid-cols-2 gap-4">
    <div className="flex flex-col">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Date & Time:</p>
            <p className="text-sm">{selectedBooking.dateTime}</p>
        </div>
        <div className="flex flex-col">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">File Number:</p>
            <p className="text-sm">{selectedBooking.fileNumber}</p>
        </div>
        <div className="flex flex-col">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Driver Name:</p>
            <p className="text-sm">{selectedBooking.driver}</p>
        </div>
        <div className="flex flex-col">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Driver Contact Number:</p>
            <p className="text-sm">{selectedBooking.driverContact} / {selectedBooking.driverPersonalContact}</p>
        </div>
        <div className="flex flex-col">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Customer Name:</p>
            <p className="text-sm">{selectedBooking.customerName}</p>
        </div>
        <div className="flex flex-col">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Customer Contact Number:</p>
            <p className="text-sm">{selectedBooking.phoneNumber} / {selectedBooking.mobileNumber}</p>
        </div>
        <div className="flex flex-col">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pickup Location:</p>
            <p className="text-sm">{selectedBooking.pickupLocation ? selectedBooking.pickupLocation.name : 'N/A'}</p>
        </div>
        <div className="flex flex-col">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Dropoff Location:</p>
            <p className="text-sm">{selectedBooking.dropoffLocation ? selectedBooking.dropoffLocation.name : 'N/A'}</p>
        </div>
        <div className="flex flex-col">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">ServiceType:</p>
                    <p className="text-sm">{selectedBooking.serviceType}</p>
                    </div>
                    <div className="flex flex-col">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">ServiceVehicle:</p>
                    <p className="text-sm">{selectedBooking.serviceVehicle}</p>
                    </div>
                    <div className="flex flex-col">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">VehicleModel:</p>
                    <p className="text-sm">{selectedBooking.vehicleModel}</p>
                    </div>
                    <div className="flex flex-col">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Company:</p>
                    <p className="text-sm">{selectedBooking.company}</p>
                    </div>
                    <div className="flex flex-col">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">VehicleNumber:</p>
                    <p className="text-sm">{selectedBooking.vehicleNumber}</p>
                    </div>
                    <div className="flex flex-col">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">TotalDistance:</p>
                    <p className="text-sm">{selectedBooking.totalDistance}</p>
                    </div>
                    <div className="flex flex-col">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Payable Amount:</p>
                    <p className="text-sm">{selectedBooking.updatedTotalSalary}</p>
                    </div>
                    <div className="flex flex-col">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Comments:</p>
                    <p className="text-sm">{selectedBooking.comments}</p>
                    </div>

                </div>
            </div>
        )}
       <button
    className="inline-flex items-center justify-center w-10 h-10 bg-red-500 hover:bg-red-700 text-white font-bold rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
    onClick={() => setShowModal(false)}
>
    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
</button>

    </div>
</div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default SalesSummary;
