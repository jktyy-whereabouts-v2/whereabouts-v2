import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import Contacts from "../Contacts";
import ChatPage from "../ChatPage";
import TripImWatching from "../TripImWatching";
import MyTripCard from "../MyTripCard";
import { User, UserProps } from "../types";
import socket from "../../main";

function Dashboard({ userInfo, setUserInfo }: UserProps) {
  interface Contact {}
  // hook for contacts per user
  const [contacts, setContacts] = useState<Array<User>>([]);

  // hook for conditionally rendering components
  const [activeComponent, setActiveComponent] = useState("");

  // hook for tracking userTrip data
  interface Trip {
    active: boolean;
    start_timestamp: string;
    start_lat: string;
    start_lng: string;
    sos_timestamp: string;
    sos_lat: string;
    sos_lng: string;
  }

  interface TripProps {
    userTrip: Trip;
    setUserTrip: React.Dispatch<React.SetStateAction<Trip>>;
  }

  const [userTrip, setUserTrip] = useState<Trip>({
    active: true,
    start_timestamp: "",
    start_lat: "",
    start_lng: "",
    sos_timestamp: "",
    sos_lat: "",
    sos_lng: "",
  });

  // toggle components in sidebar
  const handleClick = (componentName: string) => {
    setActiveComponent(componentName);
  };

  return (
    <div className="dashboard-container">
      {/* SSE - Render trips */}
      {/* <div>
        {trips.map((trip) => (
          <div>Trip Id: {trip.id} | Trip Start Time: {trip.start_timestamp} ||</div>
        ))}
      </div> */}
      <div className="sidebar-container">
        <Sidebar handleClick={handleClick} />
      </div>
      <div className="functions-container">
        {activeComponent === "contacts" && (
          <Contacts
            userInfo={userInfo}
            contacts={contacts}
            setContacts={setContacts}
            setActiveComponent={setActiveComponent}
          />
        )}
        {activeComponent === "myTripCard" && (
          <MyTripCard
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            userTrip={userTrip}
            setUserTrip={setUserTrip}
          />
        )}
        {activeComponent === "tripsImWatching" && (
          <TripImWatching userInfo={userInfo} />
        )}
        {activeComponent === "chatPage" && (
          <ChatPage
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            path="/chat"
            socket={socket}
          />
        )}
      </div>
    </div>
  );
}

export default Dashboard;
