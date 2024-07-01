import { getFirestore, collection, query, where, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import IconEdit from '../../components/Icon/IconEdit';

const CashCollectionReport = () => {
    const { id } = useParams();
    const [bookings, setBookings] = useState([]);
    const [driver, setDriver] = useState(null);
    const [editingBooking, setEditingBooking] = useState(null);
    const [editingAmount, setEditingAmount] = useState('');
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

    const calculateTotalAmounts = (advancePayment, bookings) => {
        let runningTotal = advancePayment;
        return bookings.map(booking => {
            runningTotal += parseFloat(booking.amount) || 0;
            return { ...booking, totalInHand: runningTotal };
        });
    };

    const updateDriverNetTotal = async (netTotal) => {
        try {
            const driverRef = doc(db, 'driver', id);
            await updateDoc(driverRef, { netTotalAmountInHand: netTotal });
        } catch (error) {
            console.error('Error updating driver net total amount:', error);
        }
    };

    const handleEditClick = (booking) => {
        setEditingBooking(booking);
        setEditingAmount(booking.amount);
    };

    const handleSaveClick = async () => {
        try {
            const bookingRef = doc(db, 'bookings', editingBooking.id);
            await updateDoc(bookingRef, { amount: parseFloat(editingAmount) });
            setBookings(bookings.map(booking =>
                booking.id === editingBooking.id ? { ...booking, amount: parseFloat(editingAmount) } : booking
            ));
            setEditingBooking(null);
        } catch (error) {
            console.error('Error updating document:', error);
        }
    };

    const bookingsWithTotal = driver ? calculateTotalAmounts(parseFloat(driver.advancePayment) || 0, bookings) : [];
    const netTotalAmountInHand = bookingsWithTotal.length > 0 ? bookingsWithTotal[bookingsWithTotal.length - 1].totalInHand : 0;

    useEffect(() => {
        if (driver) {
            updateDriverNetTotal(netTotalAmountInHand);
        }
    }, [driver, netTotalAmountInHand]);

    return (
        <div className="container mx-auto my-10 p-5 bg-gray-50 shadow-lg rounded-lg">
            <h1 className="text-3xl font-bold mb-5 text-center text-gray-800">Cash Collection Report</h1>
            {driver ? (
                <p className="text-lg font-semibold text-gray-700 mb-5">
                    Advance Payment: {driver.advancePayment}
                </p>
            ) : (
                <p className="text-lg font-semibold text-gray-700 mb-5">Loading driver data...</p>
            )}
            {bookings.length === 0 ? (
                <p className="text-lg text-gray-700">No bookings found for this driver.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                                <th className="py-3 px-6 text-left">BookingId</th>
                                <th className="py-3 px-6 text-left">Amount (from customer)</th>
                                <th className="py-3 px-6 text-left">Total Amount (In Hand)</th>
                                <th className="py-3 px-6 text-left">Edit</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600 text-sm font-light">
                            {bookingsWithTotal.map(booking => (
                                <tr key={booking.id} className="border-b border-gray-200 hover:bg-gray-100">
                                    <td className="py-3 px-6 text-left whitespace-nowrap">{booking.fileNumber}</td>
                                    <td className="py-3 px-6 text-left">
                                        {editingBooking?.id === booking.id ? (
                                            <input
                                                type="text"
                                                value={editingAmount}
                                                onChange={(e) => setEditingAmount(e.target.value)}
                                                className="px-2 py-1 border rounded"
                                            />
                                        ) : (
                                            booking.amount
                                        )}
                                    </td>
                                    <td className="py-3 px-6 text-left">{booking.totalInHand}</td>
                                    <td className="py-3 px-6 text-left">
                                        {editingBooking?.id === booking.id ? (
                                            <button
                                                onClick={handleSaveClick}
                                                className="px-2 py-1 bg-blue-500 text-white rounded"
                                            >
                                                Save
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleEditClick(booking)}
                                                className="px-2 py-1 bg-yellow-500 text-white rounded"
                                            >
                                                <IconEdit />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                                <td className="py-3 px-6 text-left font-bold" colSpan="2">Net Total Amount (In Hand)</td>
                                <td className="py-3 px-6 text-left font-bold">{netTotalAmountInHand}</td>
                                <td className="py-3 px-6 text-left"></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            )}
        </div>
    );
};

export default CashCollectionReport;
