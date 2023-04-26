import { Router, Request, Response } from 'express';
const usersController = require('../controllers/usersController');
const router = Router();

//get single user by phone number (for adding contacts). If nothing is found, the 'rows' property is an empty array.
// testing without :phone_number in route


// tested on backend w/ Postman, WORKS
// returns user id, name, phone_number, password if found
router.get(
  '/:phone_number',
  usersController.getUserByPhoneNumber,
  (req: Request, res: Response) => {
    const { rows } = res.locals.user;
    res.status(200).json(rows);
  }
);

module.exports = router;