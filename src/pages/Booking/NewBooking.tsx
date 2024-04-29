import React, { useEffect, useState } from 'react';
import { DataTable } from 'mantine-datatable';
import { Link } from 'react-router-dom';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

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
};

const NewBooking = () => {
    const [recordsData, setRecordsData] = useState<RecordData[]>([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const PAGE_SIZES = [10, 20, 30];
    const db = getFirestore();
    useEffect(() => {
      const fetchData = async () => {
          try {
              const querySnapshot = await getDocs(collection(db, 'bookings'));
              let data: RecordData[] = querySnapshot.docs.map((doc) => ({
                  ...doc.data(),
                  id: doc.id,
              }));
  
              // Sort data based on dateTime field in descending order
              data.sort((a, b) => {
                  const dateA = new Date(a.dateTime).getTime();
                  const dateB = new Date(b.dateTime).getTime();
                  return dateB - dateA;
              });
  
              console.log('Sorted data:', data);
  
              setRecordsData(data);
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
                    New Bookings
                </h5>

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
                        ]}
                        totalRecords={recordsData.length}
                        recordsPerPage={pageSize}
                        page={page}
                        onPageChange={(p) => setPage(p)}
                        recordsPerPageOptions={PAGE_SIZES}
                        onRecordsPerPageChange={setPageSize}
                        minHeight={200}
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
