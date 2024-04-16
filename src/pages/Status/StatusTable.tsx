
import React, { useEffect, useState } from 'react';
import 'tippy.js/dist/tippy.css';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import { collection, getDocs, getFirestore } from 'firebase/firestore';

const StatusTable = () => {
    const dispatch = useDispatch();
    const [recordsData, setRecordsData] = useState([]);
    const [drivers, setDrivers] = useState({});
    const db = getFirestore();

    useEffect(() => {
        dispatch(setPageTitle('Status'));

        const fetchData = async () => {
            // Fetch bookings
            const bookingSnapshot = await getDocs(collection(db, 'bookings'));
            const bookingsData = bookingSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            // Fetch drivers
            const driverSnapshot = await getDocs(collection(db, 'driver'));
            const driversData = driverSnapshot.docs.reduce((acc, doc) => {
                const data = doc.data();
                acc[data.id] = data.phone; // Assuming 'id' and 'phone' are field names in your driver documents
                return acc;
            }, {});

            setRecordsData(bookingsData);
            setDrivers(driversData);
        };

        fetchData().catch(console.error);
    }, [db, dispatch]);

    return (
        <div className="grid xl:grid-cols-1 gap-6 grid-cols-1">
            <div className="panel">
                <div className="flex items-center justify-between mb-5">
                    <h5 className="font-semibold text-lg dark:text-white-light">Driver Status</h5>
                </div>
                <div className="table-responsive mb-5">
                    <table className="table-hover">
                        <thead>
                            <tr>
                                <th>Driver Name</th>
                                <th>Driver Contact Number</th>
                                <th>Customer Name</th>
                                <th>Customer Contact Number</th>
                                <th>Pickup Location</th>
                                <th>DropOff Location</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recordsData.map((record) => (
                                <tr key={record.id}>
                                    <td>{record.driver}</td>
                                    <td>{drivers[record.driverId]}</td> {/* Use the driver ID to access the phone number */}
                                    <td>{record.customerName}</td>
                                    <td>{record.mobileNumber}</td>
                                    <td>{record.pickupLocation.name}</td>
                                    <td>{record.dropoffLocation.name}</td>
                                    <td style={{
                                        color: 'white', 
                                        backgroundColor: 'RGB(40, 167, 69)', 
                                        borderRadius: '15px',
                                        fontWeight:'900',
                                        cursor: 'pointer',
                                        textAlign:'center',
                                        animation: 'fadeIn 2s ease-in-out',
                                        lineHeight: '1.5',
                                        letterSpacing: '1.5px'
                                    }}>
                                        {record.status}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StatusTable;
