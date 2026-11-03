export default class EventRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async getPaginatedEvents(filterQuery, paginationOptions) {
    return await this.dao.getAll(filterQuery, paginationOptions);
  }

  async getEventById(id) {
    return this.dao.getOne({ _id: id });
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

  async finishExpiredEvents() {
    return this.dao.finishExpired();
  }

  async decrementSeats(id, quantity) {
    return await this.dao.decrementAvailableSeats(id, quantity);
  }
  async restoreSeats(id, quantity) {
    return await this.dao.incrementAvailableSeats(id, quantity);
  }
}
