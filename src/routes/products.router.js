import { Router } from "express";
import productController from "../controllers/product.controller.js";
const router = Router()

//POST /api/products --> To create any product by body(ThunderClient)
router.post ('/', productController.addProducts)
//PUT /api/products/:pid --> To update any product by body(ThunderClient)
router.put('/:pid', productController.updateProduct)
//DELETE /api/products/:pid --> To delete any product by id (thunderclient)
router.delete('/:pid', productController.deleteProduct)

export default router