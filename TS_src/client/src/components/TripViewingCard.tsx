import * as React from "react";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import MapContainer from "./ContactsMapContainer";
import CardActions from "@mui/material/CardActions";
import { red } from "@mui/material/colors";

// Card media is not needed since it was a component for the stock image that came with MUI

// Pass props from contact list. Must have SOS state passed down from...
export default function TripViewingCard({ trip }: any) {
  //Adds red border to trip with SOS enabled
  const sx = { maxWidth: 700 };
  const messages: any = {
    ongoing: {
      status: "Ongoing",
      title: "is on a journey home",
      color: "success.main",
      bgColor: "",
    },
    sos: {
      status: "SOS",
      title: "needs help",
      color: "error.main",
      bgColor: "#FFA592",
    },
    finished: {
      status: "Finished",
      title: "reached destination safely",
      color: "text.secondary",
      bgColor: "#D6D6D6",
    },
  };
  let status = "ongoing";
  if (trip.end_timestamp) status = "finished";
  else if (trip.sos_timestamp) status = "sos";

  return (
    <Card sx={{ maxWidth: 700, backgroundColor: messages[status].bgColor }}>
      <div className="map-container">
        <MapContainer trip={trip} />
      </div>

      <Typography variant="h5" color={messages[status].color}>
        {messages[status].status}
      </Typography>
      <Typography gutterBottom variant="h4" component="div">
        {/* Here is were we'd insert contact's name and possibly travel destination */}
        <b style={{ textDecoration: "underline" }}>{trip.traveler_name}</b>{" "}
        {messages[status].title}
      </Typography>
      <Typography variant="body2" color="{text}">
        Status: {status}
      </Typography>

      <CardActions>
        {/* conditionally render these buttons when SOS is active on trip */}
        {trip.sos_timestamp && <Button size="large">Join Chat</Button>}
        {trip.sos_timestamp && <Button size="large">Decline SOS</Button>}
      </CardActions>
    </Card>
  );
}
