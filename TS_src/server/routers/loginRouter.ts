import { Router, Request, Response } from 'express';
const loginController = require('../controllers/loginController');
const router = Router();

// LOGIN component routes 
// tested on backend w/ Postman, WORKS
router.post('/', loginController.checkUserExists, (req: Request, res: Response) => {
  res.status(200).json({name : res.locals.name, phone_number : res.locals.phone_number});
});

module.exports = router;