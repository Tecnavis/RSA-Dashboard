import React, { useEffect, useState } from 'react';
import { DataTable } from 'mantine-datatable';
import { Link } from 'react-router-dom';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid'; // Import UUID library

// Assuming your record data has a type like this
type RecordData = {
  index: number;
  customerName: string;
  fileNumber: string;
  phoneNumber: string;
  driver: string;
  id: string; // Assuming you have an 'id' property in your data
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

  // Function to generate a booking ID
  const generateBookingId = () => {
    return uuidv4(); // Generate a UUID
  };

  return (
    <div>
      <div className="panel mt-6">
        <h5 className="font-semibold text-lg dark:text-white-light mb-5">
          New Bookings{' '}
          <Link
            to={`/bookings/booking?bookingId=${generateBookingId()}`} // Pass the generated ID as a query parameter
            style={{
              display: 'inline-block',
              textDecoration: 'none',
              background: '#28a745',
              color: '#fff',
              padding: '5px 15px',
              borderRadius: '5px',
              marginLeft: '50px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.4)',
              cursor: 'pointer',
            }}
          >
            <span>+ Add Bookings</span>
          </Link>
        </h5>

        <div className="datatables">
          <DataTable
            noRecordsText="No results match your search query"
            highlightOnHover
            className="whitespace-nowrap table-hover"
            records={recordsData}
            columns={[
              { accessor: 'index', title: 'ID' },
              { accessor: 'customerName', title: 'Name' },
              { accessor: 'fileNumber', title: 'File Number' },
              { accessor: 'phoneNumber', title: 'Phone Number' },
              { accessor: 'driver', title: 'Driver' },
              {
                accessor: 'viewmore',
                title: 'ViewMore',
                render: (rowData: RecordData) => (
                  <button className='btn btn-primary'> <Link to={`/bookings/newbooking/viewmore/${rowData.id}`}>View More</Link></button>
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
