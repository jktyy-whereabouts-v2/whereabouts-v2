// required modules
require("dotenv").config("./.env");
import express, {
  Express,
  NextFunction,
  Request,
  Response,
  ErrorRequestHandler,
} from "express";
// import routers
const loginRouter = require('./routers/loginRouter');
const registerRouter = require('./routers/registerRouter');
const contactsRouter = require('./routers/contactsRouter');
const usersRouter = require('./routers/usersRouter');
const tripsRouter = require('./routers/tripsRouter');
const chatRouter = require('./routers/chatRouter');
import authRouter from './routers/authRouter'
import notifRouter from './routers/notifRouter'
// db connection
const db = require("./models/whereaboutsModel");
// define server port
const PORT = 3500;
// import db queries
const dbQuery = require('./models/dbQueries');

const cors = require("cors");
// create express server instance
const app: Express = express();

// handle parsing request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// enable cors on all incoming requests
app.use(cors()); // allows communication between different domains

// handle requests for static files
// app.use(express.static(path.resolve(__dirname, '../client')));

// define route handler
app.use('/api/login', loginRouter);
app.use('/api/register', registerRouter);
app.use('/api/contacts', contactsRouter);
app.use('/api/users', usersRouter);
app.use('/api/trips', tripsRouter);
app.use('/api/chat', chatRouter);
app.use('/auth', authRouter);
app.use('/api/notif', notifRouter);

app.get("/stream/:phone_number", (req: Request, res: Response) => {
  const phoneNumber = req.params.phone_number;
  if (req.headers.accept === "text/event-stream") {
    // console.log('accept/content type is event-stream');
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      // 'Access-Control-Allow-Origin': '*',
    });
    setInterval(async () => {
      const rows = await dbQuery(phoneNumber);
      res.write(`data: ${JSON.stringify(rows)}\n\n`);
    }, 1000);
  } else {
    res.json({ message: "Ok" });
  }
});
/* END Implement SSE server-side to regularly stream trips data back to FE */

// catch-all route handler for any requests to an unknown route
app.use((req, res) =>
  res.status(404).send("This is not the page you're looking for...")
);

// global error handler
app.use((err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
	console.log(err)
	const defaultErr = {
		log: 'Express error handler caught unknown middleware error.',
		status: 500,
		message: {
			err: 'An error occurred. We inside global error handler. BUT WHY?',
		},
	};
	const errorObj = { ...defaultErr, ...err };
	console.log(errorObj.log);
	return res.status(errorObj.status).json(errorObj.message);
});


app.listen(PORT);

module.exports = app;

// socket.io for chatPage

const http = require("http");
// initialize Server instance of socket.io by passing it HTTP server obj on which to mount the socket server
import { Server, Socket } from 'socket.io';
import { Message } from '../client/src/components/types';

interface SocketUser {
  phoneNumber: string;
  socketId: string;
};

const httpServer = http.createServer();
let users: SocketUser[] = [];

// adding user to the array of active users, if not already added
const addUser = (phoneNumber: string, socketId: string) => {
  let userFound = false;
  users.forEach((user: SocketUser) => {
    // if user found, update socketId
    if(user.phoneNumber === phoneNumber) {
      user.socketId = socketId;
      userFound = true;
    }
  })
  if(!userFound) users.push({
    phoneNumber,
    socketId
  })
};

// removing user from the array of active users
const deleteUser = (socketId: string) => {
  users = users.filter((user: SocketUser) => {
    return user.socketId !== socketId;
  });
};

// retrieving the socketId of the user upon receipt of their phone number
const getUser = (phoneNumber: string) => {
  for(let user of users) {
    if(user.phoneNumber === phoneNumber) return user;
  }
};

const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST'],
  },
});

io.on("connection", (socket: Socket) => {
  socket.on('addUser', phoneNumber => {
    addUser(phoneNumber, socket.id);
  });
  socket.on('sendMessage', ({ sendername, senderphone, receivername, receiverphone, text, convid, timestamp }: Message) => {
    const user = getUser(receiverphone);
    if(user) io.to(user.socketId).emit('getMessage', {
      sendername,
      senderphone,
      receivername,
      receiverphone,
      text,
      convid,
      timestamp
    })
  });
  socket.on('disconnect', () => {
    deleteUser(socket.id)
  });
});

httpServer.listen(3001);