import EventModel from "../models/Event.js";

export default class EventsDAO {
  async getAll(filterQuery = {}, paginationOptions = {}) {
    const {
      page = 1,
      limit = 10,
      sort = { createdAt: -1 },
    } = paginationOptions;

    return await EventModel.paginate(filterQuery, {
      page,
      limit,
      sort,
      populate: {
        path: "organizer",
        select: "first_name last_name email",
      },
      lean: true,
    });
  }

  async getOne(query) {
    return await EventModel.findOne(query).populate(
      "organizer",
      "first_name last_name email",
    );
  }

  async save(doc) {
    const event = await EventModel.create(doc);
    return event.populate("organizer", "first_name last_name email");
  }

  async update(id, doc) {
    return EventModel.findByIdAndUpdate(
      id,
      { $set: doc },
      { returnDocument: "after" },
    ).populate("organizer");
  }

  async count(filters) {
    return EventModel.countDocuments(filters);
  }
}
