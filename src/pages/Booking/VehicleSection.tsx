import React, { useState, useEffect } from 'react';
import { addDoc, collection, getFirestore, doc, updateDoc, getDoc, serverTimestamp } from 'firebase/firestore';

const VehicleSection = ({ selectedShowroom, totalSalary, onUpdateTotalSalary }) => {
    const [showRoom, setShowRoom] = useState({
        availableServices: '',
        hasInsurance: '',
        insuranceAmount: '',
        insurance: '',
        insuranceAmountBody: '',
    });
    const [editRoomId, setEditRoomId] = useState(null);
    const [updatedTotalSalary, setUpdatedTotalSalary] = useState('');

    useEffect(() => {
        const fetchInsuranceAmount = async () => {
            if (selectedShowroom) {
                const db = getFirestore();
                const showroomRef = doc(db, 'showroom', selectedShowroom);
                const showroomSnap = await getDoc(showroomRef);

                if (showroomSnap.exists()) {
                    const showroomData = showroomSnap.data();
                    setShowRoom((prevShowRoom) => ({
                        ...prevShowRoom,
                        insuranceAmount: showroomData.insuranceAmountBody,
                    }));
                } else {
                    console.log('No such document!');
                }
            }
        };

        fetchInsuranceAmount();
    }, [selectedShowroom]);

    useEffect(() => {
        const newTotalSalary = totalSalary - showRoom.insuranceAmount;
        setUpdatedTotalSalary(newTotalSalary >= 0 ? newTotalSalary : 0);
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
  
    return (
        <div className="mb-5">
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
                                <label style={{ marginRight: '10px', fontSize: '1em', color: '#333' }}>Insurance Amount:</label>
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
                <p>Selected Showroom: {selectedShowroom ? selectedShowroom.Location : 'None selected'}</p>
                <p>Total Salary: {updatedTotalSalary}</p>
                <p>Insurance Amount: {showRoom.insuranceAmount}</p>
               
            </div>
           
        </div>
    );
};

export default VehicleSection;
