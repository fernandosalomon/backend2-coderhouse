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

  async getByFilters(filters, options = {}) {
    const { sort = "date", skip = 0, limit = 10 } = options;
    return EventModel.find(filters)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate("organizer", "first_name last_name email");
  }

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

  async count(filters) {
    return EventModel.countDocuments(filters);
  }
}
