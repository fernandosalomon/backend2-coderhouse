import ticketService from "../services/tickets.services.js";

export const getUserTickets = async (req, res) => {
  const user = req.user;
  try {
    const tickets = await ticketService.ownTickets(user);
    res.status(200).json({ status: "success", payload: tickets });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message ? error.message : "Internal Server Error",
    });
  }
};

export const cancelTicket = async (req, res) => {
  const actor = req.user;
  const tid = req.params.tid;
  try {
    const cancelledTicket = await ticketService.cancel(tid, actor);
    res
      .status(200)
      .json({
        status: "success",
        message: `El ticket ${cancelledTicket.reservationCode} fue cancelado`,
      });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message ? error.message : "Internal Server Error",
    });
  }
};
