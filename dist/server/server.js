"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// required modules
const http = __importStar(require("http"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
// initialize Server instance of socket.io by passing it HTTP server obj on which to mount the socket server
const socket_io_1 = require("socket.io");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
// import router
const apiRouter = require('./routes/api');
// db connection
const db = require('./models/whereaboutsModel');
// define server port
const PORT = 3500;
// create express server instance
const app = (0, express_1.default)();
// handle parsing request body
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// enable cors on all incoming requests
app.use((0, cors_1.default)()); // allows communication between different domains
// handle requests for static files
// app.use(express.static(path.resolve(__dirname, '../client')));
// define route handler
app.use('/api', apiRouter);
/* START Implement SSE server-side to regularly stream trips data back to FE */
const dbQuery = async (phoneNumber) => {
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
app.get('/stream/:phone_number', (req, res) => {
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
    }
    else {
        res.json({ message: 'Ok' });
    }
});
/* END Implement SSE server-side to regularly stream trips data back to FE */
// catch-all route handler for any requests to an unknown route
app.use((req, res) => res.status(404).send("This is not the page you're looking for..."));
// global error handler
app.use((err, req, res, next) => {
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
const io = new socket_io_1.Server(httpServer, {
    // pingTimeout: 30000, // https://socket.io/docs/v4/troubleshooting-connection-issues/#the-browser-tab-was-minimized-and-heartbeat-has-failed
    cors: {
        origin: ['http://localhost:8080'],
        methods: ['GET', 'POST'],
    },
    // path: '/chat',
});
// on connection event (i.e. on connecting to socket server instance), listening for incoming sockets + connecting with React app
io.on('connection', (socket) => {
    console.log('server side connected!');
    // socket.emit sends a message to only the connecting client
    socket.emit('autoMsg', 'This message will contain the SOS GMap');
    // broadcast flag will send a message to everyone but the connecting client
    // broadcast when a new user connects to the chat
    socket.broadcast.emit('autoMsg', 'I have joined the SOS chat');
    // server listens for new message from any client typing into chat
    socket.on('chatMsg', (msg) => {
        // io.emit sends a message to ALL users on chat
        io.emit('disperseMsg', msg);
        // go to ChatPage.jsx, socket.on('disperseMsg')
    });
    // run when a user disconnects from the chat
    socket.on('disconnect', () => {
        console.log('server side disconnected!');
        // io.emit sends a message to all remaining chat users
        io.emit('autoMsg', 'I have left the SOS chat');
        // refreshing chat page disconnects and reconnects socket
        //https://socket.io/docs/v4/troubleshooting-connection-issues/#problem-the-socket-gets-disconnected
    });
});
/* END Implement chat with Socket.io */
// listening on HTTP server!
httpServer.listen(PORT, () => console.log(`Currently listening on port: ${PORT}`));
module.exports = app;
