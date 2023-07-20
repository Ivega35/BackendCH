import repository from "./repository.js";
import CartModel from "../dao/models/carts.model.js";

export default class CartService extends repository {
    constructor (dao){
        super(dao, CartModel.model)
    }
}