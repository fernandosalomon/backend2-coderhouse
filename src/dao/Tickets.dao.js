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

  save = (doc) => {
    return TicketModel.create(doc);
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
}
