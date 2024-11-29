import express from 'express';
import userRouter from './routes/user.routes.js';
import adminRouter from './routes/admin.routes.js';
import authorRouter from "./routes/author.routes.js"
import chapterRouter from "./routes/chapter.routes.js"
import cookieParser from 'cookie-parser';
import logEvent from './utils/logEvent.js';
import cors from "cors"
import EventEmmiter from "events"
import { ErrorAPI } from './utils/ErrorAPI.js';
const app = express();


//!logEvent Emmiter
// --------------------------------
class Emmiter extends EventEmmiter { }
const myEmitter = new Emmiter()
myEmitter.on("log", (msg, filename) => logEvent(msg, filename))
// --------------------------------
app.use(cors())
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.json({ limit: '16kb' }));
app.use(cookieParser());
app.use('/api/v1/users', userRouter);
app.use("/api/v1/authors", authorRouter)
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/chapters', chapterRouter);

app.get("/", (req, res) => {
  res.send("server is working")

})


app.use((err, req, res, next) => {
  let { statusCode = 500, message } = err;
  // console.log("appError", err)
  console.log(message)
  myEmitter.emit("log", `Error:- (${err.name}) ${err.message}`, "errLog.txt")
  res.status(statusCode).json(new ErrorAPI(statusCode, message));
});
export { app };
