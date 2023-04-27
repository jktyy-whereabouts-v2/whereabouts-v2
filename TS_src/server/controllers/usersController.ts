const db = require('../models/whereaboutsModel');
import { Request, Response, NextFunction } from 'express';

const usersController = {
     //get single user by phone number
    getUserByPhoneNumber: async (req: Request, res: Response, next: NextFunction) => {
      try {
        res.locals.user = await db.query(
          `SELECT * FROM users WHERE phone_number = '${req.params.phone_number}'`,
        );
        console.log(res.locals.user);
        return next();
      } catch (error) {
        return next({
          log: 'Express error handler caught usersController.getUserByPhoneNumber error',
          status: 500,
          message: { error: 'Retrieving single user failed' },
        });
      }
    },
};

module.exports = usersController;