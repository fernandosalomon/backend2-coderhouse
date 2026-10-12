export default class UserRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async getAllUsers() {
    return this.dao.getAll();
  }

  async createUser(user) {
    return this.dao.save(user);
  }

  async getUserByEmail(email) {
    return this.dao.getBy({ email });
  }

  async getUserById(id) {
    return this.dao.getBy({ _id: id });
  }
}
