import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { useLocation, useNavigate } from 'react-router-dom';

const DriverSalary = () => {
    const [drivers, setDrivers] = useState([]);
    const [selectedDriver, setSelectedDriver] = useState(null); // State to store the selected driver
    const db = getFirestore();
    const location = useLocation();
    const { serviceType, distance } = location.state || {};
    const distanceNumeric = parseFloat(distance.replace('km', ''));
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDrivers = async () => {
            try {
                const driversCollection = collection(db, 'driver');
                const snapshot = await getDocs(driversCollection);

                const filteredDrivers = snapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() }))
                    .filter(driver => driver.service === serviceType);

                setDrivers(filteredDrivers);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        if (serviceType && distance) {
            fetchDrivers().catch(console.error);
        }
    }, [db, serviceType, distance]);

    const calculateTotalSalary = (basicSalary, distance, salaryPerKm) => {
        if (distance <= 20) {
            return basicSalary; // If distance is less than or equal to 20 km, return basic salary
        }
    
        const basicSalaryPer20Km = basicSalary; // Assuming basic salary is for every 20 km
        const num20KmIntervals = Math.floor(distance / distance); // Calculate how many intervals of 20 km are there
        const remainingDistance = distance - 20; // Calculate the remaining distance
        const totalSalary = basicSalaryPer20Km * num20KmIntervals + remainingDistance * salaryPerKm;
        return totalSalary;
    };
  
    const handleDriverSelection = (driver) => {
        setSelectedDriver(driver);
        navigate('/bookings/booking', { 
            state: { 
                selectedDriver: driver 
            }
         });
    };

    if (drivers.length === 0) {
        return <div>Loading...</div>;
    }
    if (!serviceType || !distance) {
        return <div>Error: No service type or distance provided.</div>;
    }
    return (
        <div className="grid xl:grid-cols-1 gap-6 grid-cols-1">
            <h2 style={{ textAlign: 'center' }}>Available Drivers of {serviceType} {distance}</h2>
            {drivers.map((driver) => (
                <div key={driver.id} className="panel">
                    <table className="panel p-4" style={{ borderCollapse: 'collapse', width: '100%', maxWidth: '600px', margin: 'auto' }}>
                        <thead>
                            <tr>
                                <th>Driver Name</th>
                                <th>Basic Salary</th>
                                <th>Salary/Km</th>
                                <th>Total Salary</th>
                                <th>Select</th> {/* Add a column for selection */}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{driver.driverName}</td>
                                <td>{driver.basicSalary}</td>
                                <td>{driver.salarykm}</td>
                                <td>{Number(calculateTotalSalary(driver.basicSalary, distanceNumeric, driver.salarykm))}</td>
                                <td>
                                    <input
                                        type="radio"
                                        name="selectedDriver"
                                        value={driver.id}
                                        checked={selectedDriver === driver.id}
                                        onChange={() => handleDriverSelection(driver.id)}
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
};

export default DriverSalary;
