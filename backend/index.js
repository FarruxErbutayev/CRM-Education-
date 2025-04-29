import express from "express";
import dotenv from "dotenv";
import cron from "node-cron";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

// session
import pgsession from "connect-pg-simple";
import session from "express-session";

const PgSession = pgsession(session);

dotenv.config();

import Apeal from "./Routers/Apeal/index.js";
import Calendar from "./Routers/Calendar/index.js";
import CalendarNotification from "./Routers/Notification/index.js";
import pupil from "./Routers/pupils/index.js";
import Admin from "./Routers/Admin/index.js";
import courses from "./Routers/courses/index.js";
import groups from "./Routers/groups/index.js";
import debtors from "./Routers/debtors/index.js";
import schedule from "./Routers/schedule/index.js";
import pool from "./functions/datatabase.js";
global.pool = pool;

(async () => {
  try {
    await pool.connect();
    console.log("Connected to the database");
  } catch (error) {
    console.log("Database error", error);
  }
})();

const app = express();
app.use(cors());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10000,
  message: "Ataka o`xshamadimi ?",
});
app.use(limiter);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(
  session({
    store: new PgSession({
      pool: global.pool,
      tableName: "session",
    }),
    secret: process.env.session,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 4 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
    },
  })
);

app.use(express.static("./static"));

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      status: 400,
      message: "Invalid JSON format",
      error: err.message,
    });
  }
  next(err);
});

Admin.forEach((element) => {
  app.use(`/admin${element.path}`, element.route);
});

debtors.forEach((element) => {
  app.use(`/debtors${element.path}`, element.route);
});

courses.forEach((element) => {
  app.use(`/courses${element.path}`, element.route);
});

schedule.forEach((element) => {
  app.use(`/schedule${element.path}`, element.route);
});

groups.forEach((element) => {
  app.use(`/groups${element.path}`, element.route);
});

Apeal.forEach((element) => {
  app.use(`/apeal${element.path}`, element.route);
});

Calendar.forEach((element) => {
  app.use(`/calendar${element.path}`, element.route);
});

CalendarNotification.forEach((element) => {
  app.use(`/notification${element.path}`, element.route);
}); 

// another routers
import addApeal from "./Routers/Apeal/add.js";
import teacher from "./Routers/teacher/index.js";

app.use("/addApeal", addApeal);

teacher.forEach((element) => {
  app.use(`/teachers${element.path}`, element.route);
});

pupil.forEach((element) => {
  app.use(`/pupil${element.path}`, element.route);
});
pupil.forEach((element) => {
  app.use(`/schedule${element.path}`, element.route);
});
cron.schedule("0 1 * * *", async () => {
  try {
    await global.pool.query(`delete FROM public.session`);
    console.log("Session is cleaned!");
  } catch (error) {}
});

const server = http.createServer(app);
server.listen(process.env.PORT, function () {
  console.log("Server is running on:", process.env.PORT);
});
