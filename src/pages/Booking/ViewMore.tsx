// // import React, { useEffect, useState } from 'react';
// // import { useParams } from 'react-router-dom';
// // import { getFirestore, doc, getDoc } from 'firebase/firestore';

// // const ViewMore = () => {
// //   const { id } = useParams();
// //   const [bookingDetails, setBookingDetails] = useState(null);
// //   const db = getFirestore();

// //   useEffect(() => {
// //     const fetchBookingDetails = async () => {
// //       try {
// //         const docRef = doc(db, 'bookings', id);
// //         const docSnap = await getDoc(docRef);
      
// //         if (docSnap.exists()) {
// //           // Document exists, proceed with data retrieval
// //           const data = docSnap.data(); // Get the data from the document
// //           setBookingDetails(data); // Update the state with the data
// //         } else {
// //           console.log(`Document with ID ${id} does not exist!`);
// //         }
// //       } catch (error) {
// //         console.error('Error fetching data:', error);
// //       }
// //     };

// //     fetchBookingDetails().catch(console.error);
// //   }, [db, id]);

// //   if (!bookingDetails) {
// //     return <div>Loading...</div>;
// //   }
// //   return (
// //     <div>
// //       <h2>Booking Details for ID: {id}</h2>

// //       <p>{bookingDetails.location}</p>
// //       <p>{bookingDetails.company}</p>
// //       <p>{bookingDetails.fileNumber}</p>
// //       <p>{bookingDetails.showroom}</p>
// //       <p>{bookingDetails.customerName}</p>
// //       <p>{bookingDetails.phoneNumber}</p>
// //       <p>{bookingDetails.mobileNumber}</p>
// //       <p>{bookingDetails.pickupLocation}</p>
// //       <p>{bookingDetails.dropOffLocation}</p>
// //       <p>{bookingDetails.distance}</p>
// //       <p>{bookingDetails.serviceType}</p>
// //       <p>{bookingDetails.serviceVehicle}</p>
// //       <p>{bookingDetails.driver}</p>
// //       <p>{bookingDetails.vehicleNumber}</p>
// //       <p>{bookingDetails.vehicleModel}</p>
// //       <p>{bookingDetails.comments}</p>


// //     </div>
// //   );
// // };

// // export default ViewMore;
// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { getFirestore, doc, getDoc } from 'firebase/firestore';

// const ViewMore = () => {
//   const { id } = useParams();
//   const [bookingDetails, setBookingDetails] = useState(null);
//   const db = getFirestore();

//   useEffect(() => {
//     const fetchBookingDetails = async () => {
//       try {
//         const docRef = doc(db, 'bookings', id);
//         const docSnap = await getDoc(docRef);
      
//         if (docSnap.exists()) {
//           const data = docSnap.data();
//           setBookingDetails(data);
//         } else {
//           console.log(`Document with ID ${id} does not exist!`);
//         }
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };

//     fetchBookingDetails().catch(console.error);
//   }, [db, id]);

//   if (!bookingDetails) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="view-more-container">
//       <h2>Booking Details for ID: {id}</h2>

//       <div className="booking-details">
//         <p><strong>Location:</strong> {bookingDetails.location}</p>
//         <p><strong>Company:</strong> {bookingDetails.company}</p>
//         <p><strong>File Number:</strong> {bookingDetails.fileNumber}</p>
//         <p><strong>Location:</strong> {bookingDetails.showroom}</p>
//         <p><strong>customerName:</strong> {bookingDetails.customerName}</p>
//         <p><strong>phoneNumber:</strong> {bookingDetails.phoneNumber}</p>
//         <p><strong>MobileNumber:</strong> {bookingDetails.mobileNumber}</p>
//         <p><strong>PickupLocation:</strong> {bookingDetails.pickupLocation}</p>
//         <p><strong>DropOffLocation:</strong> {bookingDetails.dropOffLocation}</p>
//         <p><strong>Distance:</strong> {bookingDetails.distance}</p>
//         <p><strong>ServiceType:</strong> {bookingDetails.serviceType}</p>
//         <p><strong>ServiceVehicle:</strong> {bookingDetails.serviceVehicle}</p>
//         <p><strong>Driver:</strong> {bookingDetails.driver}</p>
//         <p><strong>VehicleNumber:</strong> {bookingDetails.vehicleNumber}</p>
//         <p><strong>VehicleModel:</strong> {bookingDetails.vehicleModel}</p>
//         <p><strong>Comments:</strong> {bookingDetails.comments}</p>

//       </div>
//     </div>
//   );
// };

// export default ViewMore;
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const ViewMore = () => {
  const { id } = useParams();
  const [bookingDetails, setBookingDetails] = useState(null);
  const db = getFirestore();

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const docRef = doc(db, 'bookings', id);
        const docSnap = await getDoc(docRef);
      
        if (docSnap.exists()) {
          const data = docSnap.data();
          setBookingDetails(data);
        } else {
          console.log(`Document with ID ${id} does not exist!`);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchBookingDetails().catch(console.error);
  }, [db, id]);

  if (!bookingDetails) {
    return <div>Loading...</div>;
  }

  const containerStyle = {
    margin: '2rem',
    padding: '1rem',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    borderRadius: '10px',
  };

  const headingStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    textAlign: 'center',
    padding:'20px',
  };

  const detailsContainerStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  };

  const labelStyle = {
    fontWeight: 'bold',
    marginBottom: '0.5rem',
    paddingTop:'30px',
    paddingLeft:'190px'
  };

  const detailsStyle = {
    marginBottom: '1rem',
    paddingLeft:'190px'

  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Booking Details of  {bookingDetails.customerName}</h2>

      <div style={detailsContainerStyle}>
        <div>
          <p style={labelStyle}>Location:</p>
          <p style={detailsStyle}>{bookingDetails.location}</p>
          <p style={labelStyle}>Company:</p>
          <p style={detailsStyle}>{bookingDetails.company}</p>
          <p style={labelStyle}>File Number:</p>
          <p style={detailsStyle}>{bookingDetails.fileNumber}</p>
          <p style={labelStyle}>ShowRoom:</p>
          <p style={detailsStyle}>{bookingDetails.showroom}</p>
          <p style={labelStyle}>customerName:</p>
          <p style={detailsStyle}>{bookingDetails.customerName}</p> 
          <p style={labelStyle}>Driver:</p>
          <p style={detailsStyle}>{bookingDetails.driver}</p>
          <p style={labelStyle}>VehicleNumber:</p>
          <p style={detailsStyle}>{bookingDetails.vehicleNumber}</p>
          <p style={labelStyle}>VehicleModel:</p>
          <p style={detailsStyle}>{bookingDetails.vehicleModel}</p>       </div>

        <div>
        <p style={labelStyle}>phoneNumber:</p>
          <p style={detailsStyle}>{bookingDetails.phoneNumber}</p> 
          <p style={labelStyle}>MobileNumber:</p>
          <p style={detailsStyle}>{bookingDetails.mobileNumber}</p>
          <p style={labelStyle}>PickupLocation:</p>
          <p style={detailsStyle}>{bookingDetails.pickupLocation}</p>
          <p style={labelStyle}>DropOffLocation:</p>
          <p style={detailsStyle}>{bookingDetails.dropOffLocation}</p>
          <p style={labelStyle}>Distance:</p>
          <p style={detailsStyle}>{bookingDetails.distance}</p>
          <p style={labelStyle}>ServiceType:</p>
          <p style={detailsStyle}>{bookingDetails.serviceType}</p>
          <p style={labelStyle}>ServiceVehicle:</p>
          <p style={detailsStyle}>{bookingDetails.serviceVehicle}</p>
          <p style={labelStyle}>Comments:</p>
          <p style={detailsStyle}>{bookingDetails.comments}</p>
                 </div>
      </div>
      
    </div>
  );
};

export default ViewMore;
