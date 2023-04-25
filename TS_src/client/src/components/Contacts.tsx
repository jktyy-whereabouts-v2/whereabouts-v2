import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { CssBaseline, Container, Box, Typography, TextField, IconButton, Button } from '@mui/material';
import '@fontsource/roboto/300.css';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import ContactList from './ContactList';
// import MyTripCard from "./MyTripCard";
import { User, Trip } from './types';
import Sidebar from './Sidebar';
import Divider from '@mui/material/Divider';
import { useNavigate } from 'react-router-dom';

interface Props {
	userInfo: User;
	contacts: any;
	setContacts: Dispatch<SetStateAction<any>>;
	setActiveComponent: Dispatch<SetStateAction<string>>;
	logout: Function;
	setUserTrip: Dispatch<SetStateAction<Trip>>;
}

const googleURL = process.env.GOOGLEMAPSAPIKEY;

function Contacts({ userInfo, contacts, setContacts, setActiveComponent, logout, setUserTrip }: Props) {
	const navigate = useNavigate();

	// hook to manage contacts checked from list
	const [checkedContacts, setCheckedContacts] = useState<Array<User>>([]);
	// hook to disable starting trip button if no contacts are checked
	const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);
	// hook to set status on whether trips has started, for navigation purposes
	const [submitted, clickSubmitted] = useState(false);

	// Fetch GET request for contact and add to list:
	const handleSubmit = async (event: any) => {
		event.preventDefault();
	
		const phone_number = event.target[0].value.replaceAll(/[^0-9]/g, '');
		event.target[0].value = '';

		try {
			const response = await axios.get(`/api/users/${phone_number}`);

			const contactData = response.data[0];
			// if contact does not exist
			if (!contactData.name) return;

			// if user exists

			// check if contact is already in user's contact list
			const contactShown = contacts.reduce((acc: number, user: User) => {
				if (user.phone_number === contactData.phone_number) ++acc;
				return acc;
			}, 0);

			// if contact is not in user's contact list, add it to the list
			if (!contactShown) {
				setContacts([...contacts, contactData]);
				// also updating contact list in the database
				await axios.post('/api/addContact', {
					traveler_phone_number: userInfo.phone_number,
					contact_phone_number: contactData.phone_number
				});
			}
		} catch (err: any) {
			console.log('Fetch request for user with phone_number failed.', err.response.data);
		}
	};

	// function to delete contact from list, pass to contacts list
	const deleteContact = async (index: number, contact: User) => {

		// delete contact from the contact list
		const newContacts = [...contacts];
		const newCheckedContacts = [...checkedContacts];
		newContacts.splice(index, 1);
		setContacts(newContacts);

		// if contact has also been checked, uncheck it
		const foundIndex = newCheckedContacts.indexOf(contact);
		if (foundIndex >= 0) newCheckedContacts.splice(foundIndex, 1);
		if (newContacts.length === 0 || newCheckedContacts.length === 0) setButtonDisabled(true);
		setCheckedContacts(newCheckedContacts);

		// updating database
		await axios.delete(`/api/deleteContact/traveler/${userInfo.phone_number}/contact/${contact.phone_number}`);
	};

	// function to extract phone numbers from checkedContacts array
	const extractPhoneNumbers = (array: any) => {
		return array.map((obj: any) => obj.phone_number);
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

	// initially receiving user's contact list from the database
	useEffect(() => {
		axios.get(`/api/getContacts/${userInfo.phone_number}`)
			.then(response => {
				setContacts(response);
			})
			.catch(err => console.log(err.message));
	}, []);

	return (
		<>
			<Divider sx={{ width: '85%', margin: 'auto' }} variant="middle"></Divider>
			<CssBaseline />
			<Box sx={{ display: 'flex', mt: '30px' }}>
				<Container sx={{ width: '40%', ml: '30px' }}>
					<Sidebar logout={logout} />
				</Container>

				<Container sx={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingBottom: '10px', marginTop: '20px' }}>
					<Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
						<TextField size="small" placeholder="Add Contact..." id="addContact" name="addContact" label="Add Contact" />
						<IconButton type="submit">
							<SearchIcon />
						</IconButton>
					</Box>
					<Typography variant="h6">Select a few contacts to share your trip with:</Typography>

					<ContactList contacts={contacts} deleteContact={deleteContact} checkedContacts={checkedContacts} setCheckedContacts={setCheckedContacts} setButtonDisabled={setButtonDisabled} />

					<Button variant="contained" onClick={handleStartTrip} disabled={buttonDisabled}>
						Start Your Trip!
					</Button>
				</Container>
			</Box>
		</>
	);
}

export default Contacts;
