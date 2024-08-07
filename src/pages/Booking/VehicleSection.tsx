import React, { useState, useEffect, useRef } from 'react';

const VehicleSection = ({ totalSalary, onUpdateTotalSalary, insuranceAmountBody, onInsuranceAmountBodyChange, onServiceCategoryChange }) => {
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
            let newTotalSalary = totalSalary;
            console.log("newTotalSalary", newTotalSalary);

            // Adjust the total salary based on insurance amount if necessary
            if (showRoom.availableServices === 'Body Shop') {
                if (showRoom.insurance === 'insurance') {
                    newTotalSalary -= (insuranceAmountBody ? parseFloat(insuranceAmountBody) : 0);
                }
            }

            if (newTotalSalary !== updatedTotalSalary) {
                setUpdatedTotalSalary(newTotalSalary >= 0 ? newTotalSalary : 0);
                onUpdateTotalSalary(newTotalSalary >= 0 ? newTotalSalary : 0);
            }
        }
    }, [totalSalary, insuranceAmountBody, showRoom.availableServices, showRoom.insurance, updatedTotalSalary, onUpdateTotalSalary]);

    const handleServiceChange = (e) => {
        const { value } = e.target;
        console.log("Selected service value:", value); // Log the selected service value

        setShowRoom((prevShowRoom) => {
            const updatedShowRoom = {
                ...prevShowRoom,
                availableServices: value,
                insurance: '', // Reset insurance selection when changing service category
            };
            console.log("Updated show room state:", updatedShowRoom); // Log the updated show room state
            return updatedShowRoom;
        });

        // Call the callback only if the selected service is "Body Shop"
        if (value === "Body Shop") {
            console.log("Calling onServiceCategoryChange with value:", value); // Log the value before calling the callback
            onServiceCategoryChange(value); // Call the callback function with the new service category
        }
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
        onInsuranceAmountBodyChange(value); // Call the callback function with new insurance amount
    };

    const handleAdjustValueChange = (e) => {
        const { value } = e.target;
        setAdjustValue(value);
    };

    const applyAdjustment = () => {
        const adjustedSalary = parseFloat(adjustValue);
        if (adjustedSalary > updatedTotalSalary) {
            setUpdatedTotalSalary(adjustedSalary);
            onUpdateTotalSalary(adjustedSalary);
            adjustmentApplied.current = true;
        } else {
            const password = prompt("Enter password to apply the adjustment: Password=Adjust");
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
                                <label style={{ marginRight: '10px', fontSize: '1em', color: '#333' }}>Insurance Amount(for newly added showrooms(Optional)):</label>
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
                    <label style={{ fontSize: '1em', color: '#333' }}>Adjustment Value:</label>
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
        </div>
    );
};

export default VehicleSection;
