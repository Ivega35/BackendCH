import { Router } from "express";
import ProductManager from "../management/productManager.js";
import cartManager from "../management/cartManager.js";
import handlebars from 'express-handlebars'
import session from "express-session";

const router = Router()
const pm = new ProductManager()
const cm= new cartManager()
const hbs= handlebars.create({})

router.get('/', async(req, res)=>{
    //params
    let limit= req.query.limit
    if(!limit)limit=10
    let page= req.query.page
    if(!page)page=1
    const category= req.query.category
    const sort= req.query.sort
    //functions
    const result= await pm.getProductsPaginated(limit, page, category, sort)
    result.prevLink = result.hasPrevPage ? `/products/?limit=${limit}&page=${result.prevPage}` : ''
    result.nextLink = result.hasNextPage ? `/products/?limit=${limit}&page=${result.nextPage}` : ''
    
    const user= req.session.user

    res.render('home', {result, user})
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