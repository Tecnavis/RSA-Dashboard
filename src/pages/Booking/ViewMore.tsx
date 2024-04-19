
import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { getFirestore, doc, getDoc,updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const ViewMore = () => {
  const { id } = useParams();
  console.log("id",id)
  const [bookingDetails, setBookingDetails] = useState(null);
  const db = getFirestore();
  const { search } = useLocation();
  const [showPickupDetails, setShowPickupDetails] = useState(false);
  const [showDropoffDetails, setShowDropoffDetails] = useState(false);
  const queryParams = new URLSearchParams(search);
 console.log("first",bookingDetails)
 useEffect(() => {
  const fetchBookingDetails = async () => {
    try {
      const docRef = doc(db, 'bookings', id);
      const docSnap = await getDoc(docRef);
      console.log("Document data:", docSnap.data());
  
      if (docSnap.exists()) {
        const data = docSnap.data();
        setBookingDetails({
          ...data,
          kilometer: data.kilometer || "No data",
          kilometerdrop: data.kilometerdrop || "No data",
          photo: data.photo, // Directly use the stored URL
          photodrop: data.photodrop,
          rcBookImageURLs: data.rcBookImageURLs || [],
          vehicleImageURLs: data.vehicleImageURLs || [],
          vehicleImgURLs: data.vehicleImgURLs || [],
          fuelBillImageURLs:data.fuelBillImageURLs || []
        });
      } else {
        console.log(`Document with ID ${id} does not exist!`);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  

  fetchBookingDetails().catch(console.error);
}, [db, id]); // Ensure that db and id are stable references to avoid unnecessary fetches

  const togglePickupDetails = () => {
    setShowPickupDetails(!showPickupDetails);
    setShowDropoffDetails(false); // Add this line to ensure dropoff details are hidden when showing pickup details
};

const toggleDropoffDetails = () => {
    setShowDropoffDetails(!showDropoffDetails);
    setShowPickupDetails(false); // Add this line to ensure pickup details are hidden when showing dropoff details
};

  if (!bookingDetails) {
    return <div>Loading...</div>;
  }

  const containerStyle = {
    margin: '2rem',
    padding: '1rem',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    borderRadius: '10px',
  };

 

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
  };

  const thStyle = {
    backgroundColor: '#f2f2f2',
    padding: '8px',
    textAlign: 'left',
    fontWeight: 'bold',
  };

  const tdStyle = {
    padding: '8px',
    borderBottom: '1px solid #ddd',
  };

  return (
    <div style={containerStyle}>
 <h5 className="font-semibold text-lg dark:text-white-light mb-5">
          Booking Details {' '}
       
        </h5>
        <div className="flex mb-5">
    <button onClick={togglePickupDetails} className="mr-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
      {showPickupDetails ? 'Close' : 'Show Pickup Details'}
    </button>
    <button onClick={toggleDropoffDetails} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
      {showDropoffDetails ? 'Close' : 'Show Dropoff Details'}
    </button>
  </div>
  {showPickupDetails && (
  <div>
    {bookingDetails.kilometer && (
      <div className="my-4">
        <strong>Pickup Kilometer:</strong> {bookingDetails.kilometer}
      </div>
    )}
 {bookingDetails.photo && (
  <div className="my-4 flex ">
    <strong>Pickup Km Photo:</strong>
    <img 
      src={bookingDetails.photo} 
      alt="Dropoff Km Photo" 
      className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5"
    />
  </div>
)}


    <h3 className="text-xl font-bold mt-5">RC Book Images</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {bookingDetails.rcBookImageURLs.length > 0 ? (
        bookingDetails.rcBookImageURLs.map((url, index) => (
          <div key={index} className="max-w-xs">
            <img src={url} alt={`RC Book Image ${index}`} className="w-full h-auto" />
          </div>
        ))
      ) : (
        <p className="col-span-3">No RC Book Images available.</p>
      )}
    </div>

    <h2 className="text-xl font-bold mt-5">Vehicle Images</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {bookingDetails.vehicleImageURLs.length > 0 ? (
        bookingDetails.vehicleImageURLs.map((url, index) => (
          <div key={index} className="max-w-xs">
            <img src={url} alt={`Vehicle Image ${index}`} className="w-full h-auto" />
          </div>
        ))
      ) : (
        <p className="col-span-full">No Vehicle Images available.</p>
      )}
    </div>
  </div>
)}

{showDropoffDetails && (
  <div>
    {bookingDetails.kilometerdrop && (
      <div className="my-4">
        <strong>Dropoff Kilometer:</strong> {bookingDetails.kilometerdrop}
      </div>
    )}
   {bookingDetails.photodrop && (
  <div className="my-4 flex ">
    <strong>Dropoff Km Photo:</strong>
    <img 
      src={bookingDetails.photodrop} 
      alt="Dropoff Km Photo" 
      className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5"
    />
  </div>
)}
 <h3 className="text-xl font-bold mt-5">RC Book Images</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {bookingDetails.fuelBillImageURLs.length > 0 ? (
        bookingDetails.fuelBillImageURLs.map((url, index) => (
          <div key={index} className="max-w-xs">
            <img src={url} alt={`RC Book Image ${index}`} className="w-full h-auto" />
          </div>
        ))
      ) : (
        <p className="col-span-3">No RC Book Images available.</p>
      )}
    </div>

    <h2 className="text-xl font-bold mt-5">Vehicle Images</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {bookingDetails.vehicleImgURLs.length > 0 ? (
        bookingDetails.vehicleImgURLs.map((url, index) => (
          <div key={index} className="max-w-xs">
            <img src={url} alt={`Vehicle Image ${index}`} className="w-full h-auto" />
          </div>
        ))
      ) : (
        <p className="col-span-full">No Vehicle Images available.</p>
      )}
    </div>
 
  </div>
)}

      <table style={tableStyle}>
        <tbody>
        
          <tr>
            <td style={thStyle}>Total Salary :</td>
            <td style={tdStyle}>{bookingDetails.totalSalary} </td>
          </tr>
          <tr>
            <td style={thStyle}>Company :</td>
            <td style={tdStyle}>{bookingDetails.company}</td>
          </tr>
          <tr>
            <td style={thStyle}>File Number :</td>
            <td style={tdStyle}>{bookingDetails.fileNumber}</td>
          </tr>
         

          <tr>
            <td style={thStyle}>CustomerName :</td>
            <td style={tdStyle}>{bookingDetails.customerName}</td>
          </tr>
          <tr>
            <td style={thStyle}>Driver :</td>
            <td style={tdStyle}>{bookingDetails.driver}</td>
          </tr>
          <tr>
            <td style={thStyle}>VehicleNumber :</td>
            <td style={tdStyle}>{bookingDetails.vehicleNumber}</td>
          </tr>
          <tr>
            <td style={thStyle}>VehicleModel :</td>
            <td style={tdStyle}>{bookingDetails.vehicleModel}</td>
          </tr>  
          <tr>
            <td style={thStyle}>phoneNumber :</td>
            <td style={tdStyle}>{bookingDetails.phoneNumber}</td>
          </tr>
          <tr>
            <td style={thStyle}>MobileNumber :</td>
            <td style={tdStyle}>{bookingDetails.mobileNumber}</td>
          </tr>
          <tr>
  <td style={thStyle}>Pickup Location:</td>
  <td style={tdStyle}>
    {bookingDetails.pickupLocation ? (
      `${bookingDetails.pickupLocation.name}, Lat: ${bookingDetails.pickupLocation.lat}, Lng: ${bookingDetails.pickupLocation.lng}`
    ) : (
      'Location not selected'
    )}
  </td>
</tr>
<tr>
  <td style={thStyle}>DropOff Location:</td>
  <td style={tdStyle}>
    {bookingDetails.dropoffLocation ? (
      `${bookingDetails.dropoffLocation.name}, Lat: ${bookingDetails.dropoffLocation.lat}, Lng: ${bookingDetails.dropoffLocation.lng}`
    ) : (
      'Location not selected'
    )}
  </td>
</tr>



          <tr>
            <td style={thStyle}>Distance :</td>
            <td style={tdStyle}>{bookingDetails.distance}</td>
          </tr>
          <tr>
            <td style={thStyle}>ServiceType  :</td>
            <td style={tdStyle}>{bookingDetails.serviceType}</td>
          </tr>
          <tr>
            <td style={thStyle}>ServiceVehicle :</td>
            <td style={tdStyle}>{bookingDetails.serviceVehicle}</td>
          </tr>  
          <tr>
            <td style={thStyle}>Comments :</td>
            <td style={tdStyle}>{bookingDetails.comments}</td>
          </tr>  
                </tbody>
      </table>
    </div>
  );
};

export default ViewMore;

// import React, { useEffect, useState } from 'react';
// import { useLocation, useParams } from 'react-router-dom';
// import { getFirestore, doc, getDoc } from 'firebase/firestore';

// const ViewMore = () => {
//   const { id } = useParams();
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const kilometer = queryParams.get('kilometer');
//   const photo = queryParams.get('photo');
//   const [bookingDetails, setBookingDetails] = useState(null);
//   const db = getFirestore();
// console.log("bookid",id)
// console.log("ID:", id, "Kilometer:", kilometer, "Photo URL:", photo);

// useEffect(() => {
//   const fetchBookingDetails = async () => {
//     console.log("Fetching data for ID:", id);  // Ensure ID is correct
//     const docRef = doc(db, 'bookings', id);
//     const docSnap = await getDoc(docRef);
  
//     if (docSnap.exists()) {
//       console.log("Document data:", docSnap.data());  // What does the actual data look like?
//       setBookingDetails(docSnap.data());
//     } else {
//       console.log(`No document found for ID ${id}`);
//     }
//   };

//   fetchBookingDetails();
// }, [db, id]);



//   if (!bookingDetails) {
//     return <div>Loading...</div>;
//   }

//   const containerStyle = {
//     margin: '2rem',
//     padding: '1rem',
//     boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
//     borderRadius: '10px',
//   };

 

//   const tableStyle = {
//     width: '100%',
//     borderCollapse: 'collapse',
//   };

//   const thStyle = {
//     backgroundColor: '#f2f2f2',
//     padding: '8px',
//     textAlign: 'left',
//     fontWeight: 'bold',
//   };

//   const tdStyle = {
//     padding: '8px',
//     borderBottom: '1px solid #ddd',
//   };

//   return (
//     <div style={containerStyle}>
//  <h5 className="font-semibold text-lg dark:text-white-light mb-5">
//           Booking Details {' '}
       
//         </h5>
//         <div>
     
//     </div>
//       <table style={tableStyle}>
//         <tbody>
//           {/* <tr>
//             <th style={thStyle}>Field</th>
//             <th style={thStyle}>Value</th>
//           </tr> */}
//           <tr>
//             <td style={thStyle}>Total Salary :</td>
//             <td style={tdStyle}>{bookingDetails.totalSalary} </td>
//           </tr>
//           <tr>
//             <td style={thStyle}>Company :</td>
//             <td style={tdStyle}>{bookingDetails.company}</td>
//           </tr>
//           <tr>
//             <td style={thStyle}>File Number :</td>
//             <td style={tdStyle}>{bookingDetails.fileNumber}</td>
//           </tr>
//           <tr>
//             <td style={thStyle}>Kilometer :</td>
//             <td style={tdStyle}>{bookingDetails.kilometer}</td>
//           </tr>
//           <tr>
//             <td style={{ backgroundColor: '#f2f2f2', padding: '8px', textAlign: 'left', fontWeight: 'bold' }}>Photo :</td>
//             <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
//               {bookingDetails.photo ? <img src={bookingDetails.photo} alt="Booking Detail" style={{ width: '100px' }} /> : 'No photo uploaded'}
//             </td>
//           </tr>
//           <tr>
//             <td style={thStyle}>CustomerName :</td>
//             <td style={tdStyle}>{bookingDetails.customerName}</td>
//           </tr>
//           <tr>
//             <td style={thStyle}>Driver :</td>
//             <td style={tdStyle}>{bookingDetails.driver}</td>
//           </tr>
//           <tr>
//             <td style={thStyle}>VehicleNumber :</td>
//             <td style={tdStyle}>{bookingDetails.vehicleNumber}</td>
//           </tr>
//           <tr>
//             <td style={thStyle}>VehicleModel :</td>
//             <td style={tdStyle}>{bookingDetails.vehicleModel}</td>
//           </tr>  
//           <tr>
//             <td style={thStyle}>phoneNumber :</td>
//             <td style={tdStyle}>{bookingDetails.phoneNumber}</td>
//           </tr>
//           <tr>
//             <td style={thStyle}>MobileNumber :</td>
//             <td style={tdStyle}>{bookingDetails.mobileNumber}</td>
//           </tr>
//           <tr>
//   <td style={thStyle}>Pickup Location:</td>
//   <td style={tdStyle}>
//     {bookingDetails.pickupLocation ? (
//       `${bookingDetails.pickupLocation.name}, Lat: ${bookingDetails.pickupLocation.lat}, Lng: ${bookingDetails.pickupLocation.lng}`
//     ) : (
//       'Location not selected'
//     )}
//   </td>
// </tr>
// <tr>
//   <td style={thStyle}>DropOff Location:</td>
//   <td style={tdStyle}>
//     {bookingDetails.dropoffLocation ? (
//       `${bookingDetails.dropoffLocation.name}, Lat: ${bookingDetails.dropoffLocation.lat}, Lng: ${bookingDetails.dropoffLocation.lng}`
//     ) : (
//       'Location not selected'
//     )}
//   </td>
// </tr>



//           <tr>
//             <td style={thStyle}>Distance :</td>
//             <td style={tdStyle}>{bookingDetails.distance}</td>
//           </tr>
//           <tr>
//             <td style={thStyle}>ServiceType  :</td>
//             <td style={tdStyle}>{bookingDetails.serviceType}</td>
//           </tr>
//           <tr>
//             <td style={thStyle}>ServiceVehicle :</td>
//             <td style={tdStyle}>{bookingDetails.serviceVehicle}</td>
//           </tr>  
//           <tr>
//             <td style={thStyle}>Comments :</td>
//             <td style={tdStyle}>{bookingDetails.comments}</td>
//           </tr>  
//                 </tbody>
//       </table>
//     </div>
//   );
// };

// export default ViewMore;

