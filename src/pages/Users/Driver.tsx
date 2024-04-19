// import React, { useEffect, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import IconTrashLines from '../../components/Icon/IconTrashLines';
// import IconPencil from '../../components/Icon/IconPencil';
// import Tippy from '@tippyjs/react';
// import 'tippy.js/dist/tippy.css';
// import IconUserPlus from '../../components/Icon/IconUserPlus';
// import { getFirestore, collection, getDocs, doc, deleteDoc, updateDoc, addDoc } from 'firebase/firestore';
// import IconMenuMore from '../../components/Icon/Menu/IconMenuMore';


// const Driver = () => {
//     const [items, setItems] = useState([] as any);
//     const [editData, setEditData] = useState(null);
//     const db = getFirestore();
//     const navigate = useNavigate();
// console.log("data",items)

// useEffect(() => {
//     const fetchData = async () => {
//         try {
//             const querySnapshot = await getDocs(collection(db, 'driver'));
//             const drivers = querySnapshot.docs.map(doc => {
//                 const data = doc.data();
//                 return {
//                     id: doc.id,
//                     driverName: data.driverName,
//                     idnumber: data.idnumber,
//                     phone: data.phone,
//                     personalphone: data.personalphone,
//                     selectedServices: data.selectedServices || [], // Assuming this is an array of service IDs
//                     basicSalaries: data.basicSalaries || {}, // Salaries keyed by service ID
//                     salaryPerKm: data.salaryPerKm || {}, // Salary per km keyed by service ID
//                     basicSalaryKm: data.basicSalaryKm || {}, // Basic km keyed by service ID
//                     services: data.services || [] // Detailed service data
//                 };
//             });
//             setItems(drivers);
//         } catch (error) {
//             console.error('Error fetching driver data:', error);
//         }
//     };

//     fetchData();
// }, [db]); // Dependency on db to refresh data if db changes



//     const handleDelete = async (userId: string) => {
//         try {
//             const userRef = doc(db, 'driver', userId);
//             await deleteDoc(userRef);
//             setItems((prevItems: any) => prevItems.filter((item: any) => item.id !== userId));
//         } catch (error) {
//             console.error('Error deleting document: ', error);
//         }
//     };

//     const handleEdit = (item) => {
//         navigate(`/users/driver-add/${item.id}`, { state: { editData: item } });
//     };

//     return (
//         <div className="grid xl:grid-cols-1 gap-6 grid-cols-1">
//             <div className="panel">
//                 <div className="flex items-center justify-between mb-5">
//                     <h5 className="font-semibold text-lg dark:text-white-light">Driver Details</h5>
//                     <Link to="/users/driver-add" className="font-semibold text-success hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-600">
//                         <IconUserPlus className="me-2" />
//                         Add New
//                     </Link>
//                 </div>
//                 <div className="table-responsive mb-5">
//                     <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
//                         <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
//                             <tr>
//                                 <th>Id</th>
//                                 <th>Driver Name</th>
//                                 <th>ID Number</th>
//                                 <th>Phone Number</th>
//                                 <th>Service Types</th>
//                                 <th>Basic Salaries & KM Settings</th>
//                                 <th>Action</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {items.map((item, index) => (
//                                 <tr key={item.id}>
//                                     <td>{index + 1}</td>
//                                     <td>{item.driverName}</td>
//                                     <td>{item.idnumber}</td>
//                                     <td>{item.phone}</td>
//                                     <td>
//                                         <ul>
//                                             {item.services.map(service => (
//                                                 <li key={service.id}>{service.name}</li>
//                                             ))}
//                                         </ul>
//                                     </td>
//                                     <td>
//                                         <ul>
//                                             {item.services.map(service => (
//                                                 <li key={service.id}>
//                                                     Salary: {item.basicSalaries[service.id] || 'N/A'}, 
//                                                     Per KM: {item.salaryPerKm[service.id] || 'N/A'}, 
//                                                     Basic KM: {item.basicSalaryKm[service.id] || 'N/A'}
//                                                 </li>
//                                             ))}
//                                         </ul>
//                                     </td>
//                                     <td className="text-center">
//                                         <ul className="flex items-center justify-center gap-2">
//                                             <li>
//                                             <Tippy content="Edit">
//                     <button type="button" onClick={() => handleEdit(item)}>
//                         <IconPencil className="text-primary" />
//                     </button>
//                 </Tippy>
//                                             </li>
//                                             <li>
//                                                 <Tippy content="Delete">
//                                                     <button type="button" onClick={() => handleDelete(item.id)}>
//                                                         <IconTrashLines className="text-danger" />
//                                                     </button>
//                                                 </Tippy>
//                                             </li>
//                                             <li>
//                                                 <Tippy content="More">
//                                                 <Link to={`/users/driver/driverdetails/${item.id}`}><button type="button">
//                                                         <IconMenuMore className="text-dark" />
//                                                         </button>
//                                                     </Link> 
//                                                 </Tippy>
//                                             </li>
//                                         </ul>
//                                     </td>
//                                 </tr>
//                             ))}

