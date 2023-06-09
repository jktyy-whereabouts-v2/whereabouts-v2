import { Request, Response, NextFunction } from 'express';
import twilio from 'twilio';

const twilioController = {
    startTripNotif: async (req: Request, res: Response, next: NextFunction) => {
        // instantiate twilio with twilio SID and token from registering with twilio
        const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN)
        try {
            const { name } = req.query;
            // clean up contacts array to have only phone numbers with formatting needed by twilio API
            const contacts = res.locals.contacts.map((elem: any) => {
                return `+1${elem.phone_number}`
            })

            // iterate over array of contacts and create message for each contact
            for (let i = 0; i < contacts.length; i++) {
                //validation to ensure phone number is correct length for real phone numbers
                if (contacts[i].length == 12) {
                    // send twilio message
                    console.log(`sending a message to ${contacts[i]}`)
                    const message = await client.messages.create({
                        body: `${name} has started a trip with Whereabouts!`,
                        from: process.env.TWILIO_NUMBER,
                        to: contacts[i]
                    })
                }
            }
            console.log('finished sending start trip messages')
            return next()
        } catch (error) {
            console.log(error);
            return next({log: 'error at twilioController.startTripNotif', message: 'error sending start trip messages to user\'s contacts.'})
        }
    },

    endTripNotif: async (req: Request, res: Response, next: NextFunction) => {
        // instantiate twilio with twilio SID and token from registering with twilio
        const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN)
        try {
            const { name } = req.query;
            // clean up contacts array to have only phone numbers with formatting needed by twilio API
            const contacts = res.locals.contacts.map((elem: any) => {
                return `+1${elem.phone_number}`
            })

            // iterate over array of contacts and create message for each contact
            for (let i = 0; i < contacts.length; i++) {
                //validation to ensure phone number is correct length for real phone numbers
                if (contacts[i].length == 12) {
                    // send twilio message
                    console.log(`sending a message to ${contacts[i]}`)
                    const message = await client.messages.create({
                        body: `${name} has arrived safely at their destination with Whereabouts.`,
                        from: process.env.TWILIO_NUMBER,
                        to: contacts[i]
                    })
                }
            }
            console.log('finished sending end trip messages')
            return next()
        } catch (error) {
            console.log(error);
            return next({log: 'error at twilioController.endTripNotif', message: 'error sending end trip messages to user\'s contacts.'})
        }
    },

    sosNotif: async (req: Request, res: Response, next: NextFunction) => {
        const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN)
        try {
            const { name } = req.query;
            // clean up contacts array to have only phone numbers with formatting needed by twilio API
            const contacts = res.locals.contacts.map((elem: any) => {
                return `+1${elem.phone_number}`
            })

            // iterate over array of contacts and create message for each contact
            for (let i = 0; i < contacts.length; i++) {
                //validation to ensure phone number is correct length for real phone numbers
                if (contacts[i].length == 12) {
                    // send twilio message
                    console.log(`sending a message to ${contacts[i]}`)
                    const message = await client.messages.create({
                        body: `${name} is sending an SOS on Whereabouts!`,
                        from: process.env.TWILIO_NUMBER,
                        to: contacts[i]
                    })
                }
            }
            console.log('finished sending end trip messages')
            return next()
        } catch (error) {
            console.log(error);
            return next({log: 'error at twilioController.sosNotif', message: 'error sending sos messages to user\'s contacts.'})
        }
    }


}

export default twilioController;