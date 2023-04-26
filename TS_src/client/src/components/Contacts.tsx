import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { CssBaseline, Container, Box, Typography, TextField, IconButton, Button, InputAdornment, FilledInput } from '@mui/material';
import '@fontsource/roboto/300.css';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import ContactList from './ContactList';
// import { Routes, Route } from "react-router-dom";
// import MyTripCard from "./MyTripCard";
import { User, Trip } from './types';
import Sidebar from './Sidebar';
import Divider from '@mui/material/Divider';
import { useNavigate } from 'react-router-dom';

interface Props {
	userInfo: User;
	contacts: Array<User>;
	setContacts: Dispatch<SetStateAction<Array<User>>>;
	setActiveComponent: Dispatch<SetStateAction<string>>;
	logout: Function;
	setUserTrip: Dispatch<SetStateAction<Trip>>;
	userTrip: any;
}

const googleURL = process.env.GOOGLEMAPSAPIKEY;

function Contacts({ userInfo, contacts, setContacts, setActiveComponent, logout, setUserTrip, userTrip }: Props) {
	const navigate = useNavigate();

	// hook to manage contacts checked from list

	const [checkedContacts, setCheckedContacts] = useState<User[]>([]);
	const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);
	const [submitted, clickSubmitted] = useState(false);

	// Fetch GET request for contact and add to list:
	const handleSubmit = async (event: any) => {
		event.preventDefault();
		const phone_number = event.target[0].value.replaceAll(/[^0-9]/g, '');
		event.target[0].value = '';

		//fetch request to get contact info
		try {
			const response = await axios.get(`/api/users/${phone_number}`);

			const contactData = response.data[0];
			if (!contactData.name) return;

			// add user to array of contacts
			const contactShown = contacts.reduce((acc, user) => {
				if (user.phone_number === contactData.phone_number) ++acc;
				return acc;
			}, 0);
			if (!contactShown) setContacts([...contacts, contactData]);
		} catch (err: any) {
			console.log('Fetch request for user with phone_number failed.', err.response.data);
		}
	};

	// function to delete contact from list, pass to contacts list
	const deleteContact = (index: number, contact: User) => {
		const newContacts = [...contacts];
		const newCheckedContacts = [...checkedContacts];
		newContacts.splice(index, 1);

		const foundIndex = newCheckedContacts.indexOf(contact);
		if (foundIndex >= 0) newCheckedContacts.splice(foundIndex, 1);
		if (newContacts.length === 0 || newCheckedContacts.length === 0) setButtonDisabled(true);

		// console.log('new contacts:', newContacts);
		// console.log('new checked contacts', newCheckedContacts)
		setContacts(newContacts);
		setCheckedContacts(newCheckedContacts);
	};

	// function to extract phone numbers from checkedContacts array
	const extractPhoneNumbers = (array: typeof contacts) => {
		return array.map((obj) => obj.phone_number);
	};

	// declare variable to contain proper info to send backend
	const tripData = {
		traveler: userInfo.phone_number,
		watchers: extractPhoneNumbers(checkedContacts),
	};

	// function to send post request to back end with user information to start trip
	const handleStartTrip = async () => {
		// create a post request to the route: /api/trips/start
		try {
			const response = await axios.post(`https://www.googleapis.com/geolocation/v1/geolocate?key=${googleURL}`);
			const { lat, lng } = response.data.location;
			setUserTrip((prevState: any) => {
				return {
					...prevState,
					start_timestamp: new Date().toDateString(),
					start_lat: lat,
					start_lng: lng,
				};
			});
			const res = await axios.post('/api/trips/start', tripData);
			if (res.status === 204) {
				console.log('status is 200, redirect to MyTripCard');
				clickSubmitted(true);
			}
		} catch (error) {
			if (error) {
				alert('Please check contacts information and try again');
			}
		}
	};

	useEffect(() => {
		if (submitted) {
			navigate('/myTrip');
		}
	}, [submitted]);

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
						marginTop: '20px',
					}}>
					<Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
						<TextField
							sx={{ width: '280px' }}
							size="small"
							id="contacts"
							placeholder="Add Contact"
							InputProps={{
								endAdornment: (
									<InputAdornment position="end">
										<IconButton type="submit" edge="end">
											<SearchIcon />
										</IconButton>
									</InputAdornment>
								),
							}}
						/>
					</Box>
					<Typography sx={{ marginTop: '25px' }} variant="h6">
						Select to share your trip with:
					</Typography>

					<ContactList contacts={contacts} deleteContact={deleteContact} checkedContacts={checkedContacts} setCheckedContacts={setCheckedContacts} setButtonDisabled={setButtonDisabled} />
					<Button sx={{ width: '290px' }} variant="contained" onClick={handleStartTrip} disabled={buttonDisabled}>
						Start Your Trip!
					</Button>
				</Container>
			</Box>
		</>
	);
}

export default Contacts;
