const db = require('../models/whereaboutsModel');
import { Request, Response, NextFunction } from 'express';
import { Message } from '../../client/src/components/types';

const chatController = {
  // retrieves all the conversation of a user
  getConversations: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await db.query(`
      SELECT conv_id AS convid,  u1.name AS member1Name, u1.phone_number AS member1Phone, u2.name AS member2Name, u2.phone_number AS member2Phone
      FROM conversations  c
      JOIN users u1 ON c.member_1 = u1.phone_number
      JOIN users u2 ON c.member_2 = u2.phone_number
      WHERE c.member_1 = '${req.params.phone_number}'
      OR c.member_2 = '${req.params.phone_number}';
      `);
      res.locals.conversations = response.rows;
      return next();
    } catch(error) {
      return next({
        log: 'Express error handler caught chatController.getConversations error',
        status: 500,
        message: { error: 'Retrieving conversations of current user failed' },
      });
    }
  },

  // retrieves all the messages for a given conversation id
  getMessages: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const conv_id = Number(req.params.conv_id);
      const response = await db.query(`
      SELECT msg_id, u2.name AS sendername, u2.phone_number AS senderphone, text, u1.name as receivername, u1.phone_number as receiverphone, m.conv_id as convid, time_stamp as timestamp
      FROM messages m
      JOIN users u1 ON m.receiver = u1.phone_number
      JOIN users u2 on m.sender = u2.phone_number
      INNER JOIN conversations
      ON m.conv_id = ${conv_id}
      ORDER BY time_stamp ASC;
      `);
      const uniqueMsg: any = [];
      for(const msg1 of response.rows) {
        let count = 0;
        for(const msg2 of uniqueMsg) {
          if(msg1.msg_id === msg2.msg_id) count++;
        } 
        if(count === 0) uniqueMsg.push(msg1);
      }
      res.locals.messages = uniqueMsg.map((msg: any) => ({
        sendername: msg.sendername,
        senderphone: msg.senderphone,
        text: msg.text,
        receivername: msg.receivername,
        receiverphone: msg.receiverphone,
        convid: msg.convid,
        timestamp: msg.timestamp
      }));
      return next();
    } catch(error) {
      return next({
        log: 'Express error handler caught chatController.getMessages error',
        status: 500,
        message: { error: 'Retrieving messages of current conversation failed' },
      });
    }
  },

  // adding a new message to a conversation specified by the conversation id
  addMessage: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newMessage: Message = req.body;
      await db.query(`
      INSERT INTO messages
      (sender, text, receiver, conv_id, time_stamp)
      VALUES ('${newMessage.senderphone}', '${newMessage.text}', '${newMessage.receiverphone}', ${newMessage.convid}, ${newMessage.timestamp});
      `);
      return next();
    } catch(error) {
      return next({
        log: 'Express error handler caught chatController.addMessage error',
        status: 500,
        message: { error: 'Adding message to current conversation failed' },
      });
    }
  },

  // opens a saved conversation b/w 2 users, or opens a new one if it does not already exist
  openConversation: async (req: Request, res: Response, next: NextFunction) => {
    try {
      let response = await db.query(`
      SELECT conv_id AS convid,  u1.name AS member1name, u1.phone_number AS member1phone, u2.name AS member2name, u2.phone_number AS member2phone
      FROM conversations  c
      JOIN users u1 ON c.member_1 = u1.phone_number
      JOIN users u2 ON c.member_2 = u2.phone_number
      WHERE c.member_1 = '${req.params.user_number}' AND c.member_2 = '${req.params.contact_number}' 
      OR c.member_2 = '${req.params.user_number}' AND c.member_1 = '${req.params.contact_number}';
      `);
      if(!response.rows[0]) response = await db.query(`
      INSERT INTO conversations
      (member_1, member_2)
      VALUES ('${req.params.user_number}', '${req.params.contact_number}')
      RETURNING *;
      `);
      res.locals.openedConv = response.rows[0];
      return next();
    } catch(error) {
      return next({
        log: 'Express error handler caught chatController.openConversation error',
        status: 500,
        message: { error: 'Opening a conversation has failed' },
      });
    }
  }
};

module.exports = chatController;