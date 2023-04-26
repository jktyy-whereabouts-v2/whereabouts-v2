import { Router, Request, Response } from 'express';
const passport = require('passport')
const authController = require('../controllers/authController')
const router = Router();


// handle route to initiate google oauth login
router.get('/google/oauth', 
    passport.authenticate('google', { scope: ['email', 'profile'] }), 
    (req: Request, res: Response) => {
        return res.status(200).json('logging in through google')
})

//define route for the oauth callback URI and set redirects on success/failure 
router.get('/google/callback', 
    passport.authenticate('google', {
        successRedirect: 'http://localhost:3000/dashboard',
        failureRedirect: 'http://localhost:3000/login',
        session: false,
    }),
    authController.serializeUser, 
    (req: Request, res: Response) => {

    return res.redirect('http://localhost:3000/dashboard')
})

export default router;