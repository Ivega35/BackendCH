import CartManager from '../dao/cartManager.js'
import { TicketManager } from '../dao/ticketManager.js'
import handlebars from 'express-handlebars'
import { decode } from '../utils.js'
import env from '../config/environment.config.js'
import { userService } from '../services/index.js'
import UserDTO from '../dto/userDto.js'

const ticketManager= new TicketManager()
const cartManager = new CartManager()
const hbs = handlebars.create({})

const createCart = async (req, res) => {
    await cartManager.createCart()
    res.status(201).send("New cart created")
}
const getProductsFromACart = async (req, res) => {
    const cid = req.params.cid
    const token = req.cookies[env.jwt_cookie_name]
    const decoded = decode(token)
    const user= decoded.user
    // const result= await userService.get()
    // const usersDTO= result.map(user => new UserDTO(user))
    // const user= usersDTO.find(user => user.cart == cid)
    hbs.handlebars.registerHelper('subtotal', function () {
        return this.qty * this.pid.price
    })
    const cartSelected = await cartManager.getProductsFromACart(cid)
    res.render('cart', { cartSelected, user})
}
const addProductToCart = async (req, res) => {
    const cid = req.params.cid
    const pid = req.params.pid
    await cartManager.addProductToCart(cid, pid)
    res.status(200)
}
const updateCart = async (req, res) => {
    const cid = req.params.cid
    const newDocument = req.body
    await cartManager.updateCart(cid, newDocument)
    res.send('Cart updated')
}
const updateProductQty = async (req, res) => {
    const cid = req.params.cid
    const pid = req.params.pid
    const qty = req.body
    const newQty = qty.qty
    await cartManager.updateProductQty(cid, pid, newQty)
    res.send('product qty updated')
}
const deleteOneProductFromACart = async (req, res) => {
    const cid = req.params.cid
    const pid = req.params.pid
    const result= await cartManager.deleteOneProductFromACart(cid, pid)
    console.log(result)
    res.send("product eliminated")
}
const deleteOneCart = async (req, res) => {
    const cid = req.params.cid
    await cartManager.deleteOneCart(cid)
    res.send(`product ${cid} eliminated`)
}
const purchase = async(req, res)=>{
    const cid= req.params.cid
    const token = req.cookies[env.jwt_cookie_name]
    const decoded = decode(token)
    const purchaser = decoded.user.email
    
    const result= await cartManager.purchase(cid)
    if(result == true) { 
        await ticketManager.generateTicket(cid, purchaser)
    }else {
        res.send("No one product is avaivable. Check stock.")
    }
}

export default { deleteOneCart, deleteOneProductFromACart, updateCart, updateProductQty, addProductToCart, getProductsFromACart, createCart, purchase }