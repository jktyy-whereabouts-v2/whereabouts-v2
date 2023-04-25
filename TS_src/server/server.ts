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
const session = require('express-session');
// import router
const apiRouter = require('./routers/apiRouter');
import authRouter from './routers/authRouter'
// db connection
const db = require("./models/whereaboutsModel");
// define server port
const PORT = 3500;

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
app.use('/api', apiRouter);
app.use('/auth', authRouter);

// implement express sessions here
// app.use(session({
// 	secret: 'mysecret',
// 	resave: false,
// 	saveUninitialized: true,
// 	cookie: {
// 		secure: false,
// 		maxAge: 300000
// 	}
// }))

/* START Implement SSE server-side to regularly stream trips data back to FE */
const dbQuery = async (phoneNumber: string) => {
  const { rows } = await db.query(`
    SELECT t.start_timestamp, t.start_lat, t.start_lng, t.sos_timestamp, t.sos_lat, t.sos_lng, t.end_timestamp,j.trips_id, jt.user_phone_number AS traveler_phone_number, u.name AS traveler_name
    FROM trips t
    INNER JOIN trips_users_join j ON t.id = j.trips_id
    INNER JOIN trips_users_join jt ON t.id = jt.trips_id
    INNER JOIN users u ON jt.user_phone_number = u.phone_number
    WHERE j.user_phone_number = '${phoneNumber}'
    AND j.user_is_traveler = FALSE
    AND jt.user_is_traveler = TRUE
    ORDER BY t.end_timestamp DESC, t.sos_timestamp ASC, j.trips_id DESC
  `);
  // console.log(rows);
  // const trips = [];
  // rows.map(row => trips.push(row.trips_id));
  // const {rows : travelers } = await db.query(`
  //   SELECT j.trips_id, u.name as traveler, u.phone_number as traveler_phone_number
  //   FROM trips_users_join j
  //   INNER JOIN users u ON u.phone_number = j.user_phone_number
  //   WHERE j.trips_id IN (${trips})
  //   AND j.user_is_traveler = TRUE
  // `);
  // console.log(travelers);

  return rows;
};

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
      console.log("before rows");
      const rows = await dbQuery(phoneNumber);
      console.log(rows);
      console.log("after rows");
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
