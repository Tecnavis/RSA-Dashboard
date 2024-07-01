import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import IconMultipleForwardRight from '../../components/Icon/IconMultipleForwardRight';
import { Link } from 'react-router-dom';
import IconEdit from '../../components/Icon/IconEdit';

const DriverReport = () => {
    const [drivers, setDrivers] = useState([]);
    const [editDriverId, setEditDriverId] = useState(null);
    const [editDriverData, setEditDriverData] = useState({ driverName: '', idnumber: '', advancePayment: '' });
    const db = getFirestore();

    useEffect(() => {
        const fetchDrivers = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'driver'));
                const driverList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setDrivers(driverList);
            } catch (error) {
                console.error('Error fetching drivers: ', error);
            }
        };

        fetchDrivers();
    }, [db]);

    const handleEditClick = (driver) => {
        setEditDriverId(driver.id);
        setEditDriverData({ driverName: driver.driverName, idnumber: driver.idnumber, advancePayment: driver.advancePayment });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditDriverData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSaveClick = async () => {
        try {
            const driverDocRef = doc(db, 'driver', editDriverId);
            await updateDoc(driverDocRef, editDriverData);
            setDrivers((prevDrivers) =>
                prevDrivers.map((driver) =>
                    driver.id === editDriverId ? { ...driver, ...editDriverData } : driver
                )
            );
            setEditDriverId(null);
        } catch (error) {
            console.error('Error updating driver: ', error);
        }
    };

    return (
        <div>
            <h2>Driver Cash Collection Report</h2>
            <table className="min-w-full bg-white">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="py-2 px-4">Driver Name</th>
                        <th className="py-2 px-4">Driver ID</th>
                        <th className="py-2 px-4">Advance Payment</th>
                        <th className="py-2 px-4">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {drivers.map(driver => (
                        <tr key={driver.id} className="hover:bg-gray-50">
                            <td className="border px-4 py-2">
                                {editDriverId === driver.id ? (
                                    <input
                                        type="text"
                                        name="driverName"
                                        value={editDriverData.driverName}
                                        onChange={handleInputChange}
                                        className="border rounded p-1"
                                    />
                                ) : (
                                    driver.driverName
                                )}
                            </td>
                            <td className="border px-4 py-2">
                                {editDriverId === driver.id ? (
                                    <input
                                        type="text"
                                        name="idnumber"
                                        value={editDriverData.idnumber}
                                        onChange={handleInputChange}
                                        className="border rounded p-1"
                                    />
                                ) : (
                                    driver.idnumber
                                )}
                            </td>
                            <td className="border px-4 py-2">
                                {editDriverId === driver.id ? (
                                    <input
                                        type="text"
                                        name="advancePayment"
                                        value={editDriverData.advancePayment}
                                        onChange={handleInputChange}
                                        className="border rounded p-1"
                                    />
                                ) : (
                                    driver.advancePayment
                                )}
                            </td>
                            <td className="border px-4 py-2 flex gap-2">
                                {editDriverId === driver.id ? (
                                    <button onClick={handleSaveClick} className="text-green-500 hover:text-green-700">Save</button>
                                ) : (
                                    <button onClick={() => handleEditClick(driver)} className="text-green-500 hover:text-blue-700">
                                        <IconEdit className="inline-block w-5 h-5" />
                                    </button>
                                )}
                                <Link
                                    to={`/users/driver/driverdetails/cashcollection/${driver.id}`}
                                    className="text-blue-500 hover:text-blue-700"
                                >
                                    <IconMultipleForwardRight className="inline-block w-5 h-5"/>
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DriverReport;
