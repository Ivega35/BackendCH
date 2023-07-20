import { Router } from "express";
import productController from "../controllers/product.controller.js";

const router = Router()

//GET /products --> To get all products
router.get('/', productController.getProductsPaginated)

//GET /products/:pid --> Get a product in particular (pid)
router.get('/:pid', productController.getProductById)

export default router