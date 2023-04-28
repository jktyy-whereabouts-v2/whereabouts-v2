import { Router, Request, Response } from 'express';
const tripsController = require('../controllers/tripsController');
const router = Router();

//start new trip
// tested on backend w/ Postman, WORKS
// saves user trips_id, user_is_traveler(true), and user_phone_number
// saves watchers trips_id, user_is_traveler(false), and user_phone_number
// info saved to trips table & trips_users_join table
router.post('/start', tripsController.startNewTrip, (req: Request, res: Response) => {
	res.sendStatus(204);
});

//get my current trip
// tested on backend w/ Postman, WORKS
// returns array of objects w/ trips
// ex:
// [{
//   "id": "196",
//   "start_timestamp": "2023-04-23T22:15:29.662Z",
//   "start_lat": "36.2471752",
//   "start_lng": "-115.2927295",
//   "sos_timestamp": null,
//   "sos_lat": null,
//   "sos_lng": null,
//   "end_timestamp": null,
//   "trips_id": 196,
//   "user_is_traveler": true,
//   "user_phone_number": "742"
// }],
router.get('/my/:phone_number', tripsController.myTrip, (req: Request, res: Response) => {
	const { rows } = res.locals.trip;
	res.status(200).json(rows);
});

// delete userTrip
router.delete('/reached/:phone_number', tripsController.deleteTrip, (req: Request, res: Response) => {
	res.sendStatus(204);
});
//send SOS alert
// tested on backend w/ Postman, WORKS
// sets sos_timestamp, sos_lat, sos_lng in trips table
router.post('/sos', tripsController.sendSos, (req: Request, res: Response) => {
	res.sendStatus(204);
});

//end trip
// tested on backend w/ Postman, WORKS
// posts end_timestamp on trips table
router.post('/reached', tripsController.endTrip, (req: Request, res: Response) => {
	res.sendStatus(204);
});

module.exports = router;
