import { populate } from "dotenv"

export default class repository {
    constructor(dao, model) {
        this.dao = dao
        this.model = model
    }

    get = async (params) => {
        return this.dao.get(params, this.model)
    }
    paginate = async (limit, page, category, sort) => {
        return this.dao.paginate(limit, page, category, sort, this.model)
    }
    getByIdPopulate= async(id, populate)=>{
        return this.dao.getByIdPopulate(id, populate, this.model)
    }
    getById = async (id) => {
        return this.dao.getById(id, this.model)
    }
    getByEmail = async (email) => {
        return this.dao.getByEmail(email, this.model)
    }
    save = async (data) => {
        return this.dao.insert(data, this.model)
    }
    update = async (data, id) => {
        return this.dao.update(data, id, this.model)
    }
    delete = async (id) => {
        return this.dao.delete(id, this.model)
    }
    create = async (document) => {
        return this.dao.create(document, this.model)
    }
}