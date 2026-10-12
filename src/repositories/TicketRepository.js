export default class TicketRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async getTicketById(tid) {
    return this.dao.getById(tid);
  }

  async updateTicket(ticketId, data) {
    return this.dao.update(ticketId, data);
  }

  async getTicketByUser(userId) {
    return this.dao.findByUser(userId);
  }

  async getTicketByEvent(eventId, options) {
    return this.dao.findByEvent(eventId, options);
  }

  async getTicketByUserAndEvent(userId, eventId) {
    return this.dao.findActiveByUserAndEvent(userId, eventId);
  }

  async getReservedQuantity(eventId) {
    return this.dao.getReservedQuantityByEvent(eventId);
  }
  async createTicket(data) {
    return this.dao.save(data);
  }
}
