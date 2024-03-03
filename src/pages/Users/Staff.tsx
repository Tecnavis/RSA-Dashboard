
    import React, { useEffect, useState } from 'react';
    import { Link, useNavigate } from 'react-router-dom';
    import IconTrashLines from '../../components/Icon/IconTrashLines';
    import IconPencil from '../../components/Icon/IconPencil';
    import Tippy from '@tippyjs/react';
    import 'tippy.js/dist/tippy.css';
    import IconUserPlus from '../../components/Icon/IconUserPlus';
    import { getFirestore, collection, getDocs, doc, deleteDoc, updateDoc, addDoc } from 'firebase/firestore';
    
    const Staff = () => {
        const [items, setItems] = useState([] as any);
        const [editData, setEditData] = useState(null);
        const db = getFirestore();
        const navigate = useNavigate();
    
        useEffect(() => {
            const fetchData = async () => {
                const querySnapshot = await getDocs(collection(db, 'users'));
                setItems(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
            };
            fetchData().catch(console.error);
        }, []);
    
        const handleDelete = async (userId: string) => {
            try {
                const userRef = doc(db, 'users', userId);
                await deleteDoc(userRef);
                setItems((prevItems: any) => prevItems.filter((item: any) => item.id !== userId));
            } catch (error) {
                console.error('Error deleting document: ', error);
            }
        };

        const handleEdit = (item) => {
            navigate(`/users/user-add/${item.id}`, { state: { editData: item } });
        };
    
    return (
        <div className="grid xl:grid-cols-1 gap-6 grid-cols-1">
            <div className="panel">
                <div className="flex items-center justify-between mb-5">
                    <h5 className="font-semibold text-lg dark:text-white-light">Staffs Details</h5>
                    <Link to="/users/user-add" className="font-semibold text-success hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-600">
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
                                <th>Name</th>
                                <th>Email</th>
                                <th>Address</th>

                                <th>Phone Number</th>
                                <th>ShowRoom Name</th>
                                <th>ShowRoom District</th>
                                <th className="!text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item,index) => {
                                return (
                                    <tr key={item.id}>
                                        <td>{index+1}</td>
                                        <td>
                                            <div className="whitespace-nowrap">{item.name}</div>
                                        </td>
                                        <td>{item.email}</td>
                                        <td>{item.address}</td>

                                        <td>{item.phone_number}</td>
                                        <td>{item.showroom_name}</td>

                                        <td>{item.showroom_district}</td>

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
                                            </ul>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                {/* {editData && (
    <div className="modal fixed inset-0 z-10 overflow-y-auto" onClick={() => setEditData(null)}>
    <div className="modal-overlay absolute inset-0 bg-black opacity-30"></div>

                           <div className="modal-container relative mx-auto my-16 p-6 bg-white w-96 rounded shadow-lg"
                                       onClick={(e) => e.stopPropagation()}

                           >
                            <span
                                className="absolute top-0 right-0 cursor-pointer text-gray-600 hover:text-gray-800 p-4"
                                onClick={() => setEditData(null)}
                            >
                                &times;
                            </span>
                            <form
                                className="flex flex-col gap-4"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleUpdate();
                                }}
                            >
                                <label className="text-lg font-semibold">Name:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="border rounded p-2"
                                />

                                <label className="text-lg font-semibold">Email:</label>
                                <input
                                    type="text"
                                    name="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="border rounded p-2"
                                />

                                <label className="text-lg font-semibold">Phone:</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="border rounded p-2"
                                />

                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 cursor-pointer"
                                >
                                    Update
                                </button>
 </form>
                        </div>
                    </div>
                )} */}
            </div>
        </div>
    );
};
export default Staff;
