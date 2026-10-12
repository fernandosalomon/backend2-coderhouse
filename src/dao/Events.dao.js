import EventModel from "../models/Event.js";

export default class EventsDAO {
  get = (filters, pagination) => {
    pagination.lean = true;
    return EventModel.paginate(filters, pagination);
  };

  getBy = (params) => {
    return EventModel.findOne(params).lean();
  };

  save = (doc) => {
    return EventModel.create(doc);
  };

  update = (id, doc) => {
    return EventModel.findByIdAndUpdate(
      id,
      { $set: doc },
      { returnDocument: "after" },
    );
  };

  delete = (id) => {
    return EventModel.findByIdAndDelete(id);
  };
}
