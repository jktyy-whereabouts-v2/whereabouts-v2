import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import { Box } from "@mui/material";
import CardContent from "@mui/material/CardContent";
// import CardMedia from '@mui/material/CardMedia';
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import axios from "axios";
import MapContainer from "./MapContainer";

// When rendering this component, use => <MyTripCard userInfo={userInfo} setUserInfo={setUserInfo} userTrip={userTrip} setUserTrip={setUserTrip} />

// Card media is not needed since it was a component for the stock image that came with MUI
const googleURL = process.env.GOOGLEMAPSAPIKEY;

const MyTripCard = ({ userInfo, setUserInfo, userTrip, setUserTrip }) => {
  const trip = {
    start_lat: 40.6970173,
    start_lng: -74.310035,
    tripId: 99,
  };

  const handleClick = async (name: any) => {
    try {
      const response = await axios.post(
        `https://www.googleapis.com/geolocation/v1/geolocate?key=${googleURL}`
      );
      console.log(response);
      const { lat, lng } = response.data.location;
      // update state with sos position, if sos was clicked
      if (name !== "end-trip") {
        setUserTrip((prevState: any) => {
          return {
            ...prevState,
            sos_lat: lat,
            sos_lng: lng,
          };
        });
      }

      const body =
        name === "end-trip"
          ? { tripId: trip.tripId }
          : { tripId: trip.tripId, lat: lat, lng: lng };
      const url = name === "end-trip" ? "/api/trips/reached" : "/api/trips/sos";

      try {
        axios.post(url, body);
      } catch (err) {
        console.log(err);
      }
    } catch (err) {
      console.log("error with fetching position from google api =>", err);
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mt: "100px",
        }}
      >
        <Card sx={{ maxWidth: 700 }}>
          {/* lat={userTrip.start_lat} lng={userTrip.start_lng} */}
          <div className="map-container">
            <MapContainer trip={trip} />
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
              onClick={(e) => {
                handleClick(e.target.name);
              }}
            >
              End this Trip
            </Button>
            <Button
              size="large"
              variant="contained"
              color="error"
              name="sos"
              onClick={(e) => {
                handleClick(e.target.name);
              }}
            >
              ALERT CONTACTS FOR HELP
            </Button>
          </CardActions>
        </Card>
      </Box>
    </>
  );
};

export default MyTripCard;
