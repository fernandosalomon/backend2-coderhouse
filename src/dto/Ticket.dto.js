export class TicketDTO {
  constructor(data) {
    this.id = data?.id;
    this.user = {
      first_name: data?.user?.first_name,
      last_name: data?.user?.last_name,
      email: data?.user?.email,
    };
    this.event = {
      title: data?.event?.title,
      date: data?.event?.date,
      location: data?.event?.location,
    };
    this.status = data?.status;
    this.quantity = data?.quantity;
    this.reservationCode = data?.reservationCode;
    this.createdAt = data?.createdAt;
  }
}
