import React, { useState, useEffect } from 'react';
// import ProgressBar from "./ProgressBar";
import TripViewingCard from './TripViewingCard';
import { Box, styled, Typography, Stack, CssBaseline, InputBase, Tab } from '@mui/material';
import { Container } from '@mui/system';
import Sidebar from './Sidebar';
import Divider from '@mui/material/Divider';
import { User } from './types';
import Card from '@mui/material/Card';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

interface Trips {
	trips_id: string;
	start_lat: number;
	start_lng: number;
}

const TripImWatching: React.FC<{ userInfo: User; logout: Function }> = ({ userInfo, logout }) => {
	const [value, setValue] = React.useState('1');

	const handleChange = (event: any, newValue: any) => {
		setValue(newValue);
	};

	//SSE - render trips
	const [trips, setTrips] = useState<Trips[]>([]);

	useEffect(() => {
		const source = new EventSource(`http://localhost:3500/stream/${userInfo.phone_number}`, {
			//replace 123456789 with current user's phone_number
			withCredentials: false,
		}); //maybe need to add to webpack?
		console.log(source);

		source.addEventListener('open', () => {
			console.log('SSE opened!');
		});

		source.addEventListener('message', (e) => {
			const data = JSON.parse(e.data);
			setTrips(data);
		});

		source.addEventListener('error', (e) => {
			console.log('hitting error');
			console.error('Error: ', e);
		});

		return () => {
			source.close();
		};
	}, []);
	console.log(trips);

	return (
		<>
			<Divider sx={{ width: '85%', margin: 'auto' }} variant="middle"></Divider>
			<CssBaseline />
			<Box sx={{ display: 'flex', mt: '30px' }}>
				<Container sx={{ width: '40%', ml: '30px' }}>
					<Sidebar logout={logout} />
				</Container>
				<Container
					sx={{
						display: 'flex',
						flexDirection: 'column',
						gap: '10px',
						paddingBottom: '10px',
						marginTop: '10px',
					}}>
					<Typography>Trips I'm Watching</Typography>
					<TabContext value={value}>
						<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
							<TabList onChange={handleChange} aria-label="lab API tabs example">
								<Tab label="SOS" value="1" />
								<Tab label="Ongoing" value="2" />
								<Tab label="Finished" value="3" />
							</TabList>
						</Box>
						<TabPanel value="1">
							<Card sx={{ maxWidth: 700 }}>
								{trips.map((trip) => (
									<div key={trip.trips_id} className="view-card">
										<br></br>
										<TripViewingCard trip={trip} />
									</div>
								))}
							</Card>
						</TabPanel>
						<TabPanel value="2">
							<Card sx={{ maxWidth: 700 }}>{trip[0].end_timestamp === null && trip[0].sos_lat === null ? <></> : <></>}</Card>
						</TabPanel>
						<TabPanel value="3">
							<Card sx={{ maxWidth: 700 }}>
								{trips.map((trip) => (
									<div key={trip.trips_id} className="view-card">
										<br></br>
										<TripViewingCard trip={trip} />
									</div>
								))}
							</Card>
						</TabPanel>
					</TabContext>
				</Container>
			</Box>
		</>
	);
};

export default TripImWatching;

// {
// 	<Card sx={{ maxWidth: 700 }}>
// 		{trips.map((trip) => (
// 			<div key={trip.trips_id} className="view-card">
// 				<br></br>
// 				<TripViewingCard trip={trip} />
// 			</div>
// 		))}
// 	</Card>;
// }

trip[0].end_timestamp === null && trip[0].sos_lat === null;
