// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { addDoc, collection, getFirestore, doc, updateDoc } from 'firebase/firestore';
// import { getDocs } from 'firebase/firestore';
// import IconPlusCircle from '../../components/Icon/IconPlusCircle';

// const DriverAdd = () => {
//     const [driverName, setDriverName] = useState('');
//     const [idnumber, setIdnumber] = useState('');
   
//     const [phone, setPhone] = useState('');
//     const [personalphone, setPersonalPhone] = useState('');
//     const [salaryPerKm, setSalaryPerKm] = useState({});
//     const [basicSalaryKm, setBasicSalaryKm] = useState({});
//     const [editData, setEditData] = useState(null);
//     const [showTable, setShowTable] = useState(false);
//     const [selectedServices, setSelectedServices] = useState([]);
//     const [basicSalaries, setBasicSalaries] = useState({}); // Ensure basicSalaries is defined here

//     const [serviceOptions, setServiceOptions] = useState([]);

   
//     const handleBasicSalaryKmChange = (serviceId, value) => {
//         console.log('Service ID:', serviceId);
//         console.log('New Value:', value);
    
//         setBasicSalaryKm(prev => ({
//             ...prev,
//             [serviceId]: value
//         }));
//     };
    
//     const handleSalaryPerKmChange = (serviceId, value) => {
//         setSalaryPerKm(prev => ({
//             ...prev,
//             [serviceId]: value
//         }));
//     };
    
//     const renderServiceOptions = () => {
//         if (!Array.isArray(serviceOptions)) {
//             console.error('serviceOptions is not an array:', serviceOptions);
//             return <p>Error loading services.</p>; // Provide fallback UI
//         }
    
//         return (
//             <div>
//                 {serviceOptions.map((option, index) => (
//                     <label key={option.id} className="inline-flex items-center space-x-2">
//                         <input
//                             type="checkbox"
//                             value={option.id}
//                             checked={selectedServices.includes(option.id)}
//                             onChange={(e) => handleCheckboxChange(option.id, e.target.checked)}
//                         />
//                         <span>{option.name} - ${option.salary}</span>
//                     </label>
//                 ))}
//             </div>
//         );
//     };
    
//     const handleCheckboxChange = (id, isChecked) => {
//         setSelectedServices((prev) => {
//             if (isChecked && !prev.includes(id)) {
//                 return [...prev, id];
//             } else {
//                 return prev.filter(serviceId => serviceId !== id);
//             }
//         });
//     };
    
   
//     const navigate = useNavigate();
//     const db = getFirestore();
//     const { state } = useLocation(); // Use the useLocation hook to access location state

//     useEffect(() => {
//         const fetchServices = async () => {
//             try {
//                 const servicesCollection = collection(db, 'service');
//                 const snapshot = await getDocs(servicesCollection);
//                 const services = snapshot.docs.map(doc => ({
//                     id: doc.id,
//                     name: doc.data().name,
//                     salary: doc.data().salary  // Ensure this includes the current salary
//                 }));
//                 console.log('Setting service options:', services);
//                 setServiceOptions(services);
//                 // Initialize editable salaries from fetched data
//                 const salaryMapping = services.reduce((acc, curr) => ({
//                     ...acc,
//                     [curr.id]: curr.salary  // Map salaries by service ID
//                 }), {});
//                 setBasicSalaries(salaryMapping);
//             } catch (error) {
//                 console.error('Failed to fetch services:', error);
//                 setServiceOptions([]);
//             }
//         };
    
//     // }, [db]); // Dependency on db if it might change, otherwise it can be omitted
    
    
    
//         if (state && state.editData) {
//             console.log("Editing Data:", state.editData); // Log to check the structure
//             setEditData(state.editData);
//             setDriverName(state.editData.driverName || '');
//             setIdnumber(state.editData.idnumber || '');
//             setPhone(state.editData.phone || '');
//             setPersonalPhone(state.editData.personalphone || '');
//             setSalaryPerKm(state.editData.salaryPerKm || {});
//             setBasicSalaryKm(state.editData.basicSalaryKm || {});
//             setSelectedServices(state.editData.selectedServices || []);
//             setBasicSalaries(state.editData.basicSalaries || {});
          
//         }
//         fetchServices();

//     }, [db ,state]);  // Ensure useEffect is only rerun if 'state' changes
    
//     const addOrUpdateItem = async () => {
//         try {
//             if (!driverName || !idnumber || !phone) {
//                 console.error("Required fields are missing");
//                 return; // Stop execution if critical fields are missing
//             }
    
//             const servicesData = selectedServices.map(serviceId => {
//                 const service = serviceOptions.find(s => s.id === serviceId);
//                 if (!service) {
//                     console.warn(`No service found for ID: ${serviceId}`);
//                     return null; // or handle this scenario differently
//                 }
//                 return {
//                     id: service.id,
//                     name: service.name,
//                     salaryPerKm: salaryPerKm[serviceId] || '0',
//                     basicSalaryKm: basicSalaryKm[serviceId] || '0',
//                     basicSalary: basicSalaries[serviceId] || '0' // Adding basic salary specific to the service

//                 };
//             }).filter(service => service !== null); // Remove any null entries
    
//             const itemData = {
//                 driverName,
//                 idnumber,
//                 phone,
//                 personalphone,
//                 salaryPerKm, // Assuming this is a structure keyed by serviceId
//                 basicSalaryKm, // Assuming this is a structure keyed by serviceId
//                 services: servicesData, // Storing the array of services
//                 basicSalaries // Directly storing basicSalaries keyed by serviceId

//             };
    
//             let docRef;
//             if (editData) {
//                 docRef = doc(db, 'driver', editData.id);
//                 await updateDoc(docRef, itemData);
//                 console.log('Document updated:', docRef.id);
//             } else {
//                 docRef = await addDoc(collection(db, 'driver'), itemData);
//                 console.log('Document written with ID:', docRef.id);
//             }
    
//             navigate('/users/driver');
//         } catch (error) {
//             console.error('Error adding/updating document:', error);
//             if (error.code === 'permission-denied') {
//                 console.error('You do not have permission to execute this operation.');
//             }
//         }
//     };
    
    
//     return (
//         <div>
//             <ul className="flex space-x-2 rtl:space-x-reverse">
//                 <li>
//                     <Link to="#" className="text-primary hover:underline">
//                         Users
//                     </Link>
//                 </li>
//                 <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
//                     <span>Driver Account Settings</span>
//                 </li>
//             </ul>
//             <div className="pt-5">
//                 <div className="flex items-center justify-between mb-5">
//                     <h5 className="font-semibold text-lg dark:text-white-light">Driver Details</h5>
//                 </div>
//                 <div></div>

//                 <div>
//                     <form className="border border-[#ebedf2] dark:border-[#191e3a] rounded-md p-4 mb-5 bg-white dark:bg-black">
//                         <h6 className="text-lg font-bold mb-5">General Information</h6>
//                         <div className="flex flex-col sm:flex-row">
//                             <div className="ltr:sm:mr-4 rtl:sm:ml-4 w-full sm:w-2/12 mb-5">
//                                 <img src="/assets//images/profile-34.jpeg" alt="img" className="w-20 h-20 md:w-32 md:h-32 rounded-full object-cover mx-auto" />
//                             </div>
//                             <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5">
//                                 <div>
//                                     <label htmlFor="driverName">Driver Name</label>
//                                     <input id="driverName" type="text" placeholder="Enter driver Name" className="form-input" value={driverName} onChange={(e) => setDriverName(e.target.value)} />
//                                 </div>
//                                 <div>
//                                     <label htmlFor="idnumber">ID number</label>
//                                     <input id="idnumber" type="idnumber"  className="form-input" value={idnumber} onChange={(e) => setIdnumber(e.target.value)} />
//                                 </div>
//                                 <div>
//                                     <label htmlFor="phone">Phone</label>
//                                     <input id="phone" type="phone" placeholder="" className="form-input" value={phone} onChange={(e) => setPhone(e.target.value)} />
//                                 </div>
                                

