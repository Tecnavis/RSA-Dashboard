import React, { useEffect, useState } from 'react';
import { DataTable } from 'mantine-datatable';
import { Link } from 'react-router-dom';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

// Assuming your record data has a type like this
type RecordData = {
    index: number;
    customerName: string;
    fileNumber: string;
    phoneNumber: string;
    serviceType: string;
    vehicleNumber: string;
    vehicleModel: string;
    comments: string;
    id: string; 
    status: string; 
    bookingStatus:string;
    dateTime: string;
};

const PendingBookings = () => {
    const [recordsData, setRecordsData] = useState<RecordData[]>([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const PAGE_SIZES = [10, 20, 30];
    const db = getFirestore();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const q = query(collection(db, 'bookings'), where('status', '==', 'booking added'));
                const querySnapshot = await getDocs(q);
                const dataWithIndex = querySnapshot.docs
                    .map((doc) => ({
                        ...doc.data(),
                        id: doc.id,
                    }))
                    .filter((record) => record.status !== 'Order Completed'); // Filter out 'Order Completed'
                
                setRecordsData(dataWithIndex);
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        };

        fetchData().catch(console.error);
    }, [db]);

    return (
        <div>
            <div className="panel mt-6">
                <h5 className="font-semibold text-lg dark:text-white-light mb-5">
                    Pending Bookings
                </h5>

                <div className="datatables">
                    <DataTable
                        noRecordsText="No results match your search query"
                        highlightOnHover
                        className="whitespace-nowrap table-hover"
                        records={recordsData}
                        columns={[
                            { accessor: 'dateTime', title: 'Booking Date & Time' },                            { accessor: 'fileNumber', title: 'File Number' },
                            { accessor: 'customerName', title: 'Customer Name' },
                            { accessor: 'phoneNumber', title: 'Phone Number' },
                            {
                                accessor: 'viewMore',
                                title: 'View More',
                                render: (rowData: RecordData) => (
                                    <Link to={`/bookings/newbooking/viewmore/${rowData.id}`}>
                                        <button
                                            style={{
                                                backgroundColor: '#ffc107',
                                                color: '#212529',
                                                border: 'none',
                                                padding: '0.5rem 1rem',
                                                borderRadius: '5px',
                                                cursor: 'pointer',
                                                transition: 'background-color 0.3s',
                                                animation: 'pulse 1.5s infinite', 
                                            }}
                                        >
                                            Pending
                                        </button>
                                    </Link>
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
                            `Showing ${from} to ${to} of ${totalRecords} entries`
                        }
                    />
                </div>
            </div>
        </div>
    );
};

export default PendingBookings;
