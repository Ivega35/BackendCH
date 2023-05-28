import { Router } from "express";
import ProductManager from "../management/productManager.js";

const router = Router()
const pm = new ProductManager()
//GET api/products --> Get all products.Can filter by category and sort by price.
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
    res.render('home', result)
})
//GET /api/products/:pid --> Get a product in particular (pid)
router.get('/:pid', async(req, res)=>{
    const pid= req.params.pid
    const identified= await pm.getProductsById(pid)
    res.render('home', identified)
})
//POST /api/products --> To create any product by body(ThunderClient)
router.post ('/', async(req, res)=>{
    const data = req.body
    if(!data.title||
    !data.description||
    !data.price||
    !data.category||
    !data.stock
    ){
        res.status(206).send("incomplete fields")
   }else{
        await pm.addProducts(data)
        res.status(201).send("Product created")
    }
})
//PUT /api/products/:pid --> To update any product by body(ThunderClient)
router.put('/:pid', async(req, res)=>{
    const pid =req.params.pid
    const data= req.body //Envio por THC => parametro: nuevo valor
    await pm.updateProduct(pid, data)
    res.status(202).send("Product updated")
})
//DELETE /api/products/:pid --> To delete any product by id (thunderclient)
router.delete('/:pid', async (req, res) => {
    const pid = req.params.pid
    await pm.deleteProduct(pid)
    res.send("Product deleted")
})
export default router