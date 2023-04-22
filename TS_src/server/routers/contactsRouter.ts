import { Router, Request, Response } from 'express';
const contactsController = require('../controllers/contactsController');
const router = Router();

//get all contacts of current user
router.get('/', contactsController.getContacts,
  (req: Request, res: Response) => {
    const { rows } = res.locals.contacts;
    res.status(200).json(rows);
  }
);

//add a contact to current user's contacts list
router.post('/', contactsController.addContact, (req: Request, res: Response) => {
  res.sendStatus(200);
});

//delete a contact
router.delete(
  '/traveler/:travelerPhone/contact/:contactPhone',
  contactsController.deleteContact,
  (req: Request, res: Response) => {
    res.status(204).json([]); //204 --> no content
  }
);

module.exports = router;