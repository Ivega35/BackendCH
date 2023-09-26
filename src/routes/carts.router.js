import { Router } from "express";
import cartController from "../controllers/cart.controller.js";

const router = Router()

//POST /api/carts --> create cart by thc
router.post('/', cartController.createCart)
//GET api/carts/:cid ---> Show the products which are in cid cart
router.get('/:cid', cartController.getProductsFromACart)
//POST /api/carts/:cid/products/:pid --> To add a product(pid) to a specific cart(cid)
router.post('/:cid/products/:pid', cartController.addProductToCart)
//PUT /api/carts/:cid/purchase --> To finish the purchase process
router.put('/:cid/purchase', cartController.purchase)
router.get('/:cid/purchase', cartController.purchase)
//PUT /api/carts/:cid --> Update the whole products array
router.put('/:cid', cartController.updateCart)
//PUT api/carts/:cid/products/:pid -->Update the qty in one product
router.put('/:cid/products/:pid', cartController.updateProductQty)
//PUT /api/carts/:cid/products/:pid -->
router.put('/:cid/products/:pid', cartController.deleteOneProductFromACart)
//DELETE /api/carts/:cid -> delete a cart
router.delete('/:cid', cartController.deleteOneCart)


export default router