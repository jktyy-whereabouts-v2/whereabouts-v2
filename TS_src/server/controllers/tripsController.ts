const db = require('../models/whereaboutsModel');
const axios = require('axios');
import { Request, Response, NextFunction } from 'express';

const tripsController = {
  //gets current location, stores new trip with current location and stores traveler/watcher relation after user clicks 'start new trip'
  startNewTrip: async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.locals.location = await axios.post(
        `https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyBRzoiY1lCeVlXPEZELkqEdTehWIUcijms`
      );
      //get user's current location
      const { data } = await axios.post(
        `https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyBRzoiY1lCeVlXPEZELkqEdTehWIUcijms`
      ); //FIXME --> use .env to store the key
      const lat = data.location.lat;
      const lng = data.location.lng;
      //store trip in trips table
      const { rows } = await db.query(
        `INSERT INTO trips (start_timestamp, start_lat, start_lng)
        VALUES (NOW(), ${lat}, ${lng})
        RETURNING id`
        );
      const tripId = rows[0].id;
      //store traveler in join table
      const traveler = req.body.traveler;
      await db.query(
        `INSERT
        INTO trips_users_join
        (trips_id, user_is_traveler, user_phone_number)
        VALUES
        (${tripId}, TRUE, '${traveler}')`
      );
      req.body.watchers.forEach(async (watchers: string) => {
        await db.query(
          `INSERT INTO trips_users_join
          (trips_id, user_is_traveler, user_phone_number)
          VALUES (${tripId}, FALSE, ${watchers})`
        );
      });
      return next();
    } catch (error) {
      return next({
        log: "Express error handler caught tripsController.startNewTrip error",
        status: 500,
        message: { error: "Error starting a new trip" },
      });
    }
  },
    
  //updates trip with sos timestamp, sos lat and sos lng
  sendSos: async (req: Request, res: Response, next: NextFunction) => {
    try {
      //get user's current location
      const { data } = await axios.post(
        `https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyBRzoiY1lCeVlXPEZELkqEdTehWIUcijms`
      ); //FIXME --> use .env to store the key
      const lat = data.location.lat;
      const lng = data.location.lng;
      //update trip sos details
      await db.query(
        `UPDATE trips
        SET sos_timestamp = NOW(), sos_lat = ${lat}, sos_lng = ${lng}
        WHERE id = ${req.body.tripId}`
      );
      return next();
    } catch (error) {
      return next({
        log: "Express error handler caught tripsController.sendSos error",
        status: 500,
        message: { error: "Error storing sos details" },
      });
    }
  },
    
   //updates trip with end timestamp
   endTrip: async (req: Request, res: Response, next: NextFunction) => {
    try {
      //update trip end details
      await db.query(
        `UPDATE trips
          SET end_timestamp = NOW()
          WHERE id = ${req.body.tripId}`
      );
      return next();
    } catch (error) {
      return next({
        log: "Express error handler caught tripsController.sendSos error",
        status: 500,
        message: { error: "Error storing sos details" },
      });
    }
  },

  myTrip: async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.locals.trip = await db.query(
        `SELECT *
        FROM trips t
        INNER JOIN trips_users_join j ON t.id = j.trips_id
        WHERE j.user_is_traveler = TRUE
        AND j.user_phone_number = '${req.params.phone_number}'
        ORDER BY t.id DESC`
      );
      return next();
    } catch (error) {
      return next({
        log: "Express error handler caught tripsController.myTrip error",
        status: 500,
        message: { error: "Error retrieving user trip" },
      });
    }
  },
};

module.exports = tripsController;