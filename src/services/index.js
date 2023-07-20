import ProductService from "./productService.js";
import CartService from "./cartService.js";
import environmentConfig from "../config/environment.config.js";
import mongoDao from "../dao/mongoDao.js";
import UserService from "./userService.js";

let dao= new mongoDao(environmentConfig.mongo_uri)
//might be a switch here if i want to change the persistence

export const cartService= new CartService(dao)
export const userService= new UserService(dao)
export const productService= new ProductService(dao)