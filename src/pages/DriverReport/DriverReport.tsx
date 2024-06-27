import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import IconMultipleForwardRight from '../../components/Icon/IconMultipleForwardRight';
import { Link } from 'react-router-dom';

const DriverReport = () => {
    const [drivers, setDrivers] = useState([]);
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
                            <td className="border px-4 py-2">{driver.driverName}</td>
                            <td className="border px-4 py-2">{driver.idnumber}</td>
                            <td className="border px-4 py-2">{driver.advancePayment}</td>
                            <td className="border px-4 py-2">
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
