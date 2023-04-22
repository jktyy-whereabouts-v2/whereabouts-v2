import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import axios from "axios";
import ContactsList from "./ContactList";
// import { Routes, Route } from "react-router-dom";
// import MyTripCard from "./MyTripCard";
import { User } from "./types";

interface Props {
  userInfo: User;
  contacts: Array<User>;
  setContacts: Dispatch<SetStateAction<Array<User>>>;
  setActiveComponent: Dispatch<SetStateAction<string>>;
}

function Contacts({
  userInfo,
  contacts,
  setContacts,
  setActiveComponent,
}: Props) {
  // hook to manage contacts checked from list
  const [checkedContacts, setCheckedContacts] = useState<User[]>([]);
  // hook to redirect to MyTripStart
  // const [redirect, setRedirect] = useState(false);

  // Fetch GET request for contact and add to list:
  const handleSubmit = async (event: any) => {
    event.preventDefault();
    //console.log('submit: ', event.target[0].value )

    //fetch request to get contact info
    try {
      const response = await axios.get(
        // event target may need to be broken down
        // `/api/users/${event.target}`
        `/api/users/${event.target[0].value}`
      );

      const contactData = response.data[0];
      // console.log('contactData: ', contactData);

      // add user to array of contacts
      const contactShown = contacts.reduce((acc, user) => {
        if(user.phone_number === contactData.phone_number) ++acc;
        return acc;
      }, 0);
      console.log(contactShown)
      if(!contactShown) setContacts([...contacts, contactData]);
    } catch (err: any) {
      console.log(`Fetch request for user with phone_number failed.`, err.response.data);
    }
  };

  // function to delete contact from list, pass to contacts list
  const deleteContact = (index: number) => {
    const newContacts = [...contacts];
    newContacts.splice(index, 1);
    setContacts(newContacts);
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
    console.log(`inside handleStartTrip`);
    axios
      .post("/api/trips/start", tripData)
      .then((response) => {
        if (response.status === 204) {
          console.log(`status is 200, redirect to MyTripCard`);
          // Move back set Redirect into this bracket for proper rendering.
          // setRedirect(true);
          setActiveComponent("myTripCard");
        }
        console.log("Successful response from back end ", response);
      })
      .catch((error) => {
        if (error) {
          alert(`Please check contacts information and try again`);
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
    <div className="contacts-container">
      <br></br>
      {/* Invoking redirect hook in event of successful post request */}
      {/* {redirect && 
        <Routes>
          <Route path="/" element={<MyTripCard />} replace={true} />
        </Routes>
      } */}
      <div className="add-contact-container">
        <form onSubmit={handleSubmit} className="add-contact-form">
          <p>Add contacts to your list:</p>
          <input
            type="text"
            className="add-contact-input"
            id="contact-phone-number"
          />
          <button type="submit" className="add-contact-btn">
            Add Contact
          </button>
        </form>
      </div>
      <br></br>
      <div className="valid-contacts-container">
        <div className="titles-row">
          <button
            className="start-trip-button"
            role="button"
            onClick={handleStartTrip}
          >
            Start Your Trip!
          </button>
        </div>

        <div className="contacts-display">
          <h3>Select a few contacts to share your trip with:</h3>
          <ContactsList
            contacts={contacts}
            deleteContact={deleteContact}
            checkedContacts={checkedContacts}
            setCheckedContacts={setCheckedContacts}
          />
        </div>
      </div>
    </div>
  );
}

export default Contacts;
