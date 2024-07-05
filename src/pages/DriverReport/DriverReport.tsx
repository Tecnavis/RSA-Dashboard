import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import IconMultipleForwardRight from '../../components/Icon/IconMultipleForwardRight';
import { Link } from 'react-router-dom';
import IconEdit from '../../components/Icon/IconEdit';

const DriverReport = () => {
    const [drivers, setDrivers] = useState([]);
    const [companies, setCompanies] = useState([]);

    const [editDriverId, setEditDriverId] = useState(null);
    const [editDriverData, setEditDriverData] = useState({ driverName: '', idnumber: '', advancePayment: '' });

    const [editCompanyId, setEditCompanyId] = useState(null);
    const [editCompanyData, setEditCompanyData] = useState({ companyName: '', idnumber: '', advancePayment: '' });

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

        const fetchCompanies = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'company'));
                const companyList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setCompanies(companyList);
            } catch (error) {
                console.error('Error fetching companies: ', error);
            }
        };

        fetchDrivers();
        fetchCompanies();
    }, [db]);

    const handleEditDriverClick = (driver) => {
        setEditDriverId(driver.id);
        setEditDriverData({ driverName: driver.driverName, idnumber: driver.idnumber, advancePayment: driver.advancePayment });
    };

    const handleEditCompanyClick = (company) => {
        setEditCompanyId(company.id);
        setEditCompanyData({ companyName: company.companyName, idnumber: company.idnumber, advancePayment: company.advancePayment });
    };

    const handleDriverInputChange = (e) => {
        const { name, value } = e.target;
        setEditDriverData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleCompanyInputChange = (e) => {
        const { name, value } = e.target;
        setEditCompanyData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSaveDriverClick = async () => {
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

    const handleSaveCompanyClick = async () => {
        try {
            const companyDocRef = doc(db, 'company', editCompanyId);
            await updateDoc(companyDocRef, editCompanyData);
            setCompanies((prevCompanies) =>
                prevCompanies.map((company) =>
                    company.id === editCompanyId ? { ...company, ...editCompanyData } : company
                )
            );
            setEditCompanyId(null);
        } catch (error) {
            console.error('Error updating company: ', error);
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
                                        onChange={handleDriverInputChange}
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
                                        onChange={handleDriverInputChange}
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
                                        onChange={handleDriverInputChange}
                                        className="border rounded p-1"
                                    />
                                ) : (
                                    driver.advancePayment
                                )}
                            </td>
                            <td className="border px-4 py-2 flex gap-2">
                                {editDriverId === driver.id ? (
                                    <button onClick={handleSaveDriverClick} className="text-green-500 hover:text-green-700">Save</button>
                                ) : (
                                    <button onClick={() => handleEditDriverClick(driver)} className="text-green-500 hover:text-blue-700">
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
            <h2>Company List</h2>
            <table className="min-w-full bg-white">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="py-2 px-4">Company Name</th>
                        <th className="py-2 px-4">Company ID</th>
                        <th className="py-2 px-4">Advance Payment</th>
                        <th className="py-2 px-4">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {companies.map(company => (
                        <tr key={company.id} className="hover:bg-gray-50">
                            <td className="border px-4 py-2">
                                {editCompanyId === company.id ? (
                                    <input
                                        type="text"
                                        name="companyName"
                                        value={editCompanyData.companyName}
                                        onChange={handleCompanyInputChange}
                                        className="border rounded p-1"
                                    />
                                ) : (
                                    company.companyName
                                )}
                            </td>
                            <td className="border px-4 py-2">
                                {editCompanyId === company.id ? (
                                    <input
                                        type="text"
                                        name="idnumber"
                                        value={editCompanyData.idnumber}
                                        onChange={handleCompanyInputChange}
                                        className="border rounded p-1"
                                    />
                                ) : (
                                    company.idnumber
                                )}
                            </td>
                            <td className="border px-4 py-2">
                                {editCompanyId === company.id ? (
                                    <input
                                        type="text"
                                        name="advancePayment"
                                        value={editCompanyData.advancePayment}
                                        onChange={handleCompanyInputChange}
                                        className="border rounded p-1"
                                    />
                                ) : (
                                    company.advancePayment
                                )}
                            </td>
                            <td className="border px-4 py-2 flex gap-2">
                                {editCompanyId === company.id ? (
                                    <button onClick={handleSaveCompanyClick} className="text-green-500 hover:text-green-700">Save</button>
                                ) : (
                                    <button onClick={() => handleEditCompanyClick(company)} className="text-green-500 hover:text-blue-700">
                                        <IconEdit className="inline-block w-5 h-5" />
                                    </button>
                                )}
                                <Link
                                    to={`/users/company/companydetails/cashcollection/${company.id}`}
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
