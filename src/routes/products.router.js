import { Router } from "express";
import productController from "../controllers/product.controller.js";
import { isAdmin } from "../utils.js";
const router = Router()

//POST /api/products --> To create any product by body(ThunderClient)
router.post('/', isAdmin, productController.addProducts)
//PUT /api/products/:pid --> To update any product by body(ThunderClient)
router.put('/:pid', isAdmin, productController.updateProduct)
//DELETE /api/products/:pid --> To delete any product by id (thunderclient)
router.delete('/:pid',isAdmin, productController.deleteProduct)
//GET /api/products/mockingproducts
router.get('/mockingproducts', productController.mockingProducts)
export default router