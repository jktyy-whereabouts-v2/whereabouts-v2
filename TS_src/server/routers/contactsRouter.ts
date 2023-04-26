import { Router, Request, Response } from 'express';
const contactsController = require('../controllers/contactsController');
const router = Router();

// get all contacts of current user
// tested on backend w/ Postman, DOES NOT WORK
// route not set up correctly, middleware does not get phone number from params, no variable in endpoint set up
// how are we getting phone number from front end?
router.get('/', contactsController.getContacts,
  (req: Request, res: Response) => {
    const { rows } = res.locals.contacts;
    res.status(200).json(rows);
  }
);

//add a contact to current user's contacts list
// tested on backend using Postman, WORKS
// data added to contacts_join table
router.post('/', contactsController.addContact, (req: Request, res: Response) => {
  res.sendStatus(200);
});

//delete a contact
// tested on backend using Postman, WORKS
// data deleted from contacts_join table
// this won't work. Controller expects a contact phone number and a traveller phone number. Will need to change to req.query
router.delete(
  '/traveler/:travelerPhone/contact/:contactPhone',
  contactsController.deleteContact,
  (req: Request, res: Response) => {
    res.status(204).json([]); //204 --> no content
  }
);

module.exports = router;