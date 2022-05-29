import express from "express";
import http from "http";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";

import { routesUser } from "./routes/user";
import { routesAsana } from "./routes/asana";
import { routesClass } from "./routes/class";
import { routesAuth } from "./routes/auth";
import { routesSequence } from "./routes/sequence";
import { routesCalendar } from "./routes/calendar";

import { BadRequestError, HttpError, NotFoundError } from "./js/httpError";
import logRequest from "./middleware/logRequest";

// import bucket from "./js/googleStorage";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const baseUrl = process.env.BASE_URL ? process.env.BASE_URL : "";

const app = express();

const PORT = process.env.PORT ?? 3101;

//Set up default mongoose connection
let mongoDB = "mongodb://localhost:27017/yogalesson";
if (process.env.DB_MONGO_ATLAS_PW) {
  console.log("!! Atlas !!");
  mongoDB = `mongodb+srv://tomesde:${process.env.DB_MONGO_ATLAS_PW}@cluster0.gz6ha.mongodb.net/yogalesson?retryWrites=true&w=majority`;
}
mongoose.connect(mongoDB, { useNewUrlParser: true });

//Get the default connection
var db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.on("error", console.error.bind(console, "MongoDB connection error:"));

/** Parse the request */
app.use(express.urlencoded({ extended: false }));
/** Takes care of JSON data */
app.use(
  express.json({
    limit: "50mb"
  })
);

/** middlewares */
app.use(cors());
app.use(morgan("dev"));

app.use(logRequest);

/** Routes */
app.use(`${baseUrl}/user`, routesUser);
app.use(`${baseUrl}/asana`, routesAsana);
app.use(`${baseUrl}/class`, routesClass);
app.use(`${baseUrl}/sequence`, routesSequence);
app.use(`${baseUrl}/calendar`, routesCalendar);
app.use(`${baseUrl}/auth`, routesAuth);
// app.use('/character', routesCharacter);

/** images & co */
// app.use(express.static("public"));

/** Error handling */
app.use((error, req, res, next) => {
  console.log(error);
  let status = 500;
  let errorMsg = "";
  if (error instanceof BadRequestError) {
    status = error.code;
    errorMsg = error.errorObj;
  } else if (error instanceof NotFoundError) {
    status = error.code;
    errorMsg = { error: error.message };
  } else if (error instanceof HttpError) {
    status = error.code;
    errorMsg = { error: error.message };
  } else if (error instanceof Error) {
    errorMsg = { error: error.message };
  } else errorMsg = error;

  console.log("error-middleware", errorMsg);

  return res.status(status).json(errorMsg);
});

// console.log(process.env.DB_CONFIG);

/** Server */
const httpServer = http.createServer(app);

httpServer.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`);
  console.log(`Example: http://localhost:${PORT}${baseUrl}/asana`);
});
