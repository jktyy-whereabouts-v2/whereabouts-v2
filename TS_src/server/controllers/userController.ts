// const bcrypt = require('bcryptjs');
const db = require('../models/whereaboutsModel');
// const SALT_WORK_FACTOR = 10;
// const axios = require('axios');
import { Request, Response, NextFunction } from 'express';

const userController = {
    //get single user by phone number
    getUserByPhoneNumber: async (req: Request, res: Response, next: NextFunction) => {
      try {
        res.locals.user = await db.query(
          `SELECT * FROM users WHERE phone_number=$1`,
          [req.params['phone_number']]
        );
        return next();
      } catch (error) {
        return next({
          log: 'Express error handler caught whereaboutsController.getUserByPhoneNumber error',
          status: 500,
          message: { error: 'Retrieving single user failed' },
        });
      }
    },
};

module.exports = userController;