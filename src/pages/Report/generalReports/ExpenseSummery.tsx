import { Link, NavLink } from 'react-router-dom';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useState, useEffect } from 'react';
import sortBy from 'lodash/sortBy';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import IconTrashLines from '../../../components/Icon/IconTrashLines';
import IconPlus from '../../../components/Icon/IconPlus';
import IconEdit from '../../../components/Icon/IconEdit';
import IconEye from '../../../components/Icon/IconEye';
import { collection, getDocs, getFirestore, query, updateDoc, doc } from 'firebase/firestore';

const generateInvoiceId = () => {
    const timestamp = Date.now().toString(); // Current timestamp
    const randomStr = Math.random().toString(36).substring(2, 8); // Random string
    return `INV-${timestamp}-${randomStr}`;
};

const ExpenseSummery = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Invoice List'));
    }, [dispatch]);

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [initialRecords, setInitialRecords] = useState([]);
    const [records, setRecords] = useState([]);
    const [selectedRecords, setSelectedRecords] = useState([]);
    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'customerName',
        direction: 'asc',
    });

    const db = getFirestore();

    useEffect(() => {
        const fetchBookingsAndDrivers = async () => {
            try {
                const bookingsQuery = query(collection(db, 'bookings'));
                const driversQuery = query(collection(db, 'driver'));

                const [bookingsSnapshot, driversSnapshot] = await Promise.all([
                    getDocs(bookingsQuery),
                    getDocs(driversQuery)
                ]);

                const driversData = {};
                
                driversSnapshot.forEach((doc) => {
                    driversData[doc.id] = doc.data();
                });
                const bookingsData = [];
                for (const docSnapshot of bookingsSnapshot.docs) {
                    const booking = docSnapshot.data();
console.log("booking",booking)                  
  if (!booking.invoice) {
                        const invoiceId = generateInvoiceId();
                        booking.invoice = invoiceId;
                        // Update the Firestore document with the new invoice ID
                        await updateDoc(doc(db, 'bookings', docSnapshot.id), { invoice: invoiceId });
                    }
                    // Add driver information
                    const driverId = booking.selectedDriver;
console.log("driverId",driverId)       
             const driver = driversData[driverId];
             console.log("driver12134565",driver)
                    if (driver) {
                        booking.driverName = driver.driverName;
                        booking.driverImg = driver.profileImageUrl; // Assuming there's an 'img' field in the driver data
                    }
                    bookingsData.push({ id: docSnapshot.id, ...booking });
                }

                setItems(bookingsData);
                setInitialRecords(sortBy(bookingsData, 'invoice'));
                setLoading(false);
            } catch (error) {
                console.error('Error fetching bookings or drivers:', error);
                setLoading(false);
            }
        };

        fetchBookingsAndDrivers();
    }, [db]);

    useEffect(() => {
        const filteredRecords = items.filter((item) => {
            return (
                item.invoice?.toLowerCase().includes(search.toLowerCase()) ||
                item.customerName?.toLowerCase().includes(search.toLowerCase()) ||
                item.email?.toLowerCase().includes(search.toLowerCase()) ||
                item.dateTime?.toLowerCase().includes(search.toLowerCase()) ||
                item.updatedTotalSalary?.toString().toLowerCase().includes(search.toLowerCase()) ||
                item.status?.toLowerCase().includes(search.toLowerCase())
            );
        });
        setInitialRecords(filteredRecords);
    }, [search, items]);

    useEffect(() => {
        const sortedRecords = sortBy(initialRecords, sortStatus.columnAccessor);
        setRecords(sortStatus.direction === 'desc' ? sortedRecords.reverse() : sortedRecords);
        setPage(1);
    }, [sortStatus, initialRecords]);

    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecords([...initialRecords.slice(from, to)]);
    }, [page, pageSize, initialRecords]);

    const deleteRow = (id) => {
        if (window.confirm('Are you sure want to delete selected row ?')) {
            const updatedRecords = items.filter(item => item.id !== id);
            setItems(updatedRecords);
            setInitialRecords(updatedRecords);
            setRecords(updatedRecords.slice((page - 1) * pageSize, page * pageSize));
            setSelectedRecords([]);
        }
    };

    return (
        <div className="panel px-0 border-white-light dark:border-[#1b2e4b]">
            <div className="invoice-table">
                <div className="mb-4.5 px-5 flex md:items-center md:flex-row flex-col gap-5">
                    <div className="ltr:ml-auto rtl:mr-auto">
                        <input 
                            type="text" 
                            className="form-input w-auto" 
                            placeholder="Search..." 
                            value={search} 
                            onChange={(e) => setSearch(e.target.value)} 
                        />
                    </div>
                </div>

                <div className="datatables pagination-padding">
                    <DataTable
                        className="whitespace-nowrap table-hover invoice-table"
                        records={records}
                        columns={[
                            {
                                accessor: 'invoice',
                                sortable: true,
                                render: ({ invoice, id }) => (
                                    <NavLink
                                        to={{
                                            pathname: `/general/expense/preview/${id}`, // Ensure `${id}` is correctly interpolated
                                        }}
                                    >
                                        <div className="text-primary underline hover:no-underline font-semibold">{`#${invoice}`}</div>
                                    </NavLink>
                                ),
                            },
                            {
                                accessor: 'driver',
                                sortable: true,
                                render: ({ driverName, driverImg }) => (
                                    <div className="flex items-center font-semibold">
                                        <div className="p-0.5 bg-white-dark/30 rounded-full w-max ltr:mr-2 rtl:ml-2">
                                            <img className="h-8 w-8 rounded-full object-cover" src={driverImg} alt={driverName} />
                                        </div>
                                        <div>{driverName}</div>
                                    </div>
                                ),
                            },
                            {
                                accessor: 'customerName',
                                sortable: true,
                            },
                            {
                                accessor: 'dateTime',
                                sortable: true,
                            },
                            {
                                accessor: 'payable amount',
                                sortable: true,
                                titleClassName: 'text-right',
                                render: ({ updatedTotalSalary }) => <div className="text-right font-semibold">{`$${updatedTotalSalary}`}</div>,
                            },
                            {
                                accessor: 'status',
                                sortable: true,
                                render: ({ status }) => <span className={`badge badge-outline-${status === 'Order Completed' ? 'success' : 'warning'}`}>{status}</span>,
                            },
                            {
                                accessor: 'action',
                                title: 'Actions',
                                sortable: false,
                                textAlignment: 'center',
                                render: ({ id }) => (
                                    <div className="flex gap-4 items-center w-max mx-auto">
                                        <NavLink to={`/apps/invoice/edit/${id}`} className="flex hover:text-info">
                                            <IconEdit className="w-4.5 h-4.5" />
                                        </NavLink>
                                        <NavLink to={`/apps/invoice/preview/${id}`} className="flex hover:text-primary">
                                            <IconEye />
                                        </NavLink>
                                        <button type="button" className="flex hover:text-danger" onClick={() => deleteRow(id)}>
                                            <IconTrashLines />
                                        </button>
                                    </div>
                                ),
                            },
                        ]}
                        highlightOnHover
                        totalRecords={initialRecords.length}
                        recordsPerPage={pageSize}
                        page={page}
                        onPageChange={setPage}
                        recordsPerPageOptions={PAGE_SIZES}
                        onRecordsPerPageChange={setPageSize}
                        sortStatus={sortStatus}
                        onSortStatusChange={setSortStatus}
                        selectedRecords={selectedRecords}
                        onSelectedRecordsChange={setSelectedRecords}
                        paginationText={({ from, to, totalRecords }) => `Showing ${from} to ${to} of ${totalRecords} entries`}
                    />
                </div>
            </div>
        </div>
    );
};

export default ExpenseSummery;
