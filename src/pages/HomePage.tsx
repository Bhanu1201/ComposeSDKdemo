import { useState, useEffect, useRef } from 'react';
import { Container, Navbar, Nav, FormControl, InputGroup } from 'react-bootstrap';
import { Box, List, ListItem, ListItemText, IconButton, ListItemIcon } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LanguageIcon from '@mui/icons-material/Language';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import TableChartIcon from '@mui/icons-material/TableChart';
import PersonIcon from '@mui/icons-material/Person';
import LoginIcon from '@mui/icons-material/Login';
import TranslateIcon from '@mui/icons-material/Translate';
import TargetBarChart from '../components/TargetBarChart';
import DonutChart from '../components/3dcharts/DonutChart';
import * as Appdata from '../sample-test';
import { useExecuteQuery } from '@sisense/sdk-ui';
import Select from 'react-select';
import DepartureBoardIcon from '@mui/icons-material/DepartureBoard';
import MapWithPieCharts from '../components/MapWithPieCharts';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import FlightRoute from '../components/Flightroute';
import WorldSalesByGender from '../components/WorldSalesByGender';
import { filterFactory, measureFactory } from '@sisense/sdk-data';
import CountryList from '../components/tables/CollapsiveTable';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PublicIcon from '@mui/icons-material/Public';
import image from '../assets/image (5).png';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';


interface LocationOption {
    value: string; // Change to the appropriate type based on your data
    label: string; // Change to the appropriate type based on your data
}



const HomePage = () => {



    const [uniquePickupLocations, setUniquePickupLocations] = useState<LocationOption[]>([]);
    const [selectedLocations, setSelectedLocations] = useState<LocationOption[]>([]);
    const [showProfile, setShowProfile] = useState(false);
    const profileRef = useRef<HTMLDivElement | null>(null);



    // Fetch Pickup Locations
    const { data: pickupData } = useExecuteQuery({
        dataSource: Appdata.DataSource,
        dimensions: [
            Appdata.Dim_Pickup_Locations.Pickup_Lat,
            Appdata.Dim_Pickup_Locations.Pickup_Lon,
            Appdata.Dim_Drop_Locations.Drop_Lat,
            Appdata.Dim_Drop_Locations.Drop_Lon,
            Appdata.Dim_Pickup_Locations.Pickup_Location,
            Appdata.Dim_Drop_Locations.Drop_Location
        ],
        measures: [

        ]
    });


    const { data } = useExecuteQuery({
        dataSource: Appdata.DataSource,
        dimensions: [],
        measures: [
            measureFactory.measuredValue(measureFactory.count(Appdata.Fact_Logistics.ROWID), [filterFactory.contains(Appdata.Fact_Logistics.ShipmentType, 'Parcel')]),
            measureFactory.measuredValue(measureFactory.count(Appdata.Fact_Logistics.ROWID), [filterFactory.contains(Appdata.Fact_Logistics.ShipmentType, 'Express')]),
            measureFactory.measuredValue(measureFactory.count(Appdata.Fact_Logistics.ROWID), [filterFactory.contains(Appdata.Fact_Logistics.ShipmentType, 'Freight')]),
            measureFactory.measuredValue(measureFactory.count(Appdata.Fact_Logistics.ROWID), [filterFactory.contains(Appdata.Fact_Logistics.Status, 'Cancelled')]),
            measureFactory.measuredValue(measureFactory.count(Appdata.Fact_Logistics.ROWID), [filterFactory.contains(Appdata.Fact_Logistics.Status, 'Shipped')]),
            measureFactory.measuredValue(measureFactory.count(Appdata.Fact_Logistics.ROWID), [filterFactory.contains(Appdata.Fact_Logistics.Status, 'Pending')]),
            measureFactory.measuredValue(measureFactory.count(Appdata.Fact_Logistics.ROWID), [filterFactory.contains(Appdata.Fact_Logistics.Status, 'Delivered')]),

        ]
    });


    // Extract values for leaderboard components
    const totalShipments = data?.rows?.[0]?.[0]?.data || 0;
    const expressShipments = data?.rows?.[0]?.[1]?.data || 0;
    const freightShipments = data?.rows?.[0]?.[2]?.data || 0;
    const Cancelled = data?.rows?.[0]?.[3]?.data || 0;
    const Shipped = data?.rows?.[0]?.[4]?.data || 0;
    const Pending = data?.rows?.[0]?.[5]?.data || 0;
    const Delivered = data?.rows?.[0]?.[6]?.data || 0;


    useEffect(() => {
        if (pickupData && pickupData.rows) {
            // Extract unique pickup locations from the data
            const locations = [...new Set(pickupData.rows.map(row => row[4]?.data))];
            setUniquePickupLocations(locations.map(location => ({ value: location, label: location })));
        }
    }, [pickupData]);


    const handleLocationChange = (selectedOptions: any) => {
        setSelectedLocations(selectedOptions || []);
    };



    const handleProfileClick = () => {
        setShowProfile(prevState => !prevState);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setShowProfile(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div style={{ display: 'flex' }}>


            {/* Side Panel */}
            <Box
                sx={{
                    width: 250,
                    height: '100vh',
                    backgroundColor: '#1A4870',
                    padding: '15px',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
                    borderRadius: '15px',
                }}
            >
                <h4 style={{ color: '#fff', fontWeight: 'bold' }} className='d-flex justify-content-center' >Sisense Demo</h4>
                <List className='text-white' >
                    <ListItem button sx={{ '&:hover': { color: '#5B99C2', backgroundColor: '#03346E', borderRadius: '15px' } }}>
                        <ListItemIcon sx={{ color: '#fff', '&:hover': { color: '#6EACDA' } }}>
                            <DashboardIcon />
                        </ListItemIcon>
                        <ListItemText primary="Compose SDK Dashboard" />
                    </ListItem>

                    <ListItem button sx={{ '&:hover': { color: '#5B99C2', backgroundColor: '#03346E', borderRadius: '15px' } }}>
                        <ListItemIcon sx={{ color: '#fff', '&:hover': { color: '#5B99C2' } }}>
                            <PublicIcon />
                        </ListItemIcon>
                        <ListItemText primary="3D World Map" />
                    </ListItem>
                    <ListItem href='/table' button sx={{ '&:hover': { color: '#5B99C2', backgroundColor: '#03346E', borderRadius: '15px' } }}>
                        <a className='d-flex text-white text-decoration-none' href='/table' >
                            <ListItemIcon sx={{ color: '#fff', '&:hover': { color: '#5B99C2' } }}>
                                <TableChartIcon />
                            </ListItemIcon>
                            <ListItemText primary="Data Tables" />
                        </a>
                    </ListItem>
                    <ListItem button sx={{ '&:hover': { color: '#5B99C2', backgroundColor: '#03346E', borderRadius: '15px' } }}>
                        <ListItemIcon sx={{ color: '#fff', '&:hover': { color: '#5B99C2' } }}>
                            <PersonIcon />
                        </ListItemIcon>
                        <ListItemText primary="Profile" />
                    </ListItem>
                    <ListItem button sx={{ '&:hover': { color: '#5B99C2', backgroundColor: '#03346E', borderRadius: '15px' } }}>
                        <a className='d-flex text-white text-decoration-none' href='/signin' >
                            <ListItemIcon sx={{ color: '#fff', '&:hover': { color: '#5B99C2' } }}>
                                <LoginIcon />
                            </ListItemIcon>
                            <ListItemText primary="Sign In" />
                        </a>
                    </ListItem>
                    <ListItem button sx={{ '&:hover': { color: '#5B99C2', backgroundColor: '#03346E', borderRadius: '15px' } }}>
                        <ListItemIcon sx={{ color: '#fff', '&:hover': { color: '#5B99C2' } }}>
                            <TranslateIcon />
                        </ListItemIcon>
                        <ListItemText primary="RTL Admin" />
                    </ListItem>
                </List>
            </Box>

            {/* Main Content */}
            <div style={{ marginLeft: 270, width: 'calc(100% - 270px)' }}>
                {/* Sticky Navbar */}
                <Navbar expand="lg" sticky="top" style={{ padding: '10px 20px', display: 'flex', justifyContent: 'space-between' }}>
                    {/* Navbar Brand (Main Dashboard) */}
                    <Navbar.Brand href="#home" style={{ color: '#70a5d4', fontWeight: 'bold' }}>
                        Main Dashboard
                    </Navbar.Brand>

                    {/* Right-aligned content: Search bar and icons */}
                    <div className='d-flex align-items-center'>
                        <InputGroup className="" style={{ maxWidth: '300px' }}>
                            <InputGroup.Text
                                id="basic-addon1"
                                style={{ borderRadius: '20px 0px 0px 20px', border: 'none', backgroundColor: '#B5C0D0' }}
                            >
                                <SearchIcon />
                            </InputGroup.Text>
                            <FormControl
                                placeholder="Search..."
                                aria-label="Search"
                                aria-describedby="basic-addon1"
                                style={{ borderRadius: '0 20px 20px 0', border: 'none', backgroundColor: '#B5C0D0' }}
                            />
                        </InputGroup>
                        <Nav className="ml-auto d-flex align-items-center">
                            <IconButton>
                                <LanguageIcon style={{ color: '#70a5d4' }} />
                            </IconButton>
                            <IconButton>
                                <NotificationsNoneIcon style={{ color: '#70a5d4' }} />
                            </IconButton>
                            <IconButton onClick={handleProfileClick}>
                                <AccountCircleIcon style={{ color: '#70a5d4' }} />
                            </IconButton>
                        </Nav>
                    </div>

                    {/* Profile window */}
                    {showProfile && (
                        <div
                            ref={profileRef}
                            style={{
                                position: 'absolute',
                                right: '20px',
                                top: '70px',
                                width: '300px',
                                backgroundColor: 'white',
                                borderRadius: '8px',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                padding: '10px',
                                zIndex: 1000
                            }}>
                            <div style={{ textAlign: 'center', padding: '10px' }}>
                                <img src={image} alt="Profile" style={{ width: '50%', height: '50%', borderRadius: '50%' }} className='' />
                                <div style={{ marginTop: '10px', fontWeight: 'bold' }}>John Doe</div>
                                <div style={{ color: 'gray' }}>john.doe@example.com</div>
                            </div>
                            <hr />
                            <button
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: 'none',
                                    backgroundColor: 'red',
                                    color: 'white',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                                onClick={() => alert('Logout')}
                            >
                                <i className="fas fa-sign-out-alt"></i> Logout
                            </button>
                        </div>
                    )}
                </Navbar>

                {/* Multi-Select Dropdowns */}
                <div>
                    <Container fluid style={{ padding: '20px', backgroundColor: '#D1E9F6' }} className='d-flex flex-wrap rounded-4'>
                        <div className='mb-3 col-3 ps-2 pe-2'>
                            <Select
                                isMulti
                                options={uniquePickupLocations}
                                onChange={handleLocationChange}
                                placeholder="Select Pickup Locations"
                                value={selectedLocations}
                            />
                        </div>
                        <div className='mb-3 col-3 ps-2 pe-2'>
                            <Select

                            />
                        </div>
                        <div className='col-12 d-flex flex-wrap'>

                            <div className='col-12 d-flex flex-wrap'>


                                <div className="col-lg-3 col-md-6 col-12 p-lg-2 p-md-3 p-sm-3 p-3" style={{ height: 130 }}>
                                    <div className="bg-white shadow rounded-4 p-3 d-flex flex-column h-100">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="icon-container bg-primary-box insighticons" style={{ marginTop: -85 }}>
                                                <LocalShippingIcon className="insighticons text-primary" />
                                            </div>
                                            <div>
                                                <p className="fs-6 fw-light text-end mb-0">Total Number of Parcel</p>

                                                <p className="fw-semibold fs-4 text-end text-primary"> {totalShipments} </p>

                                            </div>
                                        </div>

                                    </div>
                                </div>

                                <div className="col-lg-3 col-md-6 col-12 p-lg-2 p-md-3 p-sm-3 p-3" style={{ height: 130 }}>
                                    <div className="bg-white shadow rounded-4 p-3 d-flex flex-column h-100">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="icon-container bg-primary-box insighticons" style={{ marginTop: -85 }}>
                                                <LocalShippingIcon className="insighticons text-primary" />
                                            </div>
                                            <div>
                                                <p className="fs-6 fw-light text-end mb-0">Total Number of Express</p>

                                                <p className="fw-semibold fs-4 text-end text-primary"> {expressShipments} </p>

                                            </div>
                                        </div>

                                    </div>
                                </div>

                                <div className="col-lg-3 col-md-6 col-12 p-lg-2 p-md-3 p-sm-3 p-3" style={{ height: 130 }}>
                                    <div className="bg-white shadow rounded-4 p-3 d-flex flex-column h-100">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="icon-container bg-primary-box insighticons" style={{ marginTop: -85 }}>
                                                <LocalShippingIcon className="insighticons text-primary" />
                                            </div>
                                            <div>
                                                <p className="fs-6 fw-light text-end mb-0">Total Number of Freight</p>

                                                <p className="fw-semibold fs-4 text-end text-primary"> {freightShipments} </p>

                                            </div>
                                        </div>

                                    </div>
                                </div>

                                <div className="col-lg-3 col-md-6 col-12 p-lg-2 p-md-3 p-sm-3 p-3" style={{ height: 130 }}>
                                    <div className="bg-white shadow rounded-4 p-3 d-flex flex-column h-100">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="icon-container bg-primary-box insighticons" style={{ marginTop: -85 }}>
                                                <HighlightOffIcon className="insighticons text-danger" />
                                            </div>
                                            <div>
                                                <p className="fs-6 fw-light text-end mb-0">Total Number of Cancelled</p>

                                                <p className="fw-semibold fs-4 text-end text-danger"> {Cancelled} </p>

                                            </div>
                                        </div>

                                    </div>
                                </div>

                                <div className="col-lg-3 col-md-6 col-12 p-lg-2 p-md-3 p-sm-3 p-3" style={{ height: 130 }}>
                                    <div className="bg-white shadow rounded-4 p-3 d-flex flex-column h-100">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="icon-container bg-primary-box insighticons" style={{ marginTop: -85 }}>
                                                <DepartureBoardIcon className="insighticons text-danger" />
                                            </div>
                                            <div>
                                                <p className="fs-6 fw-light text-end mb-0">Total Number of Pending Orders</p>

                                                <p className="fw-semibold fs-4 text-end text-danger"> {Pending} </p>

                                            </div>
                                        </div>

                                    </div>
                                </div>

                                <div className="col-lg-3 col-md-6 col-12 p-lg-2 p-md-3 p-sm-3 p-3" style={{ height: 130 }}>
                                    <div className="bg-white shadow rounded-4 p-3 d-flex flex-column h-100">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="icon-container bg-primary-box insighticons" style={{ marginTop: -85 }}>
                                                <RocketLaunchIcon className="insighticons text-success" />
                                            </div>
                                            <div>
                                                <p className="fs-6 fw-light text-end mb-0 ">Total Number of Orders Shipped</p>

                                                <p className="fw-semibold fs-4 text-end text-success"> {Shipped} </p>

                                            </div>
                                        </div>

                                    </div>
                                </div>

                                <div className="col-lg-3 col-md-6 col-12 p-lg-2 p-md-3 p-sm-3 p-3" style={{ height: 130 }}>
                                    <div className="bg-white shadow rounded-4 p-3 d-flex flex-column h-100">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="icon-container bg-primary-box insighticons" style={{ marginTop: -85 }}>
                                                <DoneAllIcon className="insighticons text-success" />
                                            </div>
                                            <div>
                                                <p className="fs-6 fw-light text-end mb-0">Total Number of Delivered Orders</p>

                                                <p className="fw-semibold fs-4 text-end text-success"> {Delivered} </p>

                                            </div>
                                        </div>

                                    </div>
                                </div>

                            </div>

                            {/* <div className='col-12 p-2'>
<Parabolachart selectedLocations={selectedLocations} />
</div> */}

                            <div className='col-lg-4 col-md-6 col-sm-12 col-12 p-2'>
                                <TargetBarChart />
                            </div>

                            <div className='col-lg-4 col-md-6 col-sm-12 col-12 p-2'>
                                <MapWithPieCharts />
                            </div>

                            <div className='col-lg-4 col-md-6 col-sm-12 col-12 p-2'>
                                <DonutChart />
                            </div>

                            <div className='col-lg-6 col-md-6 col-sm-12 col-12 p-2'>
                                <WorldSalesByGender />
                            </div>

                            <div className='col-6 col-md-6 col-sm-12 col-12 p-2 overflow-y-scroll mt-2' style={{ height: '400px' }}>
                                <CountryList />
                            </div>

                            <div className='col-12 p-2'>
                                <FlightRoute selectedLocations={selectedLocations} />
                            </div>


                        </div>
                    </Container>
                </div>
            </div>
        </div >
    );
};

export default HomePage;