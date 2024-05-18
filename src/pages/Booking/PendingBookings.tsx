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
    id: string; // Assuming you have an 'id' property in your data
};

const PendingBookings = () => {
    const [recordsData, setRecordsData] = useState<RecordData[]>([]); // Provide the type here
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const PAGE_SIZES = [10, 20, 30];
    const db = getFirestore();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Create a query to filter documents with status "ShowRoom Booking"
                const q = query(collection(db, 'bookings'), where('status', '==', 'ShowRoom Booking'));
                const querySnapshot = await getDocs(q);
                const dataWithIndex = querySnapshot.docs.map((doc, index) => ({
                    index: index + 2000,
                    ...doc.data(),
                    id: doc.id,
                }));
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
                            { accessor: 'id', title: 'ID' },
                            { accessor: 'fileNumber', title: 'File Number' },
                            { accessor: 'customerName', title: 'Customer Name' },
                            { accessor: 'phoneNumber', title: 'Phone Number' },
                            { accessor: 'serviceType', title: 'Service Type' },
                            { accessor: 'vehicleNumber', title: 'Vehicle Number (Customer)' },
                            { accessor: 'vehicleModel', title: 'Brand Name' },
                            { accessor: 'comments', title: 'Comments' },
                            {
                                accessor: 'viewMore',
                                title: 'View More',
                                render: (rowData: RecordData) => (
                                    <button className='btn btn-primary'>
                                        <Link to={`/bookings/newbooking/viewmore/${rowData.id}`}>View More</Link>
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
