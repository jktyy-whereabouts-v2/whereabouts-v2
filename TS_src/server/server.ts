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
import authRouter from './routers/authRouter'
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
app.use('/auth', authRouter);

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


app.listen(PORT);

module.exports = app;