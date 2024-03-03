import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import IconX from '../../components/Icon/IconX';
import IconDownload from '../../components/Icon/IconDownload';
import IconEye from '../../components/Icon/IconEye';
import IconSend from '../../components/Icon/IconSend';
import IconSave from '../../components/Icon/IconSave';
import IconPlus from '../../components/Icon/IconPlus';
import IconPlusCircle from '../../components/Icon/IconPlusCircle';
import IconMapPin from '../../components/Icon/IconMapPin';

const Booking = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Invoice Add'));
    });
    const currencyList = ['USD - US Dollar', 'GBP - British Pound', 'IDR - Indonesian Rupiah', 'INR - Indian Rupee', 'BRL - Brazilian Real', 'EUR - Germany (Euro)', 'TRY - Turkish Lira'];

    const [items, setItems] = useState<any>([
        {
            id: 1,
            title: '',
            description: '',
            rate: 0,
            quantity: 0,
            amount: 0,
        },
    ]);

    const addItem = () => {
        let maxId = 0;
        maxId = items?.length ? items.reduce((max: number, character: any) => (character.id > max ? character.id : max), items[0].id) : 0;

        setItems([...items, { id: maxId + 1, title: '', description: '', rate: 0, quantity: 0, amount: 0 }]);
    };

    const removeItem = (item: any = null) => {
        setItems(items.filter((d: any) => d.id !== item.id));
    };

    const changeQuantityPrice = (type: string, value: string, id: number) => {
        const list = items;
        const item = list.find((d: any) => d.id === id);
        if (type === 'quantity') {
            item.quantity = Number(value);
        }
        if (type === 'price') {
            item.amount = Number(value);
        }
        setItems([...list]);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <h5 className="font-semibold text-lg dark:text-white-light">Add Bookings </h5>

        <div style={{ padding: '6px', flex: 1, marginTop: '2rem', marginRight: '6rem', marginLeft: '6rem', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', borderRadius: '10px' }}>

            <div style={{ display: 'flex',  flexWrap: 'wrap', padding: '1rem' }}>
            <h5 className="font-semibold text-lg dark:text-white-light mb-5">Book Now</h5>

                <div style={{ width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '1rem' }}>
                        <label htmlFor="country" style={{ marginRight: '0.5rem', marginLeft: '0.5rem', width: '33%', marginBottom: '0', color: '#333' }}>
                            Operation Base Location
                        </label>
                        <select id="country" name="country" style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '5px', fontSize: '1rem', outline: 'none', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                            <option value="">Choose Location</option>
                            <option value="United States">United States</option>
                            <option value="Zambia">Zambia</option>
                            <option value="Zimbabwe">Zimbabwe</option>
                        </select>
                    </div>
                           
                            <div style={{ display: 'flex', alignItems: 'center', marginTop: '1rem' }}>
                    <label htmlFor="country" style={{ marginRight: '0.5rem', marginLeft: '0.5rem', width: '33%', marginBottom: '0', color: '#333' }}>
                        Company
                    </label>
                    <select id="country" name="country" style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '5px', fontSize: '1rem', outline: 'none', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                        <option value="">Select Company</option>
                        <option value="United States">United States</option>
                        <option value="Zambia">Zambia</option>
                        <option value="Zimbabwe">Zimbabwe</option>
                    </select>
                </div>
                          
                        <div className="flex items-center mt-4">
                            <label htmlFor="invoiceLabel" className="ltr:mr-3 rtl:ml-2 w-1/3 mb-0">
                                File Number
                            </label>
                            <input id="invoiceLabel" type="text" name="inv-label" className="form-input lg:w-[250px] w-2/3" placeholder="Enter File Number"  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '5px', fontSize: '1rem', outline: 'none', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}/>
                        </div>
                        <div className="flex items-center mt-4">
                                <label htmlFor="country" className="ltr:mr-2 rtl:ml-2 w-1/4 mb-0">
                               ShowRoom
                                </label>
                                <select id="country" name="country" className="form-select flex-1" style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '5px', fontSize: '1rem', outline: 'none', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                                    <option value="">Select ShowRoom</option>
                                    <option value="United States">United States</option>
                                    <option value="United Kingdom">United Kingdom</option>
                                    <option value="Canada">Canada</option>
                                  
                                    <option value="Zambia">Zambia</option>
                                    <option value="Zimbabwe">Zimbabwe</option>
                                </select>
                               <Link to='/showrooms/showroom' className='bg-success text-white p-2 ml-2' style={{borderRadius:"20px"}}><IconPlus/></Link> 
                            </div>
                            <div className="mt-4 flex items-center">
                                <label htmlFor="reciever-name" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
                                    Customer Name
                                </label>
                                <input id="reciever-name" type="text" name="reciever-name" className="form-input flex-1" placeholder="Enter Name"  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '5px', fontSize: '1rem', outline: 'none', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}/>
                            </div>
                            <div className="mt-4 flex items-center">
                                <label htmlFor="reciever-number" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
                                    Phone Number
                                </label>
                                <input id="reciever-number" type="text" name="reciever-number" className="form-input flex-1" placeholder="Enter Phone number"  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '5px', fontSize: '1rem', outline: 'none', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}/>
                            </div>
                            <div className="mt-4 flex items-center">
                                <label htmlFor="reciever-number" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
                                    Mobile Number
                                </label>
                                <input id="reciever-number" type="text" name="reciever-number" className="form-input flex-1" placeholder="Enter Mobile number"  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '5px', fontSize: '1rem', outline: 'none', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}/>
                            </div>

                            <div className="mt-4 flex items-center">
                                <label htmlFor="location" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
                                Pickup Location

                                </label>
                                <input id="location" type="text" name="reciever-number" className="form-input flex-1"  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '5px', fontSize: '1rem', outline: 'none', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}/>
                            <IconMapPin className='ml-2 text-primary'/>
                            </div>
                         
                            <div className="mt-4 flex items-center">
                                <label htmlFor="location" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
                                Drop off Location

                                </label>
                                <input id="location" type="text" name="reciever-number" className="form-input flex-1"  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '5px', fontSize: '1rem', outline: 'none', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}/>
                                <IconMapPin className='ml-2 text-primary'/>
                            </div>
                            <div className="mt-4 flex items-center">
                                <label htmlFor="reciever-name" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
                                   Distance (KM)
                                </label>
                                <input id="reciever-name" type="text" name="reciever-name" className="form-input flex-1" style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '5px', fontSize: '1rem', outline: 'none', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}/>
                            </div>


                            <div className="flex items-center mt-4">
                                <label htmlFor="country" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
                                Service Type
                                </label>
                                <select id="country" name="country" className="form-select flex-1" style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '5px', fontSize: '1rem', outline: 'none', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                                    <option value=""></option>
                                    <option value="United States">Flat bed</option>
                                    <option value="United Kingdom">Under Lift</option>
                                    
                                    <option value="Zambia">Rsr By Car</option>
                                    <option value="Zimbabwe">Rsr By Bike</option>
                                    <option value="United Kingdom">Custody</option>

                                    <option value="United Kingdom">Hydra Crane</option>

                                    <option value="United Kingdom">Jump start</option>

                                    <option value="United Kingdom">Tow Wheeler Fbt</option>

                                    <option value="United Kingdom">Zero Digri Flat Bed</option>

                                    <option value="United Kingdom">Undet Lift 407</option>

                                    <option value="United Kingdom">S Lorry Crane Bed</option>

                                </select>
                                <Link to='/showrooms/showroom' className='bg-success text-white p-2 ml-2' style={{borderRadius:"20px"}}><IconPlus/></Link> 

                            </div>
                           
                            <div className="flex items-center mt-4">
                                <label htmlFor="country" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
                                Service Vehicle
                                </label>
                                <select id="country" name="country" className="form-select flex-1" style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '5px', fontSize: '1rem', outline: 'none', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                                    <option value=""></option>
                                    <option value="United States">United States</option>
                                    <option value="United Kingdom">United Kingdom</option>
                                   
                                    <option value="Zambia">Zambia</option>
                                    <option value="Zimbabwe">Zimbabwe</option>
                                </select>
                                <Link to='/showrooms/showroom' className='bg-success text-white p-2 ml-2' style={{borderRadius:"20px"}}><IconPlus/></Link> 

                            </div>
                            <div className="flex items-center mt-4">
                                <label htmlFor="country" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
                                Driver
                                </label>
                                <select id="country" name="country" className="form-select flex-1" style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '5px', fontSize: '1rem', outline: 'none', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                                    <option value=""></option>
                                    <option value="United States">United States</option>
                                    <option value="United Kingdom">United Kingdom</option>
                                    <option value="Canada">Canada</option>
                                    
                                    <option value="Zambia">Zambia</option>
                                    <option value="Zimbabwe">Zimbabwe</option>
                                </select>
                                <Link to='/users/driver' className='bg-success text-white p-2 ml-2' style={{borderRadius:"20px"}}><IconPlus/></Link> 

                            </div>
                            <div className="mt-4 flex items-center">
                                <label htmlFor="reciever-number" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
                                Vehicle Number
                                </label>
                                <input id="reciever-number" type="text" name="reciever-number" className="form-input flex-1" placeholder="Enter vehicle number"  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '5px', fontSize: '1rem', outline: 'none', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}/>
                            </div>
                            <div className="flex items-center mt-4">
                                <label htmlFor="country" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0">
                                Vehicle Model
                                </label>
                                <select id="country" name="country" className="form-select flex-1" style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '5px', fontSize: '1rem', outline: 'none', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                                    <option value=""></option>
                                    <option value="United States">United States</option>
                                    <option value="United Kingdom">United Kingdom</option>
                                    <option value="Canada">Canada</option>
                                  
                                    <option value="Zambia">Zambia</option>
                                    <option value="Zimbabwe">Zimbabwe</option>
                                </select>
                            </div>
                            <div className="mt-4 flex items-center">
                              
                                <textarea id="reciever-name"  name="reciever-name" className="form-input flex-1" placeholder="Comments"  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '5px', fontSize: '1rem', outline: 'none', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}/>
                            </div>
                            <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                    <button type="button" style={{ backgroundColor: '#28a745', color: '#fff', padding: '0.5rem', width: '100%', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                        Save
                    </button>
                        </div>

                    </div>
                </div>
               
               
         
            </div>
          
        </div>
    );
};

export default Booking;
