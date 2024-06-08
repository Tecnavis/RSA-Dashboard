import React, { useEffect, useState } from 'react';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import Tippy from '@tippyjs/react';

const BaseLocationModal = ({ onClose, setBaseLocation }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [items, setItems] = useState([]);
    const db = getFirestore();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'baselocation'));
                const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                setItems(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [db]);
    const filteredItems = items.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
   

    const handleSelect = (item) => {
        setBaseLocation(item); // Update the base location in the parent component
        onClose(); // Close the modal
    };

  

    return (
        <div className="base-location-form-container">
             <div className="search-container" style={{ marginBottom: '10px' }}>
    <input
        type="text"
        placeholder="Search locations..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
            padding: '8px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            width: '100%',
            maxWidth: '300px',
            boxSizing: 'border-box',
        }}
    />
</div>

            <div className="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Start Location</th>
                            <th className="!text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredItems.map((item) => (
                            <tr key={item.id}>
                                <td>
                                    <div className="whitespace-nowrap">{item.name}</div>
                                </td>
                                <td className="text-center">
                                    <ul className="flex items-center justify-center gap-2">
                                        <li>
                                            <Tippy content="Select">
                                                <button
                                                    type="button"
                                                    className="btn btn-secondary"
                                                    onClick={() => handleSelect(item)}
                                                >
                                                    Select
                                                </button>
                                            </Tippy>
                                        </li>
                                        <li>
                                           
                                        </li>
                                    </ul>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BaseLocationModal;
