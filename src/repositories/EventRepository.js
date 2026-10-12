import BaseRepository from "./BaseRepository.js";

export default class EventRepository extends BaseRepository {
  constructor(dao) {
    super(dao);
  }

  getById = (eid) => {
    return this.getBy({ _id: eid });
  }
}
