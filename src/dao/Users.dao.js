import UserModel from "../models/User.js";

export default class UsersDAO {
  async getAll(params) {
    return UserModel.find(params).lean();
  }

  async getBy(params) {
    return UserModel.findOne(params).lean();
  }

  async save(doc) {
    return UserModel.create(doc);
  }

  async update(id, doc) {
    return UserModel.findByIdAndUpdate(
      id,
      { $set: doc },
      { returnDocument: "after" },
    );
  }

  async delete(id) {
    return UserModel.findByIdAndDelete(id);
  }
}
