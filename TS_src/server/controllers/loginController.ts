// const bcrypt = require('bcryptjs');
const db = require('../models/whereaboutsModel');
// const SALT_WORK_FACTOR = 10;
// const axios = require('axios');
import { Request, Response, NextFunction } from 'express';

const loginController = {
    // LOGIN component middleware
    checkUserExists: async (req: Request, res: Response, next: NextFunction) => {
      try {
        // check all reqd fields are provided on req body (already checked on FE, so this may not be needed)
        const props = ['phone_number', 'password'];
        console.log(req.body)
        if (!props.every((prop) => Object.hasOwn(req.body, prop))) {
          return next({
            log: 'Express error handler caught loginController.checkUserExists error: Missing phone number or password',
            status: 400,
            message: { error: 'Missing phone number or password' },
          });
        }
    
        // destructure / sanitize req body
        const { phone_number, password } = req.body;
    
        // check that a record for passed phone_number exists in users table
        const queryStrCheck = 'SELECT * FROM users u WHERE u.phone_number=$1';
        const existingUser = await db.query(queryStrCheck, [phone_number]);
        if (!existingUser.rows[0]) {
          return next({
            log: 'Express error handler caught loginController.checkUserExists error: No user exists for input phone number',
            status: 400,
            message: { error: 'No user exists for input phone number' },
          });
        };
    
        // if user exists in users table, compare user-input password with stored hashed password
        // const passwordIsMatch = await bcrypt.compare(
        //   password,
        //   existingUser.rows[0].password
        // );
    
        // if (!passwordIsMatch) {
        //   return next({
        //     log: 'Express error handler caught whereaboutsController.checkUserExists error: Input password is incorrect',
        //     status: 400,
        //     message: { error: 'Input password is incorrect' },
        //   });
        // }

        if (password !== existingUser.rows[0].password) {
          return next({
            log: 'Express error handler caught loginController.checkUserExists error: Input password is incorrect',
            status: 400,
            message: { error: 'Input password is incorrect' },
          });
        }

        // no need to persist data, only success message needed on FE
        // now passing name and phone number for use in chat
        res.locals.name = existingUser.rows[0].name;
        res.locals.phone_number = existingUser.rows[0].phone_number;
        return next();
      } catch (error) {
        return next({
          log: 'Express error handler caught loginController.checkUserExists error',
          status: 500,
          message: { error: 'User login failed' },
          // message: { error: error.stack }, // for more detailed debugging info
        });
      }
    },

        
    // REGISTER component middleware
    insertNewUser: async (req: Request, res: Response, next: NextFunction) => {
      try {
        // check all reqd fields are provided on req body (already checked on FE, so this may not be needed)
        const props = ['name', 'phone_number', 'password'];
    
        if (!props.every((prop) => Object.hasOwn(req.body, prop))) {
          return next({
            log: 'Express error handler caught loginController.insertNewUser error: Missing name, phone number, or password',
            status: 400,
            message: { error: 'Missing name, phone number, or password' },
          });
        }
    
        // destructure / sanitize req body
        const { name, phone_number, password } = req.body;
    
        // check user does NOT already exist in users table
        // const queryStrCheck = 'SELECT * FROM users u WHERE u.phone_number=$1';
        const queryStrCheck = `SELECT * FROM users u WHERE u.phone_number='${phone_number}'`;
        // const existingUser = await db.query(queryStrCheck, [phone_number]);
        const existingUser = await db.query(queryStrCheck);
        if (existingUser.rows[0]) {
          return next({
            log: 'Express error handler caught loginController.insertNewUser error: A user with this phone number already exists',
            status: 409,
            message: { error: 'A user with this phone number already exists' },
          });
        }
    
        // salt+hash user-input password
        // const hashedPassword = await bcrypt.hash(password, SALT_WORK_FACTOR);
        console.log(req.body.password);
        console.log('hello here')
    
        // insert new user's info (inc hashed password) into users table
        // const queryStrInsert = 'INSERT INTO users(name, phone_number, password) VALUES($1, $2, $3) RETURNING *';
        const queryStrInsert = `INSERT INTO users(name, phone_number, password) VALUES('${name}', '${phone_number}', '${password}') RETURNING *`;
    
        // const insertedUser = await db.query(queryStrInsert, [
        //   name,
        //   phone_number,
        //   // hashedPassword,
        //   password,
        // ]);

        const insertedUser = await db.query(queryStrInsert);
    
        // no need to persist data, only success message needed on FE
        // now passing name and phone number for use in chat
        res.locals.name = insertedUser.rows[0].name;
        res.locals.phone_number = insertedUser.rows[0].phone_number;
        return next();
      } catch (error) {
        return next({
          log: 'Express error handler caught loginController.insertNewUser error',
          status: 500,
          message: { error: 'Failed to create new user' },
          // message: { error: error.stack } // for more detailed debugging info
        });
      }
    },
};

module.exports = loginController;