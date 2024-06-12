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

// Helper function to generate a unique invoice ID
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
        const fetchBookings = async () => {
            try {
                const q = query(collection(db, 'bookings'));
                const querySnapshot = await getDocs(q);
                const bookingsData = [];

                for (const docSnapshot of querySnapshot.docs) {
                    const booking = docSnapshot.data();
                    // Add a unique invoice ID if it doesn't exist
                    if (!booking.invoice) {
                        const invoiceId = generateInvoiceId();
                        booking.invoice = invoiceId;
                        // Update the Firestore document with the new invoice ID
                        await updateDoc(doc(db, 'bookings', docSnapshot.id), { invoice: invoiceId });
                    }
                    bookingsData.push({ id: docSnapshot.id, ...booking });
                }

                setItems(bookingsData);
                setInitialRecords(sortBy(bookingsData, 'invoice'));
                setLoading(false);
            } catch (error) {
                console.error('Error fetching bookings:', error);
                setLoading(false);
            }
        };

        fetchBookings();
    }, [db]);

    useEffect(() => {
        const filteredRecords = items.filter((item) => {
            return (
                item.invoice?.toLowerCase().includes(search.toLowerCase()) ||
                item.customerName?.toLowerCase().includes(search.toLowerCase()) ||
                item.email?.toLowerCase().includes(search.toLowerCase()) ||
                item.dateTime?.toLowerCase().includes(search.toLowerCase()) ||
                item.totalSalary?.toString().toLowerCase().includes(search.toLowerCase()) ||
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
                                render: ({ invoice }) => (
                                    <NavLink to={`/general/expense/preview`}>
                                        <div className="text-primary underline hover:no-underline font-semibold">{`#${invoice}`}</div>
                                    </NavLink>
                                ),
                            },
                            {
                                accessor: 'driver',
                                sortable: true,
                                render: ({ driver, id }) => (
                                    <div className="flex items-center font-semibold">
                                        <div className="p-0.5 bg-white-dark/30 rounded-full w-max ltr:mr-2 rtl:ml-2">
                                            <img className="h-8 w-8 rounded-full object-cover" src={`/assets/images/profile-${id}.jpeg`} alt="" />
                                        </div>
                                        <div>{driver}</div>
                                    </div>
                                ),
                            },
                            {
                                accessor: 'email',
                                sortable: true,
                            },
                            {
                                accessor: 'dateTime',
                                sortable: true,
                            },
                            {
                                accessor: 'totalSalary',
                                sortable: true,
                                titleClassName: 'text-right',
                                render: ({ totalSalary }) => <div className="text-right font-semibold">{`$${totalSalary}`}</div>,
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
