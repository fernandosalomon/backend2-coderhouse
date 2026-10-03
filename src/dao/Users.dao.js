import UserModel from "../models/User.js";

export default class UsersDAO {
  get = (params) => {
    return UserModel.find(params).lean();
  };

  getBy = (params) => {
    return UserModel.findOne(params).lean();
  };

  save = (doc) => {
    return UserModel.create(doc);
  };

  update = (id, doc) => {
    return UserModel.findByIdAndUpdate(
      id,
      { $set: doc },
      { returnDocument: "after" },
    );
  };

  delete = (id) => {
    return UserModel.findByIdAndDelete(id);
  };
}
