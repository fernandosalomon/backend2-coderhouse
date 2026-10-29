import nodemailer from "nodemailer";
import { config } from "../config/env.config.js";

export const sendMail = async ({ to, subject, text }) => {
  return transport.sendMail({
    from: config.mail.from,
    to,
    subject,
    text,
  });
};

const transport = nodemailer.createTransport({
  host: config.mail.host,
  port: config.mail.port,
  auth: {
    user: config.mail.user,
    pass: config.mail.pass,
  },
});
