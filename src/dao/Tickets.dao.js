import TicketModel from "../models/Ticket.js";

export default class TicketsDAO {
  get = (params) => {
    return TicketModel.find(params)
      .populate("user", "first_name last_name email")
      .populate("event", "title date location")
      .lean();
  };

  getBy = (params) => {
    return TicketModel.findOne(params)
      .populate("user", "first_name last_name email")
      .populate("event", "title date location")
      .lean();
  };

  save = async (doc) => {
    const ticket = await TicketModel.create(doc);
    ticket.populate("user");
    ticket.populate("event");
    return ticket;
  };

  update = (id, doc) => {
    return TicketModel.findByIdAndUpdate(
      id,
      { $set: doc },
      { returnDocument: "after" },
    );
  };

  aggregate = (params) => {
    return TicketModel.aggregate(params);
  };

  delete = (id) => {
    return TicketModel.findByIdAndDelete(id);
  };

  async findActiveByUserAndEvent(userId, eventId) {
    return TicketModel.findOne({
      user: userId,
      event: eventId,
      status: "active",
    });
  }
  
  async getReservedQuantityByEvent(eventId) {
    const result = await TicketModel.aggregate([
      {
        $match: {
          event: eventId,
          status: "active",
        },
      },
      {
        $group: {
          _id: "$event",
          totalReserved: {
            $sum: "$quantity",
          },
        },
      },
    ]);
    return result[0]?.totalReserved || 0;
  }
}
