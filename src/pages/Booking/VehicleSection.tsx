import React, { useState, useEffect, useRef } from 'react';

const VehicleSection = ({ showroomLocation, totalSalary, onUpdateTotalSalary, adjustValueCallback, insuranceAmountBody, onInsuranceAmountBodyChange }) => {
    const [showRoom, setShowRoom] = useState({
        availableServices: '',
        hasInsurance: '',
        insuranceAmount: '',
        insurance: '',
        insuranceAmountBody: '',
    });
    const [updatedTotalSalary, setUpdatedTotalSalary] = useState(totalSalary);
    const [adjustValue, setAdjustValue] = useState('');
    const adjustmentApplied = useRef(false);

    useEffect(() => {
        if (!adjustmentApplied.current) {
            const newTotalSalary = totalSalary - (insuranceAmountBody ? parseFloat(insuranceAmountBody) : 0);
            if (newTotalSalary !== updatedTotalSalary) {
                setUpdatedTotalSalary(newTotalSalary >= 0 ? newTotalSalary : 0);
                onUpdateTotalSalary(newTotalSalary >= 0 ? newTotalSalary : 0);
            }
        }
    }, [insuranceAmountBody, totalSalary, onUpdateTotalSalary, updatedTotalSalary]);

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
        adjustValueCallback(value); // Call the callback function with adjustValue
    };

    const applyAdjustment = () => {
        const adjustedSalary = parseFloat(adjustValue);
        if (adjustedSalary > updatedTotalSalary) {
            setUpdatedTotalSalary(adjustedSalary);
            onUpdateTotalSalary(adjustedSalary);
            adjustmentApplied.current = true;
        } else {
            const password = prompt("Enter password to apply the adjustment:Password=Adjust");
            if (password === "Adjust") {
                setUpdatedTotalSalary(adjustedSalary);
                onUpdateTotalSalary(adjustedSalary);
                adjustmentApplied.current = true;
            } else {
                alert("Incorrect password. Adjustment not applied.");
            }
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
                    Accident
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
                <div>
                    <label style={{ marginRight: '10px', fontSize: '1em', color: '#333' }}>Adjustment Value:</label>
                    <input
                        type="number"
                        value={adjustValue}
                        onChange={handleAdjustValueChange}
                        style={{ padding: '5px', borderRadius: '5px', border: '1px solid #ccc' }}
                    />
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
            {/* <div className="form-input flex-1">
                <input
                    id="updatedTotalSalary"
                    type="text"
                    name="updatedTotalSalary"
                    className="w-full text-danger"
                    style={{
                        padding: '0.5rem',
                        border: '1px solid #ccc',
                        borderRadius: '5px',
                        fontSize: '2rem',
                        outline: 'none',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    }}
                    value={parseFloat(updatedTotalSalary).toFixed(2)}
                    readOnly
                />
            </div> */}
        </div>
    );
};

export default VehicleSection;

