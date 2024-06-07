import React, { useEffect, useState } from 'react';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';

const SalesSummery = () => {
    const [completedBookings, setCompletedBookings] = useState([]);
    const [loading, setLoading] = useState(true);
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

    return (
        <div className="p-5">
            <h5 className="font-semibold text-lg dark:text-white-light mb-5">Sales Summary</h5>
            {loading ? (
                <div className="flex justify-center items-center">
                    <span className="loader"></span> {/* Add a loading spinner or animation here */}
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white dark:bg-gray-800 border-collapse">
                        <thead>
                            <tr>
                                {['Date & Time', 'Booking Id', 'File Number', 'Driver Name', 'Driver Contact Number', 'Customer Name', 'Customer Contact Number', 'Pickup Location', 'Dropoff Location', 'ServiceType', 'ServiceVehicle', 'VehicleModel', 'Company', 'VehicleNumber', 'TotalDistance', 'Payable Amount', 'Comments'].map((heading) => (
                                    <th key={heading} className="px-6 py-3 border-b-2 border-gray-300 dark:border-gray-700 text-left leading-4 text-gray-600 dark:text-gray-300 tracking-wider">
                                        {heading}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {completedBookings.map((record) => (
                                <tr key={record.id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <td className="px-6 py-4 border-b border-gray-300 dark:border-gray-700">{record.dateTime}</td>
                                    <td className="px-6 py-4 border-b border-gray-300 dark:border-gray-700">{record.bookingId}</td>
                                    <td className="px-6 py-4 border-b border-gray-300 dark:border-gray-700">{record.fileNumber}</td>
                                    <td className="px-6 py-4 border-b border-gray-300 dark:border-gray-700">{record.driver}</td>
                                    <td className="px-6 py-4 border-b border-gray-300 dark:border-gray-700">
                                        {record.driverContact} / {record.driverPersonalContact}
                                    </td>
                                    <td className="px-6 py-4 border-b border-gray-300 dark:border-gray-700">{record.customerName}</td>
                                    <td className="px-6 py-4 border-b border-gray-300 dark:border-gray-700">
                                        {record.phoneNumber} / {record.mobileNumber}
                                    </td>
                                    <td className="px-6 py-4 border-b border-gray-300 dark:border-gray-700">{record.pickupLocation ? record.pickupLocation.name : 'N/A'}</td>
                                    <td className="px-6 py-4 border-b border-gray-300 dark:border-gray-700">{record.dropoffLocation ? record.dropoffLocation.name : 'N/A'}</td>
                                    <td className="px-6 py-4 border-b border-gray-300 dark:border-gray-700">{record.serviceType}</td>
                                    <td className="px-6 py-4 border-b border-gray-300 dark:border-gray-700">{record.serviceVehicle}</td>
                                    <td className="px-6 py-4 border-b border-gray-300 dark:border-gray-700">{record.vehicleModel}</td>
                                    <td className="px-6 py-4 border-b border-gray-300 dark:border-gray-700">{record.company}</td>
                                    <td className="px-6 py-4 border-b border-gray-300 dark:border-gray-700">{record.vehicleNumber}</td>
                                    <td className="px-6 py-4 border-b border-gray-300 dark:border-gray-700">{record.totalDistance}</td>
                                    <td className="px-6 py-4 border-b border-gray-300 dark:border-gray-700">{record.totalSalary}</td>
                                    <td className="px-6 py-4 border-b border-gray-300 dark:border-gray-700">{record.comments}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default SalesSummery;
