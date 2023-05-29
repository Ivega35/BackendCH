import { Router } from "express";
import ProductManager from "../management/productManager.js";
import cartManager from "../management/cartManager.js";
import handlebars from 'express-handlebars'

const router = Router()
const pm = new ProductManager()
const cm= new cartManager()
const hbs= handlebars.create({})

router.get('/products', async(req, res)=>{
    const pList = await pm.getProductsPaginated(100)
    res.render('home', pList)
})
router.get('/cart/:cid', async(req, res)=>{
    const cid= req.params.cid
    const cartSelected= await cm.getProductsFromACart(cid) 
    hbs.handlebars.registerHelper('subtotal', function(){
        return this.qty*this.pid.price
    })
    res.render('cart', {
        cartSelected,
        cid
    })
})

export default router