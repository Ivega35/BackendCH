import CartManager from '../dao/cartManager.js'
import handlebars from 'express-handlebars'

const cartManager= new CartManager()
const hbs= handlebars.create({})

const createCart = async() =>{
    cartManager.createCart()
    res.status(201).send("New cart created")
}
const getProductsFromACart= async(cid)=>{
    const cartId= req.params.cid
    const cartSelected= await cartManager.getProductsFromACart(cartId) 
    hbs.handlebars.registerHelper('subtotal', function(){
        return this.qty*this.pid.price
    })
    res.render('cart', {cartSelected})
}
const addProductToCart= async(cid, pid)=>{
    const cartId= req.params.cid 
    const productId= req.params.pid
    await cartManager.addProductToCart(cartId, productId)
    res.status(201)
}
const updateCart= async(cid, newData)=>{
    const cartId= req.params.cid
    const newDocument= req.body
    await cartManager.updateCart(cid, newDocument)
    res.send('Cart updated')
}
const updateProductQty= async(cid, pid, newQty)=>{
    const cartId= req.params.cid
    const productId= req.params.pid
    const qty= req.body
    const newQuantity= qty.qty
    await cartManager.updateProductQty(cartId, productId, newQuantity)
    res.send('product qty updated')
}
const deleteOneProductFromACart= async(cid, pid)=>{
    const cartId= req.params.cid
    const productId= req.params.pid
    await cartManager.deleteOneProductFromACart(cartId, productId)
    res.send("product eliminated")
}
const deleteOneCart= async(cartId)=>{
    cartId= req.params.cid
    await cartManager.deleteOneCart(cartId) 
    res.send(`product ${cartId} eliminated`)
}

export default {deleteOneCart, deleteOneProductFromACart, updateCart, updateProductQty, addProductToCart, getProductsFromACart, createCart}