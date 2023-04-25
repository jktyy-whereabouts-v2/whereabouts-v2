// required modules
require('dotenv').config('./.env')

import express, { Express, NextFunction, Request, Response, ErrorRequestHandler } from 'express';
import { createServer } from "http";
import { Server, Socket } from "socket.io";
const cors = require('cors');
// import router
const apiRouter = require('./routers/apiRouter');
// db connection
const db = require('./models/whereaboutsModel');
// define server port
const PORT = 3500;
import { User } from '../client/src/components/types';

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

/* START Implement SSE server-side to regularly stream trips data back to FE */
const dbQuery = async (phoneNumber:string) => {
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

app.get('/stream/:phone_number', (req: Request, res: Response) => {
	const phoneNumber = req.params.phone_number;
	if (req.headers.accept === 'text/event-stream') {
		// console.log('accept/content type is event-stream');
		res.writeHead(200, {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache',
			Connection: 'keep-alive',
			// 'Access-Control-Allow-Origin': '*',
		});
		setInterval(async () => {
			const rows = await dbQuery(phoneNumber);
			res.write(`data: ${JSON.stringify(rows)}\n\n`);
		}, 1000);
	} else {
		res.json({ message: 'Ok' });
	}
});
/* END Implement SSE server-side to regularly stream trips data back to FE */

// catch-all route handler for any requests to an unknown route
app.use((req, res) => res.status(404).send("This is not the page you're looking for..."));

// global error handler
app.use((err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
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


const httpServer = createServer();
const io = new Server(httpServer, {
  // ...
	cors: {
		origin: ['http://localhost:3000'],
		methods: ['GET', 'POST'],
	},
});

io.on("connection", (socket: Socket) => {
  socket.on('join', (data) => {
		socket.join(data.phone_number);
	})
	socket.on('send_message', ({ contacts, message }) => {
		contacts.forEach((contact: User) => {
			socket.to(contact.phone_number).emit('receive_message', message);
		})
	})
});

httpServer.listen(3001);


app.listen(PORT);

module.exports = app;
