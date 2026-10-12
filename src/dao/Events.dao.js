import EventModel from "../models/Event.js";

export default class EventsDAO {
  get = (filters, pagination) => {
    pagination.lean = true;
    pagination.populate = "organizer";
    return EventModel.paginate(filters, pagination);
  };

  getBy = (params) => {
    return EventModel.findOne(params).populate("organizer").lean();
  };

  save = async (doc) => {
    const event = await EventModel.create(doc);
    return event.populate("organizer");
  };

  update = (id, doc) => {
    return EventModel.findByIdAndUpdate(
      id,
      { $set: doc },
      { returnDocument: "after" },
    ).populate("organizer");
  };

  delete = (id) => {
    return EventModel.findByIdAndUpdate(id, { status: "cancelled" });
  };
}
