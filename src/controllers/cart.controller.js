import createLogger from '../logs/logger.js'
import CartManager from '../dao/cartManager.js'
import handlebars from 'express-handlebars'

const cartManager = new CartManager()
const hbs = handlebars.create({})

const createCart = async (req, res) => {
    try {
        await cartManager.createCart()
        res.status(201)
    } catch (error) {
        createLogger(error)
    }
}
const getProductsFromACart = async (req, res) => {
    const cid = req.params.cid
    const user = req.user.user
    hbs.handlebars.registerHelper('subtotal', function () {
        return this.qty * this.pid.price
    })
    const cartSelected = await cartManager.getProductsFromACart(cid)
    res.render('cart', { cartSelected, user })
}
const addProductToCart = async (req, res) => {
    const cid = req.params.cid
    const pid = req.params.pid
    try {
        await cartManager.addProductToCart(cid, pid)
        createLogger.info(`Product ${pid} added to cart ${cid}`)
        res.status(200)
    } catch (error) {
        createLogger.error(error)
    }
}
const updateCart = async (req, res) => {
    const cid = req.params.cid
    const newDocument = req.body
    try {
        await cartManager.updateCart(cid, newDocument)
        createLogger.info(`Cart ${cid} updated`)
        res.status(200)
    } catch (error) {
        createLogger.error(error)
    }
}
const updateProductQty = async (req, res) => {
    const cid = req.params.cid
    const pid = req.params.pid
    const qty = req.body
    const newQty = qty.qty
    await cartManager.updateProductQty(cid, pid, newQty)
}
const deleteOneProductFromACart = async (req, res) => {
    const cid = req.params.cid
    const pid = req.params.pid
    try {
        await cartManager.deleteOneProductFromACart(cid, pid)
        createLogger.info(`Product ${pid} has been deleted from Cart ${cid}`)
        res.status(200)
    } catch (error) {
        createLogger.error(error)
    }
 
}
const deleteOneCart = async (req, res) => {
    const cid = req.params.cid
    try {
        await cartManager.deleteOneCart(cid)
        res.status(200)
        createLogger.info(`Cart ${cid} has been deleted`)
    } catch {
        res.status(400)
        createLogger.error(`Error on delete cart ${cid}, error: ${error}`)
    }

}
const purchase = async (req, res) => {
    const cid = req.params.cid
    const purchaser = req.user.user.email
    const result= await cartManager.purchase(cid, purchaser)
    if(result === true){
        res.status(202)
        createLogger.info(`Purchase completed: ${purchaser} -- ${cid}`)
        res.render('finishedPurchase', {})
    }else{
        createLogger.error(`Purchase failed: ${purchaser} -- ${cid}, error: there isnt available products in the cart`)
        const error= 'There isnt available products in the cart'
        res.render('errors/base', {error})
    }
    
}
export default {deleteOneCart, deleteOneProductFromACart, updateCart, updateProductQty, addProductToCart, getProductsFromACart, createCart, purchase }