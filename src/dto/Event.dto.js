import UserDTO from "./User.dto.js";

export class EventDTO {
  constructor(data) {
    this.id = data?.id;
    this.title = data?.title.trim();
    this.description = data?.description?.trim();
    this.date = data?.date;
    this.capacity = data?.capacity;
    this.price = data?.price;
    this.location = data?.location?.trim();
    this.organizer = new UserDTO(data?.organizer);
  }
}
