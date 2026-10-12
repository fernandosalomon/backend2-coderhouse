import mongoose from "mongoose";

export default class UserDTO {
  constructor(data) {
    this.id = data?._id;
    this.first_name = data.first_name?.trim();
    this.last_name = data.last_name?.trim();
    this.email = data.email?.toLowerCase().trim();
    this.role = data?.role;
  }
}
