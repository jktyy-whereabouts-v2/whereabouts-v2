"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var http = require("http");
var express_1 = require("express");
var cors = require('cors');
var dotenv = require("dotenv");
dotenv.config();
// import router
var apiRouter = require('./routes/api');
// db connection
var db = require('./models/whereaboutsModel');
// define server port
var PORT = 3500;
// create express server instance
var app = (0, express_1["default"])();
// enable cors on all incoming requests
app.use(cors()); // allows communication between different domains
// handle parsing request body
app.use(express_1["default"].json());
app.use(express_1["default"].urlencoded({ extended: true }));
// handle requests for static files
// app.use(express.static(path.resolve(__dirname, '../client')));
// define route handler
app.use('/api', apiRouter);
/* START Implement SSE server-side to regularly stream trips data back to FE */
var dbQuery = function (phoneNumber) { return __awaiter(void 0, void 0, void 0, function () {
    var rows;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db.query("\n    SELECT t.start_timestamp, t.start_lat, t.start_lng, t.sos_timestamp, t.sos_lat, t.sos_lng, t.end_timestamp,j.trips_id, jt.user_phone_number AS traveler_phone_number, u.name AS traveler_name\n    FROM trips t\n    INNER JOIN trips_users_join j ON t.id = j.trips_id\n    INNER JOIN trips_users_join jt ON t.id = jt.trips_id\n    INNER JOIN users u ON jt.user_phone_number = u.phone_number\n    WHERE j.user_phone_number = '".concat(phoneNumber, "'\n    AND j.user_is_traveler = FALSE\n    AND jt.user_is_traveler = TRUE\n    ORDER BY t.end_timestamp DESC, t.sos_timestamp ASC, j.trips_id DESC\n  "))];
            case 1:
                rows = (_a.sent()).rows;
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
                return [2 /*return*/, rows];
        }
    });
}); };
app.get('/stream/:phone_number', function (req, res) {
    var phoneNumber = req.params.phone_number;
    if (req.headers.accept === 'text/event-stream') {
        // console.log('accept/content type is event-stream');
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive'
        });
        setInterval(function () { return __awaiter(void 0, void 0, void 0, function () {
            var rows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, dbQuery(phoneNumber)];
                    case 1:
                        rows = _a.sent();
                        res.write("data: ".concat(JSON.stringify(rows), "\n\n"));
                        return [2 /*return*/];
                }
            });
        }); }, 1000);
    }
    else {
        res.json({ message: 'Ok' });
    }
});
/* END Implement SSE server-side to regularly stream trips data back to FE */
// catch-all route handler for any requests to an unknown route
app.use(function (req, res) { return res.status(404).send("This is not the page you're looking for..."); });
// global error handler
app.use(function (err, req, res, next) {
    var defaultErr = {
        log: 'Express error handler caught unknown middleware error.',
        status: 500,
        message: {
            err: 'An error occurred. We inside global error handler. BUT WHY?'
        }
    };
    var errorObj = __assign(__assign({}, defaultErr), err);
    console.log(errorObj.log);
    return res.status(errorObj.status).json(errorObj.message);
});
/* START Implement chat with Socket.io */
// create HTTP server instance
var httpServer = http.createServer(app);
// const httpServer = require('http').Server(app); // app is a handler function supplied to HTTP server
// initialize new Server instance of socket.io by passing it HTTP server obj on which to mount the socket server
var Server = require('socket.io').Server;
var io = new Server(httpServer, {
    // pingTimeout: 30000, // https://socket.io/docs/v4/troubleshooting-connection-issues/#the-browser-tab-was-minimized-and-heartbeat-has-failed
    cors: {
        origin: ['http://localhost:8080'],
        methods: ['GET', 'POST']
    }
});
// on connection event (i.e. on connecting to socket server instance), listening for incoming sockets + connecting with React app
io.on('connection', function (socket) {
    console.log('server side connected!');
    // socket.emit sends a message to only the connecting client
    socket.emit('autoMsg', 'This message will contain the SOS GMap');
    // broadcast flag will send a message to everyone but the connecting client
    // broadcast when a new user connects to the chat
    socket.broadcast.emit('autoMsg', 'I have joined the SOS chat');
    // server listens for new message from any client typing into chat
    socket.on('chatMsg', function (msg) {
        // io.emit sends a message to ALL users on chat
        io.emit('disperseMsg', msg);
        // go to ChatPage.jsx, socket.on('disperseMsg')
    });
    // run when a user disconnects from the chat
    socket.on('disconnect', function () {
        console.log('server side disconnected!');
        // io.emit sends a message to all remaining chat users
        io.emit('autoMsg', 'I have left the SOS chat');
        // refreshing chat page disconnects and reconnects socket
        //https://socket.io/docs/v4/troubleshooting-connection-issues/#problem-the-socket-gets-disconnected
    });
});
/* END Implement chat with Socket.io */
// listening on HTTP server!
httpServer.listen(PORT, function () { return console.log("Currently listening on port: ".concat(PORT)); });
module.exports = app;
