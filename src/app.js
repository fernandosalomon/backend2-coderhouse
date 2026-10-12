import express from "express";
import { app } from "./server.js";
import healthRouter from "./routes/health.router.js";
import eventsRouter from "./routes/events.router.js";
import sessionsRouter from "./routes/sessions.router.js";
import usersRouter from "./routes/users.router.js";
import ticketsRouter from "./routes/tickets.router.js";
import cookieParser from "cookie-parser";
import { COOKIE_SECRET } from "./config/env.config.js";
import passport from "passport";
import { initPassport } from "./config/passport.config.js";
import { errorHandler } from "./middlewares/errorHandler.js";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(COOKIE_SECRET));
app.use(passport.initialize());
initPassport();

app.use("/api/health", healthRouter);
app.use("/api/events", eventsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/users", usersRouter);
app.use("/api/tickets", ticketsRouter);

app.use(errorHandler);
