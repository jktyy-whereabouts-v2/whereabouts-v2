import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { 
  CssBaseline,
  Container,
  Box,
  Typography,
  TextField,
  IconButton,
  Button
} from '@mui/material';
import '@fontsource/roboto/300.css';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import ContactsList from './ContactList';
// import { Routes, Route } from "react-router-dom";
// import MyTripCard from "./MyTripCard";
import { User } from './types';

interface Props {
  userInfo: User;
  contacts: Array<User>;
  setContacts: Dispatch<SetStateAction<Array<User>>>;
  setActiveComponent: Dispatch<SetStateAction<string>>;
};


function Contacts({
  userInfo,
  contacts,
  setContacts,
  setActiveComponent,
}: Props) {
  // hook to manage contacts checked from list
  const [checkedContacts, setCheckedContacts] = useState<User[]>([]);
  const [buttonDisabled, setButtonDisabled] = React.useState<boolean>(true);

  // Fetch GET request for contact and add to list:
  const handleSubmit = async (event: any) => {
    event.preventDefault();
    //console.log('submit: ', event.target[0].value )
    const phone_number = event.target[0].value.replaceAll(/[^0-9]/g, '');
    //fetch request to get contact info
    try {
      const response = await axios.get(
        `/api/users/${phone_number}`
      );

      const contactData = response.data[0];

      // add user to array of contacts
      const contactShown = contacts.reduce((acc, user) => {
        if(user.phone_number === contactData.phone_number) ++acc;
        return acc;
      }, 0);
      console.log(contactShown)
      if(!contactShown) setContacts([...contacts, contactData]);
    } catch (err: any) {
      console.log('Fetch request for user with phone_number failed.', err.response.data);
    }
  };

  // function to delete contact from list, pass to contacts list
  const deleteContact = (index: number, user: User) => {
    const newContacts = [...contacts];
    const newCheckedContacts = [...checkedContacts];
    newContacts.splice(index, 1);

    const foundIndex = newCheckedContacts.indexOf(user);
    if(foundIndex >= 0) newCheckedContacts.splice(foundIndex, 1);
    if(newContacts.length === 0 || newCheckedContacts.length === 0) setButtonDisabled(true);

    console.log('new contacts:', newContacts);
    console.log('new checked contacts', newCheckedContacts)
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
  const handleStartTrip = () => {
    // create a post request to the route: /api/trips/start
    console.log('inside handleStartTrip');
    axios
      .post('/api/trips/start', tripData)
      .then((response) => {
        if (response.status === 204) {
          console.log('status is 200, redirect to MyTripCard');
          setActiveComponent('myTripCard');
        }
        console.log('Successful response from back end ', response);
      })
      .catch((error) => {
        if (error) {
          alert('Please check contacts information and try again');
        }
      });
  };

  // // checking state of contacts data:
  useEffect(() => {
    console.log('Current checkedContacts:', checkedContacts);
    console.log('Current User phone: ', userInfo.phone_number);
    console.log('Current trip data: ', tripData);
  }, [checkedContacts, userInfo.phone_number, tripData]);

  return (
    <Container 
      maxWidth='sm'
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <CssBaseline/>
      <Typography variant='h5'>Add contacts to your list:</Typography>
      <Box 
        sx={{
          display: 'inline-flex',
          width: '100%'
        }}
        component='form' 
        onSubmit={handleSubmit}
      >
        <TextField
          margin='normal'
          fullWidth
          name='addContact'
          placeholder='Search by phone number'
        />
        <IconButton
          type='submit'
        >
          <SearchIcon/>
        </IconButton>
      </Box>  
      <Typography variant='h6'>Select a few contacts to share your trip with:</Typography>
      <ContactsList
        contacts={contacts}
        deleteContact={deleteContact}
        checkedContacts={checkedContacts}
        setCheckedContacts={setCheckedContacts}
        buttonDisabled={buttonDisabled}
        setButtonDisabled={setButtonDisabled}
      />
      <Button
        variant='contained'
        onClick={handleStartTrip}
        disabled={buttonDisabled}
      >
        Start Your Trip!
      </Button>
    </Container>
  );
}

export default Contacts;
