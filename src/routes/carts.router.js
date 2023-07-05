import { Router } from "express";
import cartManager from "../dao/management/cartManager.js";
import handlebars from 'express-handlebars'

const router= Router()
const cm= new cartManager()
const hbs= handlebars.create({})

//POST /api/carts --> create cart by thc
router.post('/', (req, res)=>{
    cm.createCart()
    res.status(201).send("New cart created")
})
//GET /api/carts/:cid ---> Show the products which are in cid cart
router.get('/:cid', async(req,res)=>{
    const cid= req.params.cid
    const cartSelected= await cm.getProductsFromACart(cid) 
    hbs.handlebars.registerHelper('subtotal', function(){
        return this.qty*this.pid.price
    })
    res.render('cart', {cartSelected})
})
//POST /api/carts/:cid/products/:pid --> To add a product(pid) to a specific cart(cid)
router.post('/:cid/products/:pid', async(req, res)=>{
    const cid= req.params.cid 
    const pid= req.params.pid
    await cm.addProductToCart(cid, pid)
    res.status(201)
})
//PUT /api/carts/:cid --> Update the whole products array
router.put('/:cid', async(req, res) =>{
    const cid= req.params.cid
    const newData= req.body
    await cm.updateCart(cid, newData)
    res.send('Cart updated')
})
//PUT api/carts/:cid/products/:pid -->Update the qty in one product
router.put('/:cid/products/:pid', async(req, res)=>{
    const cid= req.params.cid
    const pid= req.params.pid
    const qty= req.body
    const newQty= qty.qty
    await cm.updateProductQty(cid, pid, newQty)
    res.send('product qty updated')
})
//DELETE /api/cartis/:cid/products/:pid -->
router.delete('/:cid/products/:pid', async(req, res)=>{
    const cid= req.params.cid
    const pid= req.params.pid
    await cm.deleteOneProductFromACart(cid, pid)
    res.send("product eliminated")
})
//DELETE /api/carts/:cid -> delete a cart by thc
router.delete('/:cid', async(req, res)=>{
    const cid= req.params.cid
    await cm.deleteOneCart(cid) 
    res.send(`product ${cid} eliminated`)
})

export default router