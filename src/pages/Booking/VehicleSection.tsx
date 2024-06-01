import React, { useState } from 'react';
import { addDoc, collection, getFirestore, doc, updateDoc, serverTimestamp } from 'firebase/firestore';

const VehicleSection = () => {
    const [showRoom, setShowRoom] = useState({
        availableServices: '',
        hasInsurance: '',
        insuranceAmount: '',
        insurance: '',
        insuranceAmountBody: '',
    });
    const [editRoomId, setEditRoomId] = useState(null);

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
        const { name, value } = e.target;
        setShowRoom((prevShowRoom) => ({
            ...prevShowRoom,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const db = getFirestore();
        const timestamp = serverTimestamp(); // Get server timestamp
        const newShowRoom = { ...showRoom, createdAt: timestamp }; // Include createdAt field
    
        try {
            if (editRoomId) {
                const roomRef = doc(db, 'showroom', editRoomId);
                await updateDoc(roomRef, newShowRoom);
                alert('Showroom updated successfully');
                setEditRoomId(null);
            } else {
                await addDoc(collection(db, 'showroom'), newShowRoom);
                alert('Showroom added successfully');
            }
            // Reset state
            setShowRoom({
                availableServices: '',
                hasInsurance: '',
                insuranceAmount: '',
                insurance: '',
                insuranceAmountBody: '',
            });
        } catch (error) {
            console.error('Error adding/updating showroom:', error);
        }
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
                        {showRoom.insurance === 'insurance' && (
                            <input
                                type="number"
                                name="insuranceAmount"
                                value={showRoom.insuranceAmount}
                                onChange={handleInsuranceAmountChange}
                                placeholder="Enter insurance amount"
                                style={{ marginLeft: '10px' }}
                            />
                        )}
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
                        {showRoom.insurance === 'ready' && (
                            <input
                                type="number"
                                name="insuranceAmountBody"
                                value={showRoom.insuranceAmountBody}
                                onChange={handleInsuranceAmountChange}
                                placeholder="Enter ready payment amount"
                                style={{ marginLeft: '10px' }}
                            />
                        )}
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
                        {showRoom.insurance === 'both' && (
                            <div style={{ marginLeft: '10px' }}>
                                <input
                                    type="number"
                                    name="insuranceAmount"
                                    value={showRoom.insuranceAmount}
                                    onChange={handleInsuranceAmountChange}
                                    placeholder="Enter insurance amount"
                                    style={{ display: 'block', marginBottom: '5px' }}
                                />
                                <input
                                    type="number"
                                    name="insuranceAmountBody"
                                    value={showRoom.insuranceAmountBody}
                                    onChange={handleInsuranceAmountChange}
                                    placeholder="Enter ready payment amount"
                                    style={{ display: 'block' }}
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
        </div>
    );
};

export default VehicleSection;
