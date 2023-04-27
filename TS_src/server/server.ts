// required modules
require("dotenv").config("./.env");
const http = require("http");
import express, {
  Express,
  NextFunction,
  Request,
  Response,
  ErrorRequestHandler,
} from "express";
const cors = require("cors");
// initialize Server instance of socket.io by passing it HTTP server obj on which to mount the socket server
import { Server } from 'socket.io';
// import routers
const loginRouter = require('./routers/loginRouter');
const registerRouter = require('./routers/registerRouter');
const contactsRouter = require('./routers/contactsRouter');
const usersRouter = require('./routers/usersRouter');
const tripsRouter = require('./routers/tripsRouter');
import authRouter from './routers/authRouter'
import notifRouter from './routers/notifRouter'
// db connection
const db = require("./models/whereaboutsModel");
// define server port
const PORT = 3500;
// import db queries
const dbQuery = require('./models/dbQueries');

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
app.use('/api/users/contacts', contactsRouter);
app.use('/api/users', usersRouter);
app.use('/api/trips', tripsRouter);
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

/* START Implement chat with Socket.io */
// create HTTP server instance
const httpServer = http.createServer(app);
// const httpServer = require('http').Server(app); // app is a handler function supplied to HTTP server

const io = new Server(httpServer, {
  // pingTimeout: 30000, // https://socket.io/docs/v4/troubleshooting-connection-issues/#the-browser-tab-was-minimized-and-heartbeat-has-failed
  cors: {
    origin: ["http://localhost:8080"],
    methods: ["GET", "POST"],
  },
  // path: '/chat',
});

// on connection event (i.e. on connecting to socket server instance), listening for incoming sockets + connecting with React app
io.on("connection", (socket) => {
  console.log("server side connected!");
  // socket.emit sends a message to only the connecting client
  socket.emit("autoMsg", "This message will contain the SOS GMap");
  // broadcast flag will send a message to everyone but the connecting client
  // broadcast when a new user connects to the chat
  socket.broadcast.emit("autoMsg", "I have joined the SOS chat");
  // server listens for new message from any client typing into chat
  socket.on("chatMsg", (msg) => {
    // io.emit sends a message to ALL users on chat
    io.emit("disperseMsg", msg);
    // go to ChatPage.jsx, socket.on('disperseMsg')
  });
  // run when a user disconnects from the chat
  socket.on("disconnect", () => {
    console.log("server side disconnected!");
    // io.emit sends a message to all remaining chat users
    io.emit("autoMsg", "I have left the SOS chat");
    // refreshing chat page disconnects and reconnects socket
    //https://socket.io/docs/v4/troubleshooting-connection-issues/#problem-the-socket-gets-disconnected
  });
});
/* END Implement chat with Socket.io */

// listening on HTTP server!
httpServer.listen(PORT, () =>
  console.log(`Currently listening on port: ${PORT}`)
);

module.exports = app;
