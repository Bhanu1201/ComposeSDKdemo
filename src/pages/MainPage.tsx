// import React, { useEffect, useState } from 'react'
// import TargetBarChart from '../components/TargetBarChart'
// import MapWithPieCharts from '../components/MapWithPieCharts';
// import DonutChart from '../components/3dcharts/DonutChart';
// import WorldSalesByGender from '../components/WorldSalesByGender';
// import FlightRoute from '../components/Flightroute';
// import * as Appdata from '../sample-test';
// import { useExecuteQuery } from '@sisense/sdk-ui';
// import { filterFactory, measureFactory } from '@sisense/sdk-data';


// const { data: pickupData } = useExecuteQuery({
//     dataSource: Appdata.DataSource,
//     dimensions: [
//         Appdata.Dim_Pickup_Locations.Pickup_Lat,
//         Appdata.Dim_Pickup_Locations.Pickup_Lon,
//         Appdata.Dim_Drop_Locations.Drop_Lat,
//         Appdata.Dim_Drop_Locations.Drop_Lon,
//         Appdata.Dim_Pickup_Locations.Pickup_Location,
//         Appdata.Dim_Drop_Locations.Drop_Location
//     ],
//     measures: [

//     ]
// });


// const { data } = useExecuteQuery({
//     dataSource: Appdata.DataSource,
//     dimensions: [],
//     measures: [
//         measureFactory.measuredValue(measureFactory.count(Appdata.Fact_Logistics.ROWID), [filterFactory.contains(Appdata.Fact_Logistics.ShipmentType, 'Parcel')]),
//         measureFactory.measuredValue(measureFactory.count(Appdata.Fact_Logistics.ROWID), [filterFactory.contains(Appdata.Fact_Logistics.ShipmentType, 'Express')]),
//         measureFactory.measuredValue(measureFactory.count(Appdata.Fact_Logistics.ROWID), [filterFactory.contains(Appdata.Fact_Logistics.ShipmentType, 'Freight')]),
//         measureFactory.measuredValue(measureFactory.count(Appdata.Fact_Logistics.ROWID), [filterFactory.contains(Appdata.Fact_Logistics.Status, 'Cancelled')]),
//         measureFactory.measuredValue(measureFactory.count(Appdata.Fact_Logistics.ROWID), [filterFactory.contains(Appdata.Fact_Logistics.Status, 'Shipped')]),
//         measureFactory.measuredValue(measureFactory.count(Appdata.Fact_Logistics.ROWID), [filterFactory.contains(Appdata.Fact_Logistics.Status, 'Pending')]),
//         measureFactory.measuredValue(measureFactory.count(Appdata.Fact_Logistics.ROWID), [filterFactory.contains(Appdata.Fact_Logistics.Status, 'Delivered')]),

//     ]
// });



// const totalShipments = data?.rows?.[0]?.[0]?.data || 0;
// const expressShipments = data?.rows?.[0]?.[1]?.data || 0;
// const freightShipments = data?.rows?.[0]?.[2]?.data || 0;
// const Cancelled = data?.rows?.[0]?.[3]?.data || 0;
// const Shipped = data?.rows?.[0]?.[4]?.data || 0;
// const Pending = data?.rows?.[0]?.[5]?.data || 0;
// const Delivered = data?.rows?.[0]?.[6]?.data || 0;





// const [uniquePickupLocations, setUniquePickupLocations] = useState([]);
// const [selectedLocations, setSelectedLocations] = useState([]);


// useEffect(() => {
//     if (pickupData && pickupData.rows) {
//         // Extract unique pickup locations from the data
//         const locations = [...new Set(pickupData.rows.map(row => row[4]?.data))];
//         setUniquePickupLocations(locations.map(location => ({ value: location, label: location })));
//     }
// }, [pickupData]);


// const handleLocationChange = (selectedOptions) => {
//     setSelectedLocations(selectedOptions || []);
// };

// const MainPage = () => {





//     return (
//         <div>
//             <div className='mb-3 col-3 ps-2 pe-2'>
//                 <Select/>
//             </div>

//             <div className='col-12 d-flex flex-wrap'>

//                 <div className='col-12 d-flex flex-wrap'>


//                     <div className="col-lg-3 col-md-6 col-12 p-lg-2 p-md-3 p-sm-3 p-3" style={{ height: 130 }}>
//                         <div className="bg-white shadow rounded-4 p-3 d-flex flex-column h-100">
//                             <div className="d-flex justify-content-between align-items-center">
//                                 <div className="icon-container bg-primary-box insighticons" style={{ marginTop: -85 }}>
//                                     <LeaderboardIcon className="insighticons text-primary" />
//                                 </div>
//                                 <div>
//                                     <p className="fs-6 fw-light text-end mb-0">Total Number of Parcel</p>

//                                     <p className="fw-semibold fs-4 text-end text-primary"> {totalShipments} </p>

//                                 </div>
//                             </div>

//                         </div>
//                     </div>

//                     <div className="col-lg-3 col-md-6 col-12 p-lg-2 p-md-3 p-sm-3 p-3" style={{ height: 130 }}>
//                         <div className="bg-white shadow rounded-4 p-3 d-flex flex-column h-100">
//                             <div className="d-flex justify-content-between align-items-center">
//                                 <div className="icon-container bg-primary-box insighticons" style={{ marginTop: -85 }}>
//                                     <LeaderboardIcon className="insighticons text-primary" />
//                                 </div>
//                                 <div>
//                                     <p className="fs-6 fw-light text-end mb-0">Total Number of Express</p>

//                                     <p className="fw-semibold fs-4 text-end text-primary"> {expressShipments} </p>

//                                 </div>
//                             </div>

//                         </div>
//                     </div>

//                     <div className="col-lg-3 col-md-6 col-12 p-lg-2 p-md-3 p-sm-3 p-3" style={{ height: 130 }}>
//                         <div className="bg-white shadow rounded-4 p-3 d-flex flex-column h-100">
//                             <div className="d-flex justify-content-between align-items-center">
//                                 <div className="icon-container bg-primary-box insighticons" style={{ marginTop: -85 }}>
//                                     <LeaderboardIcon className="insighticons text-primary" />
//                                 </div>
//                                 <div>
//                                     <p className="fs-6 fw-light text-end mb-0">Total Number of Freight</p>

//                                     <p className="fw-semibold fs-4 text-end text-primary"> {freightShipments} </p>

//                                 </div>
//                             </div>

//                         </div>
//                     </div>

//                     <div className="col-lg-3 col-md-6 col-12 p-lg-2 p-md-3 p-sm-3 p-3" style={{ height: 130 }}>
//                         <div className="bg-white shadow rounded-4 p-3 d-flex flex-column h-100">
//                             <div className="d-flex justify-content-between align-items-center">
//                                 <div className="icon-container bg-primary-box insighticons" style={{ marginTop: -85 }}>
//                                     <LeaderboardIcon className="insighticons text-primary" />
//                                 </div>
//                                 <div>
//                                     <p className="fs-6 fw-light text-end mb-0">Total Number of Cancelled</p>

//                                     <p className="fw-semibold fs-4 text-end text-danger"> {Cancelled} </p>

//                                 </div>
//                             </div>

//                         </div>
//                     </div>

//                     <div className="col-lg-3 col-md-6 col-12 p-lg-2 p-md-3 p-sm-3 p-3" style={{ height: 130 }}>
//                         <div className="bg-white shadow rounded-4 p-3 d-flex flex-column h-100">
//                             <div className="d-flex justify-content-between align-items-center">
//                                 <div className="icon-container bg-primary-box insighticons" style={{ marginTop: -85 }}>
//                                     <LeaderboardIcon className="insighticons text-primary" />
//                                 </div>
//                                 <div>
//                                     <p className="fs-6 fw-light text-end mb-0">Total Number of Pending Orders</p>

//                                     <p className="fw-semibold fs-4 text-end text-danger"> {Pending} </p>

//                                 </div>
//                             </div>

//                         </div>
//                     </div>

//                     <div className="col-lg-3 col-md-6 col-12 p-lg-2 p-md-3 p-sm-3 p-3" style={{ height: 130 }}>
//                         <div className="bg-white shadow rounded-4 p-3 d-flex flex-column h-100">
//                             <div className="d-flex justify-content-between align-items-center">
//                                 <div className="icon-container bg-primary-box insighticons" style={{ marginTop: -85 }}>
//                                     <LeaderboardIcon className="insighticons text-primary" />
//                                 </div>
//                                 <div>
//                                     <p className="fs-6 fw-light text-end mb-0 ">Total Number of Orders Shipped</p>

//                                     <p className="fw-semibold fs-4 text-end text-success"> {Shipped} </p>

//                                 </div>
//                             </div>

//                         </div>
//                     </div>

//                     <div className="col-lg-3 col-md-6 col-12 p-lg-2 p-md-3 p-sm-3 p-3" style={{ height: 130 }}>
//                         <div className="bg-white shadow rounded-4 p-3 d-flex flex-column h-100">
//                             <div className="d-flex justify-content-between align-items-center">
//                                 <div className="icon-container bg-primary-box insighticons" style={{ marginTop: -85 }}>
//                                     <LeaderboardIcon className="insighticons text-primary" />
//                                 </div>
//                                 <div>
//                                     <p className="fs-6 fw-light text-end mb-0">Total Number of Delivered Orders</p>

//                                     <p className="fw-semibold fs-4 text-end text-success"> {Delivered} </p>

//                                 </div>
//                             </div>

//                         </div>
//                     </div>

//                 </div>

//                 {/* <div className='col-12 p-2'>
//                             <Parabolachart selectedLocations={selectedLocations} />
//                         </div> */}

//                 <div className='col-lg-4 col-md-6 col-sm-12 col-12 p-2'>
//                     <TargetBarChart />
//                 </div>

//                 <div className='col-lg-4 col-md-6 col-sm-12 col-12 p-2'>
//                     <MapWithPieCharts />
//                 </div>

//                 <div className='col-lg-4 col-md-6 col-sm-12 col-12 p-2'>
//                     <DonutChart />
//                 </div>

//                 <div className='col-lg-12 col-md-6 col-sm-12 col-12 p-2'>
//                     <WorldSalesByGender />
//                 </div>

//                 <div className='col-12 p-2'>
//                     <FlightRoute selectedLocations={selectedLocations} />
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default MainPage