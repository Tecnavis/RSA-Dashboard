import { getFirestore, collection, query, where, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // Import useHistory
import IconMenuInvoice from '../../components/Icon/Menu/IconMenuInvoice';

const CashCollectionReport = () => {
    const { id } = useParams();
    const [bookings, setBookings] = useState([]);
    const [driver, setDriver] = useState(null);
    const [editingBooking, setEditingBooking] = useState(null);
    const [editingAmount, setEditingAmount] = useState('');
    const [receivedAmount, setReceivedAmount] = useState('');
    const db = getFirestore();
    const navigate = useNavigate(); // Initialize useHistory

    useEffect(() => {
        const fetchDriver = async () => {
            try {
                const driverRef = doc(db, 'driver', id);
                const driverSnap = await getDoc(driverRef);
                if (driverSnap.exists()) {
                    const driverData = driverSnap.data();
                    setDriver(driverData);
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

    const updateBookingAmount = async (bookingId, newAmount) => {
        try {
            const bookingRef = doc(db, 'bookings', bookingId);
            await updateDoc(bookingRef, { amount: parseFloat(newAmount) });

            setBookings(prevBookings =>
                prevBookings.map(booking =>
                    booking.id === bookingId ? { ...booking, amount: parseFloat(newAmount) } : booking
                )
            );

            // Recalculate and update total balance
            updateTotalBalance();
        } catch (error) {
            console.error('Error updating booking amount:', error);
        }
    };

    const handleEditClick = (booking) => {
        setEditingBooking(booking);
        setEditingAmount(booking.amount.toString()); // Convert amount to string for editing
    };

    const handleSaveClick = async () => {
        try {
            await updateBookingAmount(editingBooking.id, editingAmount);
            setEditingBooking(null);
        } catch (error) {
            console.error('Error saving booking:', error);
        }
    };

    const handleInvoiceClick = (booking) => {
        // Navigate to driver invoice page with booking details
        const balance = calculateBalance(booking.amount, booking.receivedAmount || 0);
        navigate(`/users/driver/driverdetails/cashcollection/driverInvoice/${booking.id}`, {
            state: {
                amount: booking.amount,
                receivedAmount: booking.receivedAmount || 0,
                balance: balance
            }
        });
    };

    const handleAmountReceivedChange = async (bookingId, receivedAmount) => {
        try {
            const bookingRef = doc(db, 'bookings', bookingId);
            await updateDoc(bookingRef, {
                receivedAmount: parseFloat(receivedAmount),
                balance: calculateBalance(bookings.find(booking => booking.id === bookingId).amount, receivedAmount)
            });

            const updatedBookings = bookings.map(booking =>
                booking.id === bookingId ? { ...booking, receivedAmount: parseFloat(receivedAmount) } : booking
            );
            setBookings(updatedBookings);

            // Recalculate and update total balance
            updateTotalBalance();
        } catch (error) {
            console.error('Error updating received amount:', error);
        }
    };

    const calculateBalance = (amount, receivedAmount) => {
        const balance = (parseFloat(amount) - parseFloat(receivedAmount)).toFixed(2);
        console.log(`Balance: ${balance}`);
        return balance;
    };
    
    const calculateNetTotalAmountInHand = () => {
        // Check if driver and bookings are defined before calculating
        if (!driver || bookings.length === 0) {
            console.log('Driver data or bookings not yet available');
            return 'Loading...'; // or some default value
        }
    
        // Calculate total balance for all bookings
        const totalBalance = bookings.reduce((acc, booking) => {
            if (booking.amount === undefined || isNaN(booking.amount)) {
                console.warn(`Skipping booking with invalid amount: Booking ID: ${booking.id}, Amount: ${booking.amount}`);
                return acc;
            }
            
            const balance = calculateBalance(booking.amount, booking.receivedAmount || 0);
            console.log(`Booking ID: ${booking.id}, Amount: ${booking.amount}, Received Amount: ${booking.receivedAmount || 0}, Balance: ${balance}`);
            return acc + parseFloat(balance);
        }, 0);
    
        console.log('Total Balance:', totalBalance);
    
        // Calculate Net Total Amount (In Hand)
        const netTotalAmountInHand = parseFloat(driver.advancePayment || 0) + totalBalance;
        return netTotalAmountInHand.toFixed(2);
    };
    

    const updateTotalBalance = async () => {
        try {
            const totalBalance = bookings.reduce((acc, booking) => {
                const balance = parseFloat(booking.amount) - parseFloat(booking.receivedAmount || 0);
                return acc + balance;
            }, 0);

            const driverRef = doc(db, 'driver', id);
            await updateDoc(driverRef, { totalBalance: totalBalance });

            console.log('Total Balance updated successfully:', totalBalance);
        } catch (error) {
            console.error('Error updating total balance:', error);
        }
    };

    const handleApproveClick = async (bookingId) => {
        try {
            const bookingRef = doc(db, 'bookings', bookingId);
            await updateDoc(bookingRef, { approved: true });

            setBookings(prevBookings =>
                prevBookings.map(booking =>
                    booking.id === bookingId ? { ...booking, approved: true } : booking
                )
            );
        } catch (error) {
            console.error('Error approving booking:', error);
        }
    };

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
            <div className="mb-5 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded-lg shadow-md">
                <p className="text-2xl font-bold">
                    Net Total Amount (In Hand): <span className="text-blue-900">{calculateNetTotalAmountInHand()}</span>
                </p>
            </div>
            {bookings.length === 0 ? (
                <p className="text-lg text-gray-700">No bookings found for this driver.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                                <th className="py-3 px-6 text-left">Date Time</th>
                                <th className="py-3 px-6 text-left">Booking ID</th>
                                <th className="py-3 px-6 text-left">Amount (from customer)</th>
                                <th className="py-3 px-6 text-left">Amount Received from Driver</th>
                                <th className="py-3 px-6 text-left">Balance</th>
                                <th className="py-3 px-6 text-left">Actions</th>

                            </tr>
                        </thead>
                        <tbody className="text-gray-600 text-sm font-light">
    {bookings.map(booking => (
        <tr key={booking.id} className={`border-b border-gray-200 hover:bg-gray-100 ${booking.approved ? 'bg-green-100' : ''}`}>
            <td className="py-3 px-6 text-left whitespace-nowrap">{booking.dateTime}</td>
            <td className="py-3 px-6 text-left whitespace-nowrap">{booking.fileNumber}</td>
            <td className="py-3 px-6 text-left">
                {editingBooking?.id === booking.id ? (
                    <input
                        type="text"
                        value={editingAmount}
                        onChange={(e) => setEditingAmount(e.target.value)}
                        className="px-2 py-1 border rounded"
                        disabled={booking.approved}
                    />
                ) : (
                    booking.amount
                )}
            </td>
            <td className="py-3 px-6 text-left">
                <input
                    type="text"
                    value={booking.receivedAmount || ''}
                    onChange={(e) => handleAmountReceivedChange(booking.id, e.target.value)}
                    className="px-2 py-1 border rounded"
                    disabled={booking.approved}
                />
            </td>
            <td className="py-3 px-6 text-left">
                {calculateBalance(booking.amount, booking.receivedAmount)}
            </td>
            <td className="py-3 px-6 text-left flex space-x-2">
                {editingBooking?.id === booking.id ? (
                    <>
                        <button
                            onClick={handleSaveClick}
                            className="px-3 py-1 bg-blue-500 text-white rounded shadow-md hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105"
                            disabled={booking.approved}
                        >
                            Save
                        </button>
                        <button
                            onClick={() => {
                                setEditingBooking(null);
                                setEditingAmount('');
                            }}
                            className="px-3 py-1 bg-gray-500 text-white rounded shadow-md hover:bg-gray-600 transition duration-300 ease-in-out transform hover:scale-105"
                            disabled={booking.approved}
                        >
                            Cancel
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => handleEditClick(booking)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded shadow-md hover:bg-yellow-600 transition duration-300 ease-in-out transform hover:scale-105"
                        disabled={booking.approved}
                    >
                        Edit
                    </button>
                )}
                
                <button
                    onClick={() => handleInvoiceClick(booking)}
                    className="px-3 py-1 bg-green-500 text-white rounded shadow-md hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105"
                    disabled={booking.approved}
                >
                    <IconMenuInvoice />
                </button>
                
                <button
                    onClick={() => handleApproveClick(booking.id)}
                    className={`px-3 py-1 rounded shadow-md transition duration-300 ease-in-out transform hover:scale-105 ${booking.approved ? 'bg-gray-500 text-white hover:bg-gray-600' : 'bg-green-500 text-white hover:bg-green-600'}`}
                    disabled={booking.approved}
                >
                    {booking.approved ? 'Approved' : 'Approve'}
                </button>
            </td>
        </tr>
    ))}
</tbody>

                    </table>
                </div>
            )}
        </div>
    );
};

export default CashCollectionReport;
