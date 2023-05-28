import { Router } from "express";
import ProductManager from "../management/productManager.js";
import cartManager from "../management/cartManager.js";

const router = Router()
const pm = new ProductManager()
const cm= new cartManager()

router.get('/products', async(req, res)=>{
    const pList = await pm.getProductsPaginated(100)
    res.render('home', pList)
})
router.get('/cart/:cid', async(req, res)=>{
    const cid= req.params.cid
    const cartSelected= await cm.getProductsFromACart(cid)
    res.render('cart', cartSelected)
   
})

export default router