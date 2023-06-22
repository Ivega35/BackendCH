import { Router } from "express";
import ProductManager from "../management/productManager.js";

const router = Router()
const pm = new ProductManager()

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
    
    const user= req.user.user
    
    res.render('home', {result, user})
})


export default router