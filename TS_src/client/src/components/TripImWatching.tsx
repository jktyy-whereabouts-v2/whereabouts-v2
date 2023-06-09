import React, { useState, useEffect } from 'react';
// import ProgressBar from "./ProgressBar";
import TripViewingCard from './TripViewingCard';
import { Box, styled, Typography, Stack, CssBaseline, InputBase, Tab, Badge } from '@mui/material';
import { Container } from '@mui/system';
import Sidebar from './Sidebar';
import Divider from '@mui/material/Divider';
import { User } from './types';
import Card from '@mui/material/Card';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

interface Trips {
	end_timestamp: string | null;
	sos_lat: string | null;
	sos_lng: string | null;
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

	const sosResult = trips.filter((trip) => trip.sos_lat !== null && trip.end_timestamp === null);
	const ongoingResult = trips.filter((trip) => trip.end_timestamp === null && trip.sos_lat === null);
	const finishedResult = trips.filter((trip) => trip.end_timestamp !== null);

	const StyledBadge = styled(Badge)(({ theme }) => ({
		'& .MuiBadge-badge': {
			right: -12,
			top: 9,
			border: `2px solid ${theme.palette.background.paper}`,
			padding: '0 4px',
		},
	}));

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
								<Tab
									sx={{ pr: 4 }}
									label={
										<StyledBadge badgeContent={sosResult.length} color="error">
											SOS
										</StyledBadge>
									}
									value="1"
								/>
								<Tab
									sx={{ pr: 4 }}
									label={
										<StyledBadge badgeContent={ongoingResult.length} color="primary">
											Ongoing
										</StyledBadge>
									}
									value="2"
								/>
								<Tab
									sx={{ pr: 4 }}
									label={
										<StyledBadge badgeContent={finishedResult.length} color="success">
											Finished
										</StyledBadge>
									}
									value="3"
								/>
							</TabList>
						</Box>
						<TabPanel value="1">
							<Card sx={{ maxWidth: 700 }}>
								{sosResult.map((filteredTrip) => (
									<TripViewingCard trip={filteredTrip} />
								))}
							</Card>
						</TabPanel>
						<TabPanel value="2">
							<Card sx={{ maxWidth: 700 }}>
								{ongoingResult.map((filteredTrip) => (
									<TripViewingCard key={ongoingResult.length} trip={filteredTrip} />
								))}
							</Card>
						</TabPanel>
						<TabPanel value="3">
							<Card sx={{ maxWidth: 700 }}>
								{finishedResult.map((filteredTrip) => (
									<TripViewingCard trip={filteredTrip} />
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
