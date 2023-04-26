import { Router, Request, Response } from 'express';
const loginController = require('../controllers/loginController');
const router = Router();

// REGISTER component routes
// tested on backend w/ Postman, WORKS 
// registers new user
router.post('/', loginController.insertNewUser, (req: Request, res: Response) => {
  res.status(200).json({name : res.locals.name, phone_number : res.locals.phone_number});
});

// extra post request?
// router.post('/register', loginController.insertNewUser, (req: Request, res: Response) =>
//   res.sendStatus(200)
// );

module.exports = router;