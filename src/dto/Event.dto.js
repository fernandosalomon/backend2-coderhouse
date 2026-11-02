import UserDTO from "./User.dto.js";

export class EventDTO {
  constructor(event) {
    this.id = event?.id;
    this.title = event?.title.trim();
    this.description = event?.description?.trim();
    this.category = event?.category;
    this.date = event?.date;
    this.capacity = event?.capacity;
    this.price = event?.price;
    this.location = event?.location?.trim();
    this.status = event?.status;
    this.organizer = new UserDTO(event?.organizer);
  }

  public() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      category: this.category,
      date: this.date,
      capacity: this.capacity,
      price: this.price,
      location: this.location,
      status: this.status,
      organizer: {
        first_name: this.organizer.first_name,
        last_name: this.organizer.last_name,
      },
    };
  }
}
