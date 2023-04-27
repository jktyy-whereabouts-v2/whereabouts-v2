import { Request, Response, NextFunction } from 'express';
import twilio from 'twilio';

const twilioController = {
    testNotif: async (req: Request, res: Response, next: NextFunction) => {
        // instantiate twilio with twilio SID and token from registering with twilio
        const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN)
        try {
            const message = await client.messages.create({
                body: 'hello from twilio',
                from: process.env.TWILIO_NUMBER,
                to: '+15615813162'
            });
            res.locals.message = message;
            console.log(message);
            return next()
        } catch(error) {
            console.log(error);
            return next({log: 'error at twilioController.testNotif', message: 'problem sending twilio text'})
        }
    },

    startTripNotif: async (req: Request, res: Response, next: NextFunction) => {
        const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN)
        try {
            console.log(res.locals.contacts)
            return next()
        } catch (error) {
            console.log(error);
            return next({log: 'error at twilioController.startTripNotif', message: 'error trying to get list of user\'s contacts.'})
        }
    },

    endTripNotif: async (req: Request, res: Response, next: NextFunction) => {
        const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN)
    },

    sosNotif: async (req: Request, res: Response, next: NextFunction) => {
        const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN)
    }


}

export default twilioController;