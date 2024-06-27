import { getFirestore, collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const CashCollectionReport = () => {
    const { id } = useParams();
    const [bookings, setBookings] = useState([]);
    const [driver, setDriver] = useState(null);
    const db = getFirestore();

    useEffect(() => {
        const fetchDriver = async () => {
            try {
                const driverRef = doc(db, 'driver', id);
                const driverSnap = await getDoc(driverRef);
                if (driverSnap.exists()) {
                    setDriver(driverSnap.data());
                } else {
                    console.log('No such document!');
                }
            } catch (error) {
                console.error('Error fetching driver:', error);
            }
        };

        fetchDriver();
    }, [db, id]);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const bookingsRef = collection(db, 'bookings');
                const q = query(bookingsRef, where('selectedDriver', '==', id));
                const querySnapshot = await getDocs(q);

                const bookingsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setBookings(bookingsData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchBookings();
    }, [db, id]);

    return (
        <div>
            <h1>Cash Collection Report</h1>
            {driver ? (
                <p>Advance Payment: {driver.advancePayment}</p>
            ) : (
                <p>Loading driver data...</p>
            )}
            {bookings.length === 0 ? (
                <p>No bookings found for this driver.</p>
            ) : (
                <table className="min-w-full bg-white">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="py-2 px-4">Booking ID</th>
                            <th className="py-2 px-4">Amount (from customer)</th>
                            <th className="py-2 px-4">Booking Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map(booking => (
                            <tr key={booking.id} className="hover:bg-gray-50">
                                <td className="border px-4 py-2">{booking.fileNumber}</td>
                                <td className="border px-4 py-2">{booking.amount}</td>
                                <td className="border px-4 py-2">{booking.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default CashCollectionReport;
