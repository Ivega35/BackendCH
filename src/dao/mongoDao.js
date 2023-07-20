import mongoose from "mongoose";
import ProductModel from "./models/products.model.js";
import CartModel from "./models/carts.model.js";
import UserModel from "./models/users.model.js";
import mongoosePaginate from "mongoose-paginate-v2";
import TicketModel from "./models/ticketModel.js";

export default class mongoDao {
    constructor(url) {
        this.mongoose = mongoose.connect(url).catch(err => {
            console.log(err.message)
            process.exit()
        })
        const timestamp = { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
        const productSchema = mongoose.Schema(ProductModel.schema, timestamp)
        productSchema.plugin(mongoosePaginate)
        const cartSchema = mongoose.Schema(CartModel.schema, timestamp)
        cartSchema.plugin(mongoosePaginate);
        const userSchema= mongoose.Schema(UserModel.schema, timestamp)
        mongoose.set("strictQuery", false);
        const ticketSchema= mongoose.Schema(TicketModel.schema, timestamp)
        this.models = {
            [ProductModel.model]: mongoose.model(ProductModel.model, productSchema),
            [CartModel.model]: mongoose.model(CartModel.model, cartSchema),
            [UserModel.model]: mongoose.model(UserModel.model, userSchema),
            [TicketModel.model]: mongoose.model(TicketModel.model, ticketSchema)
        }
    }

    get = async (options, entity) => {
        if (!this.models[entity]) throw new Error('entity not found in models')
        let results = await this.models[entity].find(options)
        return results.map(result => result.toObject())
    }
    getById = async ( id, entity) => {
        if (!this.models[entity]) throw new Error('entity not found in models')
        let results = await this.models[entity].findOne({_id: id}).lean().exec()
        return results
    }
    getByEmail = async(email, entity)=>{
        if (!this.models[entity]) throw new Error('entity not found in models')
        let results = await this.models[entity].findOne({email: email}).lean().exec()
        return results
    }
    insert = async (document, entity) => {
        if (!this.models[entity]) throw new Error('entity not found in models')
        try {
            let instance = new this.models[entity](document)
            let results = await instance.save()
            return results
        } catch (err) {
            console.log(err.message)
            return null
        }
    }
    update = async(data, id, entity) => {
        if (!this.models[entity]) throw new Error('entity not found in models')
        try {
            let results= await this.models[entity].updateOne({ _id: id }, { ...data })
            return results
        } catch (err) {
            console.log(err.message)
            return null
        }
    }
    delete = async (id, entity) => {
        if (!this.models[entity]) throw new Error('entity not found in models')
        try {
            let results = await this.models[entity].deleteOne({ _id: id })
            return results
        } catch (err) {
            console.log(err.message)
            return null
        }
    }
    create= async(document, entity)=>{
        if (!this.models[entity]) throw new Error('entity not found in models')
        try {
            const result= await this.models[entity].create(document)
            return result
        } catch (err) {
            console.log(err.message)
            return null
        }
    }
} 