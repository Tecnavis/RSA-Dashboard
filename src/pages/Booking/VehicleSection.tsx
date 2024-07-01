import React, { useState, useEffect } from 'react';
import { addDoc, collection, getFirestore, doc, updateDoc, getDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';

const VehicleSection = ({ showroomLocation, totalSalary, onUpdateTotalSalary, insuranceAmountBody }) => {
    const [showRoom, setShowRoom] = useState({
        availableServices: '',
        hasInsurance: '',
        insuranceAmount: insuranceAmountBody,
        insurance: '',
        insuranceAmountBody: insuranceAmountBody,
    });
    const [editRoomId, setEditRoomId] = useState(null);
    const [updatedTotalSalary, setUpdatedTotalSalary] = useState(totalSalary);
    const [adjustValue, setAdjustValue] = useState('');
    console.log('showroomLocation', showroomLocation);
    useEffect(() => {
        if (showroomLocation) {
            const fetchInsuranceAmount = async () => {
                const db = getFirestore();
                const showroomsRef = collection(db, 'showroom');
                const q = query(showroomsRef, where('Location', '==', showroomLocation));

                try {
                    const querySnapshot = await getDocs(q);
                    if (!querySnapshot.empty) {
                        querySnapshot.forEach((doc) => {
                            const showroomData = doc.data();
                            setShowRoom((prevShowRoom) => ({
                                ...prevShowRoom,
                                insuranceAmount: showroomData.insuranceAmountBody,
                            }));
                        });
                    } else {
                        console.log('No matching documents.');
                    }
                } catch (error) {
                    console.error('Error fetching documents:', error);
                }
            };

            fetchInsuranceAmount();
        }
    }, [showroomLocation]);

    useEffect(() => {
        const newTotalSalary = totalSalary - showRoom.insuranceAmount;
        onUpdateTotalSalary(newTotalSalary >= 0 ? newTotalSalary : 0);
    }, [showRoom.insuranceAmount, totalSalary]);


    const handleServiceChange = (e) => {
        const { value } = e.target;
        setShowRoom((prevShowRoom) => ({
            ...prevShowRoom,
            availableServices: value,
        }));
    };

    const handleBodyInsuranceChange = (e) => {
        const { value } = e.target;
        setShowRoom((prevShowRoom) => ({
            ...prevShowRoom,
            insurance: value,
        }));
    };

    const handleInsuranceAmountChange = (e) => {
        const { value } = e.target;
        setShowRoom((prevShowRoom) => ({
            ...prevShowRoom,
            insuranceAmount: value,
        }));
    };

    const handleAdjustValueChange = (e) => {
        const { value } = e.target;
        setAdjustValue(value);
    };
    const applyAdjustment = () => {
        const adjustedSalary = parseFloat(adjustValue);
        if (adjustedSalary > 0 && adjustedSalary > totalSalary) {
            onUpdateTotalSalary(adjustedSalary);
        }
    };

    return (
        <div className="mb-5">
            <h1>Service Category</h1>
            <div className="mb-2" style={{ alignItems: 'center', border: '1px solid #ccc', padding: '10px', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
                <label className="mr-4" style={{ marginRight: '10px', fontSize: '1em', color: '#333' }}>
                    <input
                        type="radio"
                        name="availableServices"
                        value="Service Center"
                        checked={showRoom.availableServices === 'Service Center'}
                        onChange={handleServiceChange}
                        className="mr-1"
                        style={{ marginRight: '5px' }}
                    />
                    Service Center
                </label>
                <label className="mr-4" style={{ marginRight: '10px', fontSize: '1em', color: '#333' }}>
                    <input
                        type="radio"
                        name="availableServices"
                        value="Body Shop"
                        checked={showRoom.availableServices === 'Body Shop'}
                        onChange={handleServiceChange}
                        className="mr-1"
                        style={{ marginRight: '5px' }}
                    />
                    Body Shop
                </label>
                {showRoom.availableServices === 'Body Shop' && (
                    <div className="mb-2" style={{ marginLeft: '10px', backgroundColor: '#ffeeba', padding: '10px', borderRadius: '5px', fontSize: '0.9em' }}>
                        <p style={{ marginBottom: '5px', fontWeight: 'bold' }}>Payment Method</p>
                        <label className="mr-2" style={{ marginRight: '10px', fontSize: '1em' }}>
                            <input
                                type="radio"
                                name="insurance"
                                value="insurance"
                                checked={showRoom.insurance === 'insurance'}
                                onChange={handleBodyInsuranceChange}
                                className="mr-1"
                                style={{ marginRight: '5px' }}
                            />
                            Insurance
                        </label>
                        <label className="mr-2" style={{ marginRight: '10px', fontSize: '1em' }}>
                            <input
                                type="radio"
                                name="insurance"
                                value="ready"
                                checked={showRoom.insurance === 'ready'}
                                onChange={handleBodyInsuranceChange}
                                className="mr-1"
                                style={{ marginRight: '5px' }}
                            />
                            Ready Payment
                        </label>
                        <label className="mr-2" style={{ marginRight: '10px', fontSize: '1em' }}>
                            <input
                                type="radio"
                                name="insurance"
                                value="both"
                                checked={showRoom.insurance === 'both'}
                                onChange={handleBodyInsuranceChange}
                                className="mr-1"
                                style={{ marginRight: '5px' }}
                            />
                            Both
                        </label>
                        {showRoom.insurance === 'insurance' && (
                            <div className="mt-2" style={{ marginTop: '10px', fontSize: '0.9em' }}>
                                <label htmlFor="insuranceAmount" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0" style={{ fontSize: '1em', color: '#333' }}>
                                    Insurance Amount:
                                </label>{' '}
                                <input
                                    type="number"
                                    name="insuranceAmount"
                                    value={showRoom.insuranceAmount}
                                    onChange={handleInsuranceAmountChange}
                                    style={{ padding: '5px', borderRadius: '5px', border: '1px solid #ccc' }}
                                />
                            </div>
                        )}
                    </div>
                )}
                <label className="mr-4" style={{ marginRight: '10px', fontSize: '1em', color: '#333' }}>
                    <input
                        type="radio"
                        name="availableServices"
                        value="Showroom"
                        checked={showRoom.availableServices === 'Showroom'}
                        onChange={handleServiceChange}
                        className="mr-1"
                        style={{ marginRight: '5px' }}
                    />
                    Showroom
                </label>
            </div>
            <br />
            <div>
            <label htmlFor="insuranceAmount" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0" style={{ fontSize: '1em', color: '#333' }}>
        Insurance Amount:
    </label> 
                <div style={{
            width: '100%',
            padding: '0.5rem',
            border: '1px solid #ccc',
            borderRadius: '5px',
            fontSize: '1rem',
            outline: 'none',
            background: 'white',

            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        }}>{showRoom.insuranceAmount}</div>
                <div>
                    <label style={{ marginRight: '10px', fontSize: '1em', color: '#333' }}>Adjustment Value:</label>
                    <input type="number" value={adjustValue} onChange={handleAdjustValueChange} style={{ padding: '5px', borderRadius: '5px', border: '1px solid #ccc' }} />
                    <button
                        onClick={applyAdjustment}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '5px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            cursor: 'pointer',
                            marginLeft: '10px',
                        }}
                    >
                        Apply
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VehicleSection;