//                                 <div>
//                                     <label htmlFor="personalphone">Personal PhoneNumber</label>
//                                     <input id="personalphone" type="personalphone" className="form-input" value={personalphone} onChange={(e) => setPersonalPhone(e.target.value)} />
//                                 </div>
//                                 <div>
//     <div>
//         <label style={{ cursor: 'pointer'}} className="flex items-center" onClick={() => setShowTable(true)}>
//             <IconPlusCircle className="me-2"/>
//             Add Service Type
//         </label>
//         {showTable && (
//   <div style={{ 
//     marginTop: '10px', 
//     padding: '10px', 
//     border: '1px solid #ccc', 
//     borderRadius: '5px', 
//     backgroundColor: '#f9f9f9',
//     boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', // Add box shadow for depth
//     maxWidth: '500px', // Limit maximum width for responsiveness
//     margin: 'auto' // Center the div horizontally
// }}>
//     {renderServiceOptions()}
//     <button 
//         style={{ 
//             marginTop: '10px', 
//             padding: '8px 16px', // Increase padding for button
//             backgroundColor: '#007bff', 
//             color: '#fff', 
//             border: 'none', 
//             borderRadius: '5px', // Increase border radius for button
//             cursor: 'pointer', 
//             display: 'block', // Ensure button takes full width
//             margin: 'auto' // Center the button horizontally
//         }} 
//         onClick={() => setShowTable(false)}
//     >
//         Done
//     </button>
// </div>

// )}
// </div>
// {selectedServices.length > 0 && (
//     <table style={{ marginTop: '20px', borderCollapse: 'collapse', width: '100%' }}>
//         <thead>
//             <tr>
//                 <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Service Type</th>
//                 <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Basic Salary</th>
//                 <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>KM for Basic Salary</th>
//                 <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>SalaryPerKm</th>
//             </tr>
//         </thead>
//         <tbody>
//     {selectedServices.map((serviceId, index) => {
//         const service = serviceOptions.find(s => s.id === serviceId);
//         if (!service) return null;

//         return (
//             <tr key={serviceId}>
//                 <td style={{ border: '1px solid #ddd', padding: '8px' }}>{service.name}</td>
//                 <td style={{ border: '1px solid #ddd', padding: '8px' }}>
//     <input 
//         style={{ border: 'none', outline: 'none' }}
//         type="text"
//         value={basicSalaries[serviceId] || ""}
//         onChange={(e) => {
//             // Create a new object representing the updated state
//             const updatedSalaries = {
//                 ...basicSalaries,
//                 [serviceId]: e.target.value
//             };

//             // Update the state with the new object
//             setBasicSalaries(updatedSalaries);

//             // Console log the new state
//             console.log('Updated Basic Salaries:', updatedSalaries);
//         }}
//     />
// </td>

//                 <td style={{ border: '1px solid #ddd', padding: '8px' }}>
//                     <input
//                         style={{ border: 'none', outline: 'none' }}
//                         type="text"
//                         value={basicSalaryKm[serviceId] || ""}
//                         onChange={(e) => handleBasicSalaryKmChange(serviceId, e.target.value)}
//                     />
//                 </td>
//                 <td style={{ border: '1px solid #ddd', padding: '8px' }}>
//                     <input
//                         style={{ border: 'none', outline: 'none' }}
//                         type="text"
//                         value={salaryPerKm[serviceId] || ""}
//                         onChange={(e) => handleSalaryPerKmChange(serviceId, e.target.value)}
//                     />
//                 </td>
//             </tr>
//         );
//     })}
// </tbody>


//     </table>
// )}

// </div>

//                                 <div className="sm:col-span-2 mt-3">
//             <button type="button" className="btn btn-primary" onClick={addOrUpdateItem}>
//                 {editData ? 'Update' : 'Save'}
//             </button>
//         </div>
//                             </div>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default DriverAdd;
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { addDoc, collection, getFirestore, doc, updateDoc } from 'firebase/firestore';
import IconUserPlus from '../../components/Icon/IconUserPlus';
import IconPlusCircle from '../../components/Icon/IconPlusCircle';

const DriverAdd = () => {
    const [driverName, setDriverName] = useState('');
    const [idnumber, setIdnumber] = useState('');

    const [phone, setPhone] = useState('');
    const [personalphone, setPersonalPhone] = useState('');
    const [salaryPerKm, setSalaryPerKm] = useState({});
    const [basicSalaryKm, setBasicSalaryKm] = useState({});
    const [editData, setEditData] = useState(null);
    const [showTable, setShowTable] = useState(false);
    const [selectedServices, setSelectedServices] = useState([]);
    const [basicSalaries, setBasicSalaries] = useState({}); // Ensure basicSalaries is defined here

    const serviceOptions = [
        "", // Default empty option
        "Flat bed",
        "Under Lift",
        "Rsr By Car",
        "Rsr By Bike",
        "Custody",
        "Hydra Crane",
        "Jump start",
        "Tow Wheeler Fbt",
        "Zero Digri Flat Bed",
        "Undet Lift 407",
        "S Lorry Crane Bed"
    ];


    const handleBasicSalaryChange = (service, e) => {
        const updatedSalaries = { ...basicSalaries, [service]: e.target.value };
        setBasicSalaries(updatedSalaries);
    };
    const handleBasicSalaryKmChange = (service, e) => {
        const updatedKm = { ...basicSalaryKm, [service]: e.target.value };
        setBasicSalaryKm(updatedKm);
    };
    const handleSalaryPerKmChange = (service, e) => {
        const updatedsalaryPerKm = { ...salaryPerKm, [service]: e.target.value };
        setSalaryPerKm(updatedsalaryPerKm);
    };
    const renderServiceOptions = () => {
        return (
            <div>
                {serviceOptions.map((option, index) => (
                    <label key={index} className="inline-flex items-center space-x-2">
                        <input
                            type="checkbox"
                            value={option}
                            checked={selectedServices.includes(option)}
                            onChange={(e) => handleCheckboxChange(e.target.value, e.target.checked)}
                        />
                        <span>{option}</span>
                    </label>
                ))}
            </div>
        );
    };

    const handleCheckboxChange = (value, isChecked) => {
        if (isChecked) {
            setSelectedServices([...selectedServices, value]);
        } else {
            setSelectedServices(selectedServices.filter(service => service !== value));
        }
    };
   
    const navigate = useNavigate();
    const db = getFirestore();
    const { state } = useLocation(); // Use the useLocation hook to access location state

    useEffect(() => {
        if (state && state.editData) {
            setEditData(state.editData);
            setDriverName(state.editData.driverName || '');
            setIdnumber(state.editData.idnumber || '');
            setPhone(state.editData.phone || '');
            setPersonalPhone(state.editData.personalphone || '');
            setSalaryPerKm(state.editData.salaryPerKm || '');
            setBasicSalaryKm(state.editData.basicSalaryKm || '');

            setSelectedServices(state.editData.selectedServices || '');

            setBasicSalaries(state.editData.basicSalaries || '');

        }
    }, [state]);
    const addOrUpdateItem = async () => {
        try {
            const itemData = {
                driverName,
                idnumber,
                phone,
                personalphone,
                salaryPerKm,
                basicSalaryKm,
                selectedServices,
                basicSalaries
               
            };

            if (editData) {
                const docRef = doc(db, 'driver', editData.id);
                await updateDoc(docRef, itemData);
                console.log('Document updated');
            } else {
                const docRef = await addDoc(collection(db, 'driver'), itemData);
                console.log('Document written with ID: ', docRef.id);
            }

            navigate('/users/driver');
        } catch (e) {
            console.error('Error adding/updating document: ', e);
        }
    };
    
    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link to="#" className="text-primary hover:underline">
                        Users
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Driver Account Settings</span>
                </li>
            </ul>
            <div className="pt-5">
                <div className="flex items-center justify-between mb-5">
                    <h5 className="font-semibold text-lg dark:text-white-light">Driver Details</h5>
                </div>
                <div></div>

                <div>
                    <form className="border border-[#ebedf2] dark:border-[#191e3a] rounded-md p-4 mb-5 bg-white dark:bg-black">
                        <h6 className="text-lg font-bold mb-5">General Information</h6>
                        <div className="flex flex-col sm:flex-row">
                            <div className="ltr:sm:mr-4 rtl:sm:ml-4 w-full sm:w-2/12 mb-5">
                                <img src="/assets//images/profile-34.jpeg" alt="img" className="w-20 h-20 md:w-32 md:h-32 rounded-full object-cover mx-auto" />
                            </div>
                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label htmlFor="driverName">Driver Name</label>
                                    <input id="driverName" type="text" placeholder="Enter driver Name" className="form-input" value={driverName} onChange={(e) => setDriverName(e.target.value)} />
                                </div>
                                <div>
                                    <label htmlFor="idnumber">ID number</label>
                                    <input id="idnumber" type="idnumber"  className="form-input" value={idnumber} onChange={(e) => setIdnumber(e.target.value)} />
                                </div>
                                <div>
                                    <label htmlFor="phone">Phone</label>
                                    <input id="phone" type="phone" placeholder="" className="form-input" value={phone} onChange={(e) => setPhone(e.target.value)} />
                                </div>
                                

                                <div>
                                    <label htmlFor="personalphone">Personal PhoneNumber</label>
                                    <input id="personalphone" type="personalphone" className="form-input" value={personalphone} onChange={(e) => setPersonalPhone(e.target.value)} />
                                </div>
                                <div>
    <div>
        <label style={{ cursor: 'pointer'}} className="flex items-center" onClick={() => setShowTable(true)}>
            <IconPlusCircle className="me-2"/>
            Add Service Type
        </label>
        {showTable && (
  <div style={{ 
    marginTop: '10px', 
    padding: '10px', 
    border: '1px solid #ccc', 
    borderRadius: '5px', 
    backgroundColor: '#f9f9f9',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', // Add box shadow for depth
    maxWidth: '500px', // Limit maximum width for responsiveness
    margin: 'auto' // Center the div horizontally
}}>
    {renderServiceOptions()}
    <button 
        style={{ 
            marginTop: '10px', 
            padding: '8px 16px', // Increase padding for button
            backgroundColor: '#007bff', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '5px', // Increase border radius for button
            cursor: 'pointer', 
            display: 'block', // Ensure button takes full width
            margin: 'auto' // Center the button horizontally
        }} 
        onClick={() => setShowTable(false)}
    >
        Done
    </button>
</div>

)}
</div>
{selectedServices.length > 0 && (
    <table style={{ marginTop: '20px', borderCollapse: 'collapse', width: '100%' }}>
        <thead>
            <tr>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Service Type</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Basic Salary</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>KM for Basic Salary</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>SalaryPerKm</th>
            </tr>
        </thead>
        <tbody>
            {selectedServices.map((service, index) => (
                <tr key={index}>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{service}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                        <input 
                            style={{ border: 'none', outline: 'none' }} // Set border and outline to none
                            type="text"
                            value={basicSalaries[service] || ""}
                            placeholder='Enter Basic Salary'
                            onChange={(e) => handleBasicSalaryChange(service, e)}
                        />
                    </td>
                    <td style={{ border: '1px solid #ddd', padding: '8px', position: 'relative' }}>
                        <input
                            style={{ border: 'none', outline: 'none', width: 'calc(100% - 20px)' }} // Set border and outline to none, adjust width to leave space for "KM"
                            type="text"
                            value={basicSalaryKm[service] || ""}
                            onChange={(e) => handleBasicSalaryKmChange(service, e)}
                        />
                        <span style={{ position: 'absolute', right: '5px', top: '50%', transform: 'translateY(-50%)', color: '#555'}}>KM</span>
                    </td>
                    <td style={{ border: '1px solid #ddd', padding: '8px', position: 'relative' }}>
                        <input
                            style={{ border: 'none', outline: 'none', width: 'calc(100% - 20px)' }} // Set border and outline to none, adjust width to leave space for "KM"
                            type="text"
                            value={salaryPerKm[service] || ""}
                            onChange={(e) => handleSalaryPerKmChange(service, e)}
                        />
                        <span style={{ position: 'absolute', right: '45px', top: '50%', transform: 'translateY(-50%)', color: '#555'}}>/km</span>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
)}

</div>

                                <div className="sm:col-span-2 mt-3">
            <button type="button" className="btn btn-primary" onClick={addOrUpdateItem}>
                {editData ? 'Update' : 'Save'}
            </button>
        </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default DriverAdd;