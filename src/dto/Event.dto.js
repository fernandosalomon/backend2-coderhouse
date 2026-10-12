import UserDTO from "./User.dto.js";

export class EventDTO {
  constructor(event) {
    this.id = event?.id;
    this.title = event?.title.trim();
    this.description = event?.description?.trim();
    this.date = event?.date;
    this.capacity = event?.capacity;
    this.price = event?.price;
    this.location = event?.location?.trim();
    this.status = event?.status;
    this.organizer = new UserDTO(event?.organizer);
  }
}
