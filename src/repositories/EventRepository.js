import BaseRepository from "./BaseRepository.js";

export default class EventRepository extends BaseRepository {
  constructor(dao) {
    super(dao);
  }

  getById = (eid) => {
    return this.getBy({ _id: eid });
  }

  async getEventById(id) {
    return eventDAO.getById(id)
  }
  async getEventsByFilters(filters, options) {
    return eventDAO.getByFilters(filters, options)
  }
  async countEvents(filters) {
    return eventDAO.count(filters)
  }
  async createEvent(data) {
    return eventDAO.create(data)
  }
  async updateEvent(id, data) {
    return eventDAO.update(id, data)
  }
}
