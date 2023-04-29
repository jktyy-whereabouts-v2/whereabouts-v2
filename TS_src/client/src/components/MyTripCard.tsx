import { useState, useEffect, Dispatch, SetStateAction } from 'react';
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
	endTrip: boolean;
	setEndTrip: React.Dispatch<SetStateAction<any>>;
}

const MyTripCard = ({ userInfo, setUserInfo, userTrip, setUserTrip, logout, endTrip, setEndTrip }: MyTripCard) => {
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

	const handleClickSos = async (event: any) => {
		try {
			const response = await axios.post(`https://www.googleapis.com/geolocation/v1/geolocate?key=${googleURL}`);
			const { lat, lng } = response.data.location;
			if (response.data) {
				setsosLocation(response.data);
			}
			const url = '/api/trips/sos';
			const body = { tripId: userTrip[0].trips_id, lat: lat, lng: lng };
			if (body && url) {
				try {
					const postResponse = await axios.post(url, body);
					console.log('confirmed SOS');
				} catch (error) {
					toast.error('Body and URL was not set appropriately.');
				}
			}
			await axios.get(`/api/notif/sosNotif/?phone_number=${userInfo.phone_number}&name=${userInfo.name}`)
		} catch (error) {
			toast.error('SOS did not work appropriately.');
		}
	};

	const handleClickEnd = async (event: any) => {
		const body = { tripId: userTrip[0].trips_id };
		const url = '/api/trips/reached';

		if (body && url) {
			try {
				const postResponse = await axios.post(url, body);
				console.log('confirmed End Trip');
				setEndTrip(true);
				localStorage.setItem('EndTrip', JSON.stringify(true));
			} catch (error) {
				toast.error('End Trip not working');
			}
		}
		await axios.get(`/api/notif/endNotif/?phone_number=${userInfo.phone_number}&name=${userInfo.name}`)
	};

	useEffect(() => {
		setEndTrip(JSON.parse(localStorage.getItem('EndTrip')));
	}, [userInfo]);
	console.log(endTrip);

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

					if (response.data.length > 0) {
						setUserTrip({
							...response.data,
							start_lat: Number(response.data[0].start_lat),
							start_lng: Number(response.data[0].start_lng),
						});
					} else {
						return;
					}
					setLocation(true);
				} catch (error) {
					toast.error('Server did not retrieve data appropriately');
				}
			};
			getMyLocation();
		}
	}, [userInfo]);

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
					<>
						{endTrip === true || endTrip === null ? (
							<>
								<Typography variant="h5">You have no active trips. Go to contacts to start your trip...</Typography>
							</>
						) : (
							<>
								<Card sx={{ maxWidth: 700 }}>
									<div className="map-container">
										<UserMapContainer userTrip={userTrip} />
									</div>
									<CardContent>
										<Typography gutterBottom variant="h5" component="div">
											Your Current Trip
										</Typography>
									</CardContent>
									<CardActions>
										<Button
											size="large"
											variant="contained"
											color="primary"
											name="end-trip"
											onClick={(e: any) => {
												handleClickEnd(e.target.value);
											}}>
											End this Trip
										</Button>
										<Button
											size="large"
											variant="contained"
											color="error"
											name="sos"
											onClick={(e: any) => {
												handleClickSos(e.target.value);
											}}>
											ALERT CONTACTS FOR HELP
										</Button>
									</CardActions>
								</Card>{' '}
							</>
						)}
					</>
				</Container>
			</Box>
		</>
	);
};

export default MyTripCard;
