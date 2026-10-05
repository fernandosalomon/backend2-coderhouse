import nodemailer from "nodemailer";
import {
  MAIL_FROM,
  MAIL_HOST,
  MAIL_PASS,
  MAIL_PORT,
  MAIL_USER,
} from "../config/env.config.js";

export const sendMail = async ({ to, subject, text }) => {
  return transport.sendMail({
    from: MAIL_FROM,
    to,
    subject,
    text,
  });
};

const transport = nodemailer.createTransport({
  host: MAIL_HOST,
  port: MAIL_PORT,
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS,
  },
});
