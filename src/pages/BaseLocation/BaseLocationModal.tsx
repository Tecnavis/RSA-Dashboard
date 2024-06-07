import React, { useEffect, useState } from 'react';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import './BaseLocationForm.css'; // Import the CSS file
import MyMapComponent from './MyMapComponent';
import Tippy from '@tippyjs/react';
import IconPencil from '../../components/Icon/IconPencil';
import IconTrashLines from '../../components/Icon/IconTrashLines';
import { Link, useNavigate } from 'react-router-dom';

const BaseLocationModal = () => {
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');
    const [baseLocation, setBaseLocation] = useState(null); // Add this line
    const [baseLocationName, setBaseLocationName] = useState('');
    const [savedBaseLocation, setSavedBaseLocation] = useState(null);
    const [items, setItems] = useState([]);
    const db = getFirestore();
    const navigate = useNavigate(); // Use the useNavigate hook

    const handleMapClick = (location) => {
        setLat(location.lat);
        setLng(location.lng);
        setBaseLocation(location); // Update baseLocation state
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'baselocation'));
                const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                console.log('Fetched data:', data);
                setItems(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [db]);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const baseLocationDetails = { name: baseLocationName, lat, lng };
        try {
            await addDoc(collection(db, 'baselocation'), baseLocationDetails);
            setSavedBaseLocation(baseLocationDetails);
            setBaseLocationName('');
            setLat('');
            setLng('');
        } catch (error) {
            console.error('Error adding base location: ', error);
        }
    };

    const handleSelect = (item) => {
        navigate('/bookings/booking', { state: { baseLocation: item } });
    };
    const handleDelete = async (id) => {
        console.log('Deleting document with ID:', id);

        try {
            await deleteDoc(doc(db, 'baselocation', id));
            // Update the items state to remove the deleted item
            setItems(items.filter(item => item.id !== id));
        } catch (error) {
            console.error('Error deleting base location: ', error);
        }
    };
    return (
        <div className="base-location-form-container">
          
            <div className="table-responsive mb-5">
                <table>
                    <thead>
                        <tr>
                            <th>Start Location</th>
                            <th className="!text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => (
                            <tr key={item.id}>
                                <td>
                                    <div className="whitespace-nowrap">{item.name}</div>
                                </td>
                             
                                <td className="text-center">
                                    <ul className="flex items-center justify-center gap-2">
                                       
                                       
                                        <li>
                                            <Tippy content="Select">
                                                <button type="button" className="btn btn-secondary" onClick={() => handleSelect(item)}>
                                                    Select
                                                </button>
                                            </Tippy>
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
