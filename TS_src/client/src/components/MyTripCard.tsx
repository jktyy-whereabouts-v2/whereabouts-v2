import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
// import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import axios from 'axios';
import UserMapContainer from './UserMapContainer';
import { Box, styled, Typography, Stack, CssBaseline, InputBase } from '@mui/material';
import { User } from './types';
import { Container } from '@mui/system';
import Sidebar from './Sidebar';
import Divider from '@mui/material/Divider';
import toast from 'react-hot-toast';

// When rendering this component, use => <MyTripCard userInfo={userInfo} setUserInfo={setUserInfo} userTrip={userTrip} setUserTrip={setUserTrip} />

// Card media is not needed since it was a component for the stock image that came with MUI
const googleURL = process.env.GOOGLEMAPSAPIKEY;


interface MyTripCard {
	userInfo: User;
	setUserInfo: React.Dispatch<React.SetStateAction<User>>;
	userTrip: any;
	setUserTrip: React.Dispatch<React.SetStateAction<any>>;
	logout: Function;
}

const MyTripCard = ({ userInfo, setUserInfo, userTrip, setUserTrip, logout }: MyTripCard) => {
	const trip = {
		start_lat: '',
		start_lng: '',
		tripsId: '',
	};

	const [sosLocation, setsosLocation] = useState({
		accuracy: '',
		location: {
			lat: '',
			lng: '',
		},
	});

	const handleClick = async (name: any) => {
		try {
			const response = await axios.post(`https://www.googleapis.com/geolocation/v1/geolocate?key=${googleURL}`);
			// const { lat, lng } = response.data.location;
			// update state with sos position, if sos was clicked
			const { lat, lng } = response.data.location;

			if (name !== 'end-trip') {
				setsosLocation(response.data);
			}

			const body = name === 'end-trip' ? { tripId: userTrip.trips_id } : { tripId: userTrip.trips_id, lat: lat, lng: lng };
			const url = name === 'end-trip' ? '/api/trips/reached' : '/api/trips/sos';

			if (body && url) {
				try {
					const response = await axios.post(url, body);
					console.log(response.data);
					console.log('confirmed End Trip or SOS');
				} catch (error) {
					toast.error('End Trip or SOS not working');
				}
			}
		} catch (error) {
			toast.error('SOS not alerted.');
		}
	};

	useEffect(() => {
		setUserTrip({
			...userTrip,
			sos_lat: sosLocation.location.lat,
			sos_lng: sosLocation.location.lng,
		});
	}, [sosLocation]);

	const [location, setLocation] = useState(false);

	useEffect(() => {
		if (userInfo.name) {
			const getMyLocation = async () => {
				try {
					const response = await axios.get(`/api/trips/my/${userInfo.phone_number}`);
					console.log(response.data);
					if (response.data) {
						setUserTrip(response.data);
					}
					setLocation(true);
				} catch (error) {
					toast.error('Server did not retrieve data appropriately');
				}
			};
			getMyLocation();
		}
	}, [userInfo]);

	useEffect(() => {
		if (userTrip[0]) {
			setUserTrip({
				...userTrip[0],
				start_lat: Number(userTrip[0].start_lat),
				start_lng: Number(userTrip[0].start_lng),
			});
		}
	}, [location]);

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
					<Card sx={{ maxWidth: 700 }}>
						{/* lat={userTrip.start_lat} lng={userTrip.start_lng} */}
						<div className="map-container">
							<UserMapContainer userTrip={userTrip} />
						</div>
						{/* <CardMedia
          sx={{ height: 150 }}
          src='src only accepts a string'
          title="interactive-map"
        /> */}
						<CardContent>
							<Typography gutterBottom variant="h5" component="div">
								Your Current Trip
							</Typography>
							<Typography variant="body2" color="text.secondary">
								Secondary text here
							</Typography>
						</CardContent>
						<CardActions>
							<Button
								size="large"
								variant="contained"
								color="primary"
								name="end-trip"
								onClick={(e: any) => {
									handleClick(e.target.name);
								}}>
								End this Trip
							</Button>
							<Button
								size="large"
								variant="contained"
								color="error"
								name="sos"
								onClick={(e: any) => {
									handleClick(e.target.name);
								}}>
								ALERT CONTACTS FOR HELP
							</Button>
						</CardActions>
					</Card>
				</Container>
			</Box>
		</>
	);
};

export default MyTripCard;
