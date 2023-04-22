import { Router, Request, Response } from 'express';
const tripsController = require('../controllers/tripsController');
const router = Router();

//start new trip
router.post('/start', tripsController.startNewTrip, (req: Request, res: Response) => {
  res.sendStatus(204);
});

//get my current trip
router.get('/my', tripsController.myTrip, (req: Request, res: Response) => {
  const { rows } = res.locals.trip;
  res.status(200).json(rows);
});

//send SOS alert
router.post('/sos', tripsController.sendSos, (req: Request, res: Response) => {
  res.sendStatus(204);
});

//end trip
router.post('/reached', tripsController.endTrip, (req: Request, res: Response) => {
  res.sendStatus(204);
});

module.exports = router;