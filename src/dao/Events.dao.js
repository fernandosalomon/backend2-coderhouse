import EventModel from "../models/Event.js";

export default class EventsDAO {
  get = (params) => {
    return EventModel.find(params);
  };

  getBy = (params) => {
    return EventModel.findOne(params);
  };

  save = (doc) => {
    return EventModel.create(doc);
  };

  update = (id, doc) => {
    return EventModel.findByIdAndUpdate(id, { $set: doc });
  };

  delete = (id) => {
    return EventModel.findByIdAndDelete(id);
  };
}
