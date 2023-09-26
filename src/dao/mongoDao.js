import mongoose from "mongoose";
import ProductModel from "./models/products.model.js";
import CartModel from "./models/carts.model.js";
import UserModel from "./models/users.model.js";
import TicketModel from "./models/ticketModel.js";
import mongoosePaginate from 'mongoose-paginate-v2'
import CustomError from '../services/errors/custom_error.js'
import EErros from '../services/errors/enums.js'
import { notFoundModelErrorInfo } from '../services/errors/info.js'


export default class mongoDao {
    constructor(url) {
        this.mongoose = mongoose.connect(url).catch(err => {
            console.log(err.message)
            process.exit()
        })
        const timestamp = { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
        const productSchema = mongoose.Schema(ProductModel.schema, timestamp).plugin(mongoosePaginate)
        const cartSchema = mongoose.Schema(CartModel.schema, timestamp)
        const userSchema = mongoose.Schema(UserModel.schema, timestamp)
        mongoose.set("strictQuery", false);
        const ticketSchema = mongoose.Schema(TicketModel.schema, timestamp)
        this.models = {
            [ProductModel.model]: mongoose.model(ProductModel.model, productSchema),
            [CartModel.model]: mongoose.model(CartModel.model, cartSchema),
            [UserModel.model]: mongoose.model(UserModel.model, userSchema),
            [TicketModel.model]: mongoose.model(TicketModel.model, ticketSchema)
        }
    }

    get = async (options, entity) => {
        if (!this.models[entity]) {
            CustomError.createError({
                name: "entity not found",
                cause: notFoundModelErrorInfo(entity),
                message: "Error finding entity",
                code: EErros.NOT_FOUND_ERROR
            })
        }
        let results = await this.models[entity].find(options)
        return results
    }

    paginate = async (limit, page, category, sort, entity) => {
        try {
            if (!this.models[entity]) {
                CustomError.createError({
                    name: "entity not found",
                    cause: notFoundModelErrorInfo(entity),
                    message: "Error finding entity",
                    code: EErros.NOT_FOUND_ERROR
                })
            }
            if (category) {
                if (sort) {
                    const productos = await this.models[entity].paginate({ category: category }, {
                        page,
                        limit,
                        lean: true,
                        category: category,
                        sort: sort
                    });
                    return productos
                } else {
                    const productos = await this.models[entity].paginate({ category: category }, {
                        page,
                        limit,
                        lean: true,
                        category: category
                    });
                    return productos
                }
            } else {
                if (sort) {
                    const productos = await this.models[entity].paginate(category, {
                        page,
                        limit,
                        lean: true,
                        sort: sort
                    });
                    return productos
                } else {
                    const productos = await this.models[entity].paginate(category, {
                        page,
                        limit,
                        lean: true
                    });
                    return productos
                }
            }
        } catch (error) {
            return { error: 3, servererror: error };
        }
    }
    getById = async (id, entity) => {
        if (!this.models[entity]) {
            CustomError.createError({
                name: "entity not found",
                cause: notFoundModelErrorInfo(entity),
                message: "Error finding entity",
                code: EErros.NOT_FOUND_ERROR
            })
        }
        let results = await this.models[entity].findOne({ _id: id }).lean().exec()
        return results
    }
    getByIdPopulate = async (id, populate, entity) => {
        if (!this.models[entity]) {
            CustomError.createError({
                name: "entity not found",
                cause: notFoundModelErrorInfo(entity),
                message: "Error finding entity",
                code: EErros.NOT_FOUND_ERROR
            })
        }
        let results = await this.models[entity].findOne({ _id: id }).populate(populate).lean().exec()
        return results
    }
    getByEmail = async (email, entity) => {
        if (!this.models[entity]) {
            CustomError.createError({
                name: "entity not found",
                cause: notFoundModelErrorInfo(entity),
                message: "Error finding entity",
                code: EErros.NOT_FOUND_ERROR
            })
        }
        let results = await this.models[entity].findOne({ email: email }).lean().exec()
        return results
    }
    insert = async (document, entity) => {
        if (!this.models[entity]) {
            CustomError.createError({
                name: "entity not found",
                cause: notFoundModelErrorInfo(entity),
                message: "Error finding entity",
                code: EErros.NOT_FOUND_ERROR
            })
        }
        let instance = new this.models[entity](document)
        let results = await instance.save()
        return results

    }
    update = async (data, id, entity) => {
        if (!this.models[entity]) {
            CustomError.createError({
                name: "entity not found",
                cause: notFoundModelErrorInfo(entity),
                message: "Error finding entity",
                code: EErros.NOT_FOUND_ERROR
            })
        }
        let results = await this.models[entity].updateOne({ _id: id }, { ...data })
        return results
    }
    delete = async (id, entity) => {
        if (!this.models[entity]) {
            CustomError.createError({
                name: "entity not found",
                cause: notFoundModelErrorInfo(entity),
                message: "Error finding entity",
                code: EErros.NOT_FOUND_ERROR
            })
        }
        let results = await this.models[entity].deleteOne({ _id: id })
        return results

    }
    create = async (document, entity) => {
        if (!this.models[entity]) {
            CustomError.createError({
                name: "entity not found",
                cause: notFoundModelErrorInfo(entity),
                message: "Error finding entity",
                code: EErros.NOT_FOUND_ERROR
            })
        }
        const result = await this.models[entity].create(document)
        return result
    }
} 