import { Router, Request, Response, NextFunction } from 'express';
import twilioController from '../controllers/twilioController'
const usersController = require('../controllers/usersController');
const router = Router();

router.get('/', twilioController.testNotif, (req: Request, res: Response) => {
    return res.status(200).json(res.locals.message)
})

router.get('/startNotif/:phone_number', usersController.getUserByPhoneNumber, twilioController.startTripNotif, (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json('finished test')
})


export default router;