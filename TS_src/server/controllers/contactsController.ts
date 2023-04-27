const db = require('../models/whereaboutsModel');
import { Request, Response, NextFunction } from 'express';

const contactsController = {
   //get contacts of current user
  getContacts: async (req: Request, res: Response, next: NextFunction) => {
    try {
    const { phone_number } = req.params;
    res.locals.contacts = await db.query(
      `select u.phone_number, u.name from users u 
        inner join contacts_join cj on u.phone_number = cj.contact_phone_number
        where cj.traveler_phone_number = '${phone_number}'`
      );
      return next();
    } catch (error) {
      return next({
        log: 'Express error handler caught contactsController.getContacts error',
        status: 500,
        message: { error: 'Retrieving contacts of current user failed' },
      });
    }
  },
      //delete contact
  deleteContact: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { travelerPhone, contactPhone } = req.params;
      await db.query(
        `DELETE FROM contacts_join
        WHERE traveler_phone_number = '${travelerPhone}' 
        AND contact_phone_number = '${contactPhone}'`
      );
      return next();
    } catch (error) {
      return next({
        log: "Express error handler caught contactsController.deleteContact error",
        status: 500,
        message: { error: "Failed to delete contact" },
      });
    }
  },
  // add a contact
  addContact: async (req: Request, res: Response, next: NextFunction) => {
    try {
      //store traveler-contact relationship
      await db.query(
        `INSERT INTO contacts_join (traveler_phone_number, contact_phone_number)
        VALUES (${req.body.traveler_phone_number}, ${req.body.contact_phone_number})`
      );
      return next();
    } catch (error) {
      return next({
        log: "Express error handler caught contactsController.addContact error",
        status: 500,
        message: { error: "Error storing contacts details" },
      });
    }
  },
};

module.exports = contactsController;