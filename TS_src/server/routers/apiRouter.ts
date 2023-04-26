import { Router, Request, Response } from 'express';
const whereaboutsController = require('../controllers/whereaboutsController');
const router = Router();

// // LOGIN component routes
// router.post('/login', whereaboutsController.checkUserExists, (req: Request, res: Response) => {
//   res.status(200).json({name : res.locals.name, phone_number : res.locals.phone_number});
// });

// // REGISTER component routes
// router.post('/register', whereaboutsController.insertNewUser, (req: Request, res: Response) => {
//   res.status(200).json({name : res.locals.name, phone_number : res.locals.phone_number});
// });

//get all contacts of current user
router.get(
  '/users/contacts/',
  whereaboutsController.getContacts,
  (req: Request, res: Response) => {
    const { rows } = res.locals.contacts;
    res.status(200).json(rows);
  }
);

//add a contact to current user's contacts list
router.post('/users/contacts', whereaboutsController.addContact, (req: Request, res: Response) => {
  res.sendStatus(200);
});

//get single user by phone number (for adding contacts). If nothing is found, the 'rows' property is an empty array.
// testing without :phone_number in route
router.get(
  '/users/:phone_number',
  whereaboutsController.getUserByPhoneNumber,
  (req: Request, res: Response) => {
    const { rows } = res.locals.user;
    res.status(200).json(rows);
  }
);

//delete a contact
router.delete(
  '/users/contacts/traveler/:travelerPhone/contact/:contactPhone',
  whereaboutsController.deleteContact,
  (req: Request, res: Response) => {
    res.status(204).json([]); //204 --> no content
  }
);

// router.post('/register', whereaboutsController.insertNewUser, (req: Request, res: Response) =>
//   res.sendStatus(200)
// );

// //start new trip
// router.post('/trips/start', whereaboutsController.startNewTrip, (req: Request, res: Response) => {
//   res.sendStatus(204);
// });

// //get my current trip
// router.get('/trips/my', whereaboutsController.myTrip, (req: Request, res: Response) => {
//   const { rows } = res.locals.trip;
//   res.status(200).json(rows);
// });

// //send SOS alert
// router.post('/trips/sos', whereaboutsController.sendSos, (req: Request, res: Response) => {
//   res.sendStatus(204);
// });

// //end trip
// router.post('/trips/reached', whereaboutsController.endTrip, (req: Request, res: Response) => {
//   res.sendStatus(204);
// });

module.exports = router;