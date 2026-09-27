import express from "express";
import { app } from "./server.js";
import healthRouter from "./routes/health.router.js";
import eventsRouter from "./routes/events.router.js";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/health", healthRouter);
app.use("/api/events", eventsRouter);