// const bcrypt = require('bcryptjs');
const db = require('../models/whereaboutsModel');
import { Request, Response, NextFunction } from 'express';

const loginController = {
 // LOGIN component middleware
 checkUserExists: async (req: Request, res: Response, next: NextFunction) => {
  try {
    // destructure / sanitize req body
    const { phone_number, password } = req.body;

    // check that a record for passed phone_number exists in users table
    const queryStrCheck = `SELECT * FROM users u WHERE u.phone_number='${phone_number}'`;
    const existingUser = await db.query(queryStrCheck);
    if (!existingUser.rows[0]) {
      return next({
        log: "Express error handler caught loginController.checkUserExists error: No user exists for input phone number",
        status: 400,
        message: { error: "No user exists for input phone number" },
      });
    }

    if (password !== existingUser.rows[0].password) {
      return next({
        log: "Express error handler caught loginController.checkUserExists error: Input password is incorrect",
        status: 400,
        message: { error: "Input password is incorrect" },
      });
    }

    // no need to persist data, only success message needed on FE
    // now passing name and phone number for use in chat
    res.locals.name = existingUser.rows[0].name;
    res.locals.phone_number = existingUser.rows[0].phone_number;
    return next();
  } catch (error) {
    return next({
      log: "Express error handler caught loginController.checkUserExists error",
      status: 500,
      message: { error: "User login failed" },
      // message: { error: error.stack }, // for more detailed debugging info
    });
  }
}, 
   // REGISTER component middleware
   insertNewUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // destructure / sanitize req body
      const { name, phone_number, password } = req.body;

      // check user does NOT already exist in users table
      // const queryStrCheck = 'SELECT * FROM users u WHERE u.phone_number=$1';
      const queryStrCheck = `SELECT * FROM users u WHERE u.phone_number='${phone_number}'`;
      // const existingUser = await db.query(queryStrCheck, [phone_number]);
      const existingUser = await db.query(queryStrCheck);
      if (existingUser.rows[0]) {
        return next({
          log: "Express error handler caught loginController.insertNewUser error: A user with this phone number already exists",
          status: 409,
          message: { error: "A user with this phone number already exists" },
        });
      }
      const queryStrInsert = `INSERT INTO users(name, phone_number, password) VALUES('${name}', '${phone_number}', '${password}') RETURNING *`;
      const insertedUser = await db.query(queryStrInsert);

      // no need to persist data, only success message needed on FE
      // now passing name and phone number for use in chat
      res.locals.name = insertedUser.rows[0].name;
      res.locals.phone_number = insertedUser.rows[0].phone_number;
      return next();
    } catch (error) {
      console.log(error);
      return next({
        log: "Express error handler caught loginController.insertNewUser error",
        status: 500,
        message: { error: "Failed to create new user" },
      });
    }
  },
}

module.exports = loginController;