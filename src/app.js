import express from "express";
import { app } from "./server.js";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