//                     </tbody>
//                 </table>
//             </div>
           
//         </div>
//     </div>
// );
// }; 

// export default Driver;
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import IconTrashLines from '../../components/Icon/IconTrashLines';
import IconPencil from '../../components/Icon/IconPencil';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import IconUserPlus from '../../components/Icon/IconUserPlus';
import { getFirestore, collection, getDocs, doc, deleteDoc, updateDoc, addDoc } from 'firebase/firestore';
import IconMenuMore from '../../components/Icon/Menu/IconMenuMore';


const Driver = () => {
    const [items, setItems] = useState([] as any);
    const [editData, setEditData] = useState(null);
    const db = getFirestore();
    const navigate = useNavigate();
console.log("data",items)

    useEffect(() => {
        const fetchData = async () => {
            const querySnapshot = await getDocs(collection(db, 'driver'));
            setItems(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        };
        fetchData().catch(console.error);
    }, []);

    const handleDelete = async (userId: string) => {
        try {
            const userRef = doc(db, 'driver', userId);
            await deleteDoc(userRef);
            setItems((prevItems: any) => prevItems.filter((item: any) => item.id !== userId));
        } catch (error) {
            console.error('Error deleting document: ', error);
        }
    };

    const handleEdit = (item) => {
        navigate(`/users/driver-add/${item.id}`, { state: { editData: item } });
    };

return (
    <div className="grid xl:grid-cols-1 gap-6 grid-cols-1">
        <div className="panel">
            <div className="flex items-center justify-between mb-5">
                <h5 className="font-semibold text-lg dark:text-white-light">Driver Details</h5>
                <Link to="/users/driver-add" className="font-semibold text-success hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-600">
                    <span className="flex items-center">
                        <IconUserPlus className="me-2" />
                        Add New
                    </span>
                </Link>
            </div>
            <div className="table-responsive mb-5 ">
                <table>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Driver Name</th>
                            <th>ID Number</th>
                           <th>Phone Number</th>
                            <th>Service Types</th>
                            <th>Basic Salary</th>
                            <th className="!text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item,index) => {
                            return (
                                <tr key={item.id}>
                                    <td>{index+1}</td>
                                    <td>
                                        <div className="whitespace-nowrap">{item.driverName}</div>
                                    </td>
                                    <td>{item.idnumber}</td>
                                    <td>{item.phone}</td>
                                    <td>
    <ul>
        {Object.entries(item.selectedServices).map(([key, value]) => (
            <li key={key}> {value}</li>
        ))}
    </ul>
</td>
<td>
    <ul>
        {Object.entries(item.basicSalaries).map(([key, value]) => (
            <li key={key}>{key}: {value}</li>
        ))}
    </ul>
</td>





                                    <td className="text-center">
                                        <ul className="flex items-center justify-center gap-2">
                                            <li>
                                            <Tippy content="Edit">
                    <button type="button" onClick={() => handleEdit(item)}>
                        <IconPencil className="text-primary" />
                    </button>
                </Tippy>
                                            </li>
                                            <li>
                                                <Tippy content="Delete">
                                                    <button type="button" onClick={() => handleDelete(item.id)}>
                                                        <IconTrashLines className="text-danger" />
                                                    </button>
                                                </Tippy>
                                            </li>
                                            <li>
                                                <Tippy content="More">
                                                <Link to={`/users/driver/driverdetails/${item.id}`}><button type="button">
                                                        <IconMenuMore className="text-dark" />
                                                        </button>
                                                    </Link> 
                                                </Tippy>
                                            </li>
                                        </ul>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
           
        </div>
    </div>
);
}; 

export default Driver;