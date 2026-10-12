export class TicketDTO {
  constructor(ticket) {
    this.id = ticket?.id;
    this.user = {
      first_name: ticket?.user?.first_name,
      last_name: ticket?.user?.last_name,
      email: ticket?.user?.email,
    };
    this.event = {
      title: ticket?.event?.title,
      date: ticket?.event?.date,
      location: ticket?.event?.location,
    };
    this.status = ticket?.status;
    this.quantity = ticket?.quantity;
    this.reservationCode = ticket?.reservationCode;
    this.createdAt = ticket?.createdAt;
  }
}
