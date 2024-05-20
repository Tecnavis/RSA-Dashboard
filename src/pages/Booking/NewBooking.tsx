import React, { useEffect, useState } from 'react';
import { DataTable } from 'mantine-datatable';
import { Link, useNavigate } from 'react-router-dom';
import { getFirestore, collection, getDocs, orderBy, query } from 'firebase/firestore';

type RecordData = {
    index: number;
    customerName: string;
    fileNumber: string;
    phoneNumber: string;
    driver: string;
    totalSalary: string;
    photo: string;
    id: string; 
    dateTime: string; 
    status: string;
    bookingStatus:string;
    createdAt: any;
};

const NewBooking = () => {
    const [recordsData, setRecordsData] = useState<RecordData[]>([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const PAGE_SIZES = [10, 20, 30];
    const db = getFirestore();
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
                const querySnapshot = await getDocs(q);
                let data: RecordData[] = querySnapshot.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id,
                })) as RecordData[];

                console.log('Sorted data:', data);

                setRecordsData(data);
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        };

        fetchData().catch(console.error);
    }, [db]);

    const handleEdit = (rowData: RecordData) => {
        navigate(`/bookings/booking/${rowData.id}`, { state: { editData: rowData } });
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h5 className="font-semibold text-lg dark:text-white-light">
                    New Bookings
                </h5>
                <Link
                    to="/bookings/booking"
                    className="btn btn-success"
                >
                    Add Booking
                </Link>
            </div>

            <div className="panel">
                <div className="datatables">
                    <DataTable
                        noRecordsText="No results match your search query"
                        highlightOnHover
                        className="whitespace-nowrap table-hover"
                        records={recordsData}
                        columns={[
                            { accessor: 'dateTime', title: 'Date & Time' },
                            { accessor: 'bookingId', title: 'Booking ID' },
                            { accessor: 'customerName', title: 'Name' },
                            { accessor: 'fileNumber', title: 'File Number' },
                            { accessor: 'phoneNumber', title: 'Phone Number' },
                            { accessor: 'driver', title: 'Driver' },
                            {
                                accessor: 'viewmore',
                                title: 'View More',
                                render: (rowData) => (
                                    <Link
                                        to={`/bookings/newbooking/viewmore/${rowData.id}`}
                                        className="btn btn-primary"
                                    >
                                        View More
                                    </Link>
                                ),
                            },
                            {
                                accessor: 'edit',
                                title: 'Edit',
                                render: (rowData) => (
                                    <button
                                        onClick={() => handleEdit(rowData)}
                                        className="btn btn-warning"
                                    >
                                        Edit
                                    </button>
                                ),
                            },
                        ]}
                        totalRecords={recordsData.length}
                        recordsPerPage={pageSize}
                        page={page}
                        onPageChange={(p) => setPage(p)}
                        recordsPerPageOptions={PAGE_SIZES}
                        onRecordsPerPageChange={setPageSize}
                        minHeight={200}
                        rowStyle={(record) => 
                            record.bookingStatus === 'ShowRoom Booking' ? { backgroundColor: '#ffeeba' } : {}
                        }
                        paginationText={({ from, to, totalRecords }) =>
                            `Showing  ${from} to ${to} of ${totalRecords} entries`
                        }
                    />
                </div>
            </div>
        </div>
    );
};

export default NewBooking;
