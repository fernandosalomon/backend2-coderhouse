export default class EventDTO {
  constructor(data) {
    this.id = data?.id;
    this.title = data?.title.trim();
    this.description = data?.description?.trim();
    this.date = data?.date;
    this.capacity = data?.capacity;
    this.availableSeats = data?.availableSeats;
    this.price = data?.price;
    this.location = data?.location?.trim();
    this.status = data?.status;
    this.createdBy = data?.createdBy;
  }
}
