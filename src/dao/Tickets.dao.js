import TicketModel from "../models/Ticket.js";

export default class TicketsDAO {
  async getById(tid) {
    return TicketModel.findOne({ _id: tid })
      .populate("user", "first_name last_name email")
      .populate("event", "title date location")
      .lean();
  }

  async save(doc) {
    const ticket = await TicketModel.create(doc);
    ticket.populate("user");
    ticket.populate("event");
    return ticket;
  }

  async update(id, doc) {
    return TicketModel.findByIdAndUpdate(
      id,
      { $set: doc },
      { returnDocument: "after" },
    );
  }

  async findByUser(userId) {
    return TicketModel.find({ user: userId })
      .populate("user", "first_name last_name email")
      .populate("event", "title date location")
      .lean();
  }

  async findByEvent(eventId, options) {
    const { sort = "createdAt", skip = 0, limit = 10 } = options;
    return TicketModel.paginate(
      { event: eventId },
      {
        sort,
        skip,
        limit,
        populate: [
          {
            path: "user",
            select: "first_name last_name email",
          },
          {
            path: "event",
            select: "title date location",
          },
        ],
      },
    );
  }

  async findActiveByUserAndEvent(userId, eventId) {
    return TicketModel.findOne({
      user: userId,
      event: eventId,
      status: { $in: ["confirmed", "pending"] },
    })
      .populate("user", "first_name last_name email")
      .populate("event", "title date location")
      .lean();
  }

  async getReservedQuantityByEvent(eventId) {
    const result = await TicketModel.aggregate([
      {
        $match: {
          event: eventId,
          status: { $in: ["confirmed", "pending"] },
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
