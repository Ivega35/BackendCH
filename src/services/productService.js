import ProductModel from "../dao/models/products.model.js";
import repository from "./repository.js";

export default class ProductService extends repository{
    constructor(dao){
        super(dao, ProductModel.model)
    }
} 