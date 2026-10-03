export default class GenericRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getAll = (filters = {}, pagination = {}) => {
    return this.dao.get(filters, pagination);
  };

  getBy = (params) => {
    return this.dao.getBy(params);
  };

  create = (doc) => {
    return this.dao.save(doc);
  };

  update = (id, doc) => {
    return this.dao.update(id, doc);
  };

  delete = (id) => {
    return this.dao.delete(id);
  };
}
