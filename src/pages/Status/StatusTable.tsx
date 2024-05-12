import React, { useEffect, useState } from 'react';
import 'tippy.js/dist/tippy.css';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import { collection, getDocs, getFirestore, onSnapshot, doc, getDoc, query, orderBy } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const StatusTable = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate(); 
    const [editData, setEditData] = useState(null);

    const [recordsData, setRecordsData] = useState([]);
    const [drivers, setDrivers] = useState({});
    const db = getFirestore();

console.log("first",drivers)

    useEffect(() => {
        dispatch(setPageTitle('Status'));

        const fetchBookings = async () => {
            const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            const updatedBookingsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setRecordsData(updatedBookingsData);
            
            // Fetch driver data for each booking
            const driverData = {};
            for (const record of updatedBookingsData) {
                const driverId = record.selectedDriver;
                
                if (driverId && !driverData[driverId]) {
                    const driverDoc = await getDoc(doc(db, 'driver', driverId));
                    if (driverDoc.exists()) {
                        driverData[driverId] = driverDoc.data();
                    }
                }
            }
            setDrivers(driverData);
        };

        const unsubscribe = onSnapshot(collection(db, 'bookings'), () => {
            fetchBookings();
        });

        return () => unsubscribe();
    }, [db, dispatch]);
  
    const handleReassignClick = (record) => {
            navigate(`/bookings/booking/${record.id}`, { state: { editData: record } });
    };
    
    const sortedRecordsData = recordsData.slice().sort((a, b) => {
        const dateA = new Date(a.dateTime);
        const dateB = new Date(b.dateTime);
        return dateB - dateA;
    });

    // Separate "Order Completed" bookings from the rest of the bookings
    const completedBookings = sortedRecordsData.filter(record => record.status === 'Order Completed');
    const ongoingBookings = sortedRecordsData.filter(record => record.status !== 'Order Completed');

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
                                <th>Date & Time</th>
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
                        {ongoingBookings.map((record) => (
    <tr key={record.id}>
        <td>{record.dateTime}</td>
        <td>{record.driver}</td>
        
        <td>{drivers[record.selectedDriver]?.phone} / Personal No:{drivers[record.selectedDriver]?.personalphone}</td>
<td>{record.customerName}</td>
        <td>{record.phoneNumber} / {record.mobileNumber}</td>
        <td>{record.pickupLocation.name}</td>
        <td>{record.dropoffLocation.name}</td>
        <td
            style={{
                color: record.status === 'Rejected' ? 'white' : 'black',
                backgroundColor: record.status === 'Rejected' ? 'red' : 'orange',
                borderRadius: '15px',
                fontWeight: '900',
                cursor: 'pointer',
                textAlign: 'center',
                animation: 'fadeIn 2s ease-in-out',
                lineHeight: '1.5',
                letterSpacing: '1.5px'
            }}
        >
            {record.status}
            {record.status === 'Rejected' && (
                <button
                    className="btn btn-danger rounded-full px-4 py-2 text-white font-semibold shadow-md hover:shadow-lg"
                    onClick={() => handleReassignClick(record)}
                >              
                    Reassign
                </button>
            )}
        </td>
    </tr>
))}

                        </tbody>
                    </table>
                </div>
            </div>

            <div className="panel">
                <h5 className="font-semibold text-lg dark:text-white-light">Order Completed</h5>
                <div className="table-responsive mb-5">
                    <table className="table-hover">
                        <thead>
                            <tr>
                                <th>Date & Time</th>
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
                            {completedBookings.map((record) => (
                                <tr key={record.id}>
                                    <td>{record.dateTime}</td>
                                    <td>{record.driver}</td>
                                    <td>{drivers[record.selectedDriver]?.phone} / Personal No:{drivers[record.selectedDriver]?.personalphone}</td>
                                    <td>{record.customerName}</td>
                                    <td>{record.phoneNumber} / {record.mobileNumber}</td>
                                    <td>{record.pickupLocation.name}</td>
                                    <td>{record.dropoffLocation.name}</td>
                                    <td style={{
                                        color: 'white',
                                        backgroundColor: 'green',
                                        borderRadius: '15px',
                                        fontWeight: '900',
                                        cursor: 'pointer',
                                        textAlign: 'center',
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
