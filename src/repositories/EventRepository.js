export default class EventRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async getEventById(id) {
    return this.dao.getBy({ _id: id });
  }

  async getEventsByFilters(filters, options) {
    return this.dao.getByFilters(filters, options);
  }

  async countEvents(filters) {
    return this.dao.count(filters);
  }

  async createEvent(data) {
    return this.dao.save(data);
  }
  
  async updateEvent(id, data) {
    return this.dao.update(id, data);
  }
}
