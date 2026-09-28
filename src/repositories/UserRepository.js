import BaseRepository from "./BaseRepository.js";

export default class UserRepository extends BaseRepository{
    constructor(dao){
        super(dao);
    }
    
    getUserByEmail = (email) =>{
        return this.getBy({email});
    }
    
    getUserById = (id) =>{
        return this.getBy({_id:id})
    }  
}