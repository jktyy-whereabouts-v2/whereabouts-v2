import { Router, Request, Response } from 'express';
const chatController = require('../controllers/chatController');
const router = Router();

router.get('/conversations/:phone_number', chatController.getConversations, (req: Request, res: Response) => {
	res.status(200).json(res.locals.conversations);
});

router.get('/messages/:conv_id', chatController.getMessages, (req: Request, res: Response) => {
	res.status(200).json(res.locals.messages);
});

router.post('/messages', chatController.addMessage, (req: Request, res: Response) => {
	res.sendStatus(204);
});

router.get('/convContact/user/:user_number/contact/:contact_number', chatController.openConversation, (req: Request, res: Response) => {
	res.status(200).json(res.locals.openedConv);
});

module.exports = router;