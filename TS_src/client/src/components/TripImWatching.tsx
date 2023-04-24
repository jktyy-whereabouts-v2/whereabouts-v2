import React, { useState, useEffect } from "react";
// import ProgressBar from "./ProgressBar";
import TripViewingCard from "./TripViewingCard";
import {
  Box,
  styled,
  Typography,
  Stack,
  CssBaseline,
  InputBase,
} from "@mui/material";
import { Container } from "@mui/system";
import Sidebar from "./Sidebar";
import Divider from "@mui/material/Divider";
import { User } from "./types";

interface Trips {
  trips_id: string;
  start_lat: number;
  start_lng: number;
}

const TripImWatching: React.FC<{ userInfo: User; logout: Function }> = ({
  userInfo,
  logout,
}) => {
  //SSE - render trips
  const [trips, setTrips] = useState<Trips[]>([]);
  console.log(trips);
  useEffect(() => {
    const source = new EventSource(
      `http://localhost:3500/stream/${userInfo.phone_number}`,
      {
        //replace 123456789 with current user's phone_number
        withCredentials: false,
      }
    ); //maybe need to add to webpack?
    console.log(source);

    source.addEventListener("open", () => {
      console.log("SSE opened!");
    });

    source.addEventListener("message", (e) => {
      console.log(e.data);
      const data = JSON.parse(e.data);
      console.log(data);
      setTrips(data);
    });

    source.addEventListener("error", (e) => {
      console.log("hitting error");
      console.error("Error: ", e);
    });

    return () => {
      source.close();
    };
  }, []);

  return (
    <>
      <Divider sx={{ width: "85%", margin: "auto" }} variant="middle"></Divider>
      <CssBaseline />
      <Box sx={{ display: "flex", mt: "30px" }}>
        <Container sx={{ width: "40%", ml: "30px" }}>
          <Sidebar logout={logout} />
        </Container>
        <Container
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            paddingBottom: "10px",
          }}
        >
          <div className="trip-watching-container">
            <br />
            <h1>Trips I'm Watching</h1>
            {trips.map((trip) => (
              <div key={trip.trips_id} className="view-card">
                <br></br>
                <TripViewingCard trip={trip} />
                {/* <br></br>
            <ProgressBar
              trip={trip}
            /> */}
              </div>
            ))}
          </div>
        </Container>
      </Box>
    </>
  );
};

export default TripImWatching;
