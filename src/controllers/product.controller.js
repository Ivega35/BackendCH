import ProductManager from "../dao/productManager.js";

const productManager= new ProductManager()

const getProductById = async(req, res)=>{
    const pid= req.params.pid
    const product= await productManager.getProductsById(pid)
    const user= req.user
    res.render('details', {product, user})
}

const addProducts= async(req, res)=>{
    const data = req.body
    if(!data.title||
    !data.description||
    !data.price||
    !data.category||
    !data.stock
    ){
        res.status(206).send("incomplete fields")
   }else{
        await productManager.addProducts(data)
        res.status(201).send("Product created")
    }
}

const updateProduct= async(req, res)=>{
    const pid =req.params.pid
    const data= req.body //Envio por THC => parametro: nuevo valor
    await productManager.updateProduct(pid, data)
    res.status(202).send("Product updated")
}
const deleteProduct= async (req, res) => {
    const pid = req.params.pid
    await productManager.deleteProduct(pid)
    res.send("Product deleted")  
}
const getProductsPaginated= async(req, res)=>{
    //params
    let limit= req.query.limit
    if(!limit)limit=3
    let page= req.query.page
    if(!page)page=1
    const category= req.query.category

    const sort= req.query.sort
    //functions
    const result= await productManager.getProductsPaginated(limit, page, category, sort)
    if(category){
        result.prevLink = result.hasPrevPage ? `/products/?category=${category}&limit=${limit}&page=${result.prevPage}` : ''
        result.nextLink = result.hasNextPage ? `/products/?category=${category}&limit=${limit}&page=${result.nextPage}` : ''
    }else{
        result.prevLink = result.hasPrevPage ? `/products/?limit=${limit}&page=${result.prevPage}` : ''
        result.nextLink = result.hasNextPage ? `/products/?limit=${limit}&page=${result.nextPage}` : ''
    }
    
    const user= req.user.user
    
    res.render('home', {result, user})
}

export default {getProductById, addProducts, updateProduct, deleteProduct, getProductsPaginated }
