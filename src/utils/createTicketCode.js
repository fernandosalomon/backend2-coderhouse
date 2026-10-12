import crypto from "crypto";

export const createReservationCode = () => {
  return `TCK-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
};
