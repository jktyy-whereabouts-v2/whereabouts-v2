import { Router, Request, Response, NextFunction } from 'express';
import twilioController from '../controllers/twilioController'
const contactsController = require('../controllers/contactsController');
const router = Router();

router.get('/', twilioController.testNotif, (req: Request, res: Response) => {
    return res.status(200).json(res.locals.message)
})

router.get('/startNotif/', contactsController.getContacts, twilioController.startTripNotif, (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json('sent start trip text')
})

router.get('/endNotif', contactsController.getContacts, twilioController.endTripNotif, (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json('sent end trip text')
})

router.get('/sosNotif', contactsController.getContacts, twilioController.sosNotif, (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json('sent sos text')
})


export default router;