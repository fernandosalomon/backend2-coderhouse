export default class UserDTO {
  constructor(user) {
    this.id = user?._id;
    this.first_name = user.first_name?.trim();
    this.last_name = user.last_name?.trim();
    this.email = user.email?.toLowerCase().trim();
    this.role = user?.role;
  }
}
