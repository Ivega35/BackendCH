import repository from "./repository.js";
import UserModel from "../dao/models/users.model.js"

export default class UserService extends repository{
    constructor(dao){
        super(dao, UserModel.model)
    }
}