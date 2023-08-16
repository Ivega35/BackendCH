import ProductManager from "../dao/productManager.js";
import CustomError from '../services/errors/custom_error.js'
import EErros from '../services/errors/enums.js'
import { addProductErrorInfo } from '../services/errors/info.js'
import { generateProductsMock, generateUserMock } from "../mocking/mock.js";
import createLogger  from "../logs/logger.js";

const productManager = new ProductManager()

const getProductById = async (req, res) => {
    const pid = req.params.pid
    const product = await productManager.getProductsById(pid)
    const user = req.user.user
    res.render('details', { product, user })
}

const addProducts = async (req, res) => {
    const data = req.body
    if (!data.title ||
        !data.description ||
        !data.price ||
        !data.category ||
        !data.stock
    ) {
        CustomError.createError({
            name: "product creation error",
            cause: addProductErrorInfo(data),
            message: "Error trying to create a product",
            code: EErros.INVALID_TYPES_ERROR
        })
    } else {
        await productManager.addProducts(data)
        createLogger.info('New product created')
        res.status(201)
    }
}

const updateProduct = async (req, res) => {
    const pid = req.params.pid
    const data = req.body //Envio por THC => parametro: nuevo valor
    await productManager.updateProduct(pid, data)
    res.status(202).send("Product updated")
}
const deleteProduct = async (req, res) => {
    const pid = req.params.pid
    try {
        await productManager.deleteProduct(pid)
        res.status(201)
        createLogger.warning(`Product ${pid} has been deleted`)
    } catch (error) {
        createLogger.error(error)
    }
}
const getProductsPaginated = async (req, res) => {
    //params
    let limit = req.query.limit
    let page = req.query.page
    let sort = req.query.sort
    const category = req.query.category
    if (!page) page = 1
    if (!limit) limit = 9
    if (sort !== 'asc' && sort !== 'desc') sort = false

    const result = await productManager.getProductsPaginated(limit, page, category, sort)
    if (category) {
        result.prevLink = result.hasPrevPage ? `/products/?category=${category}&limit=${limit}&page=${result.prevPage}` : ''
        result.nextLink = result.hasNextPage ? `/products/?category=${category}&limit=${limit}&page=${result.nextPage}` : ''
    } else {
        result.prevLink = result.hasPrevPage ? `/products/?limit=${limit}&page=${result.prevPage}` : ''
        result.nextLink = result.hasNextPage ? `/products/?limit=${limit}&page=${result.nextPage}` : ''
    }
    const user = req.user.user
    res.render('home', { result, user })
}
const mockingProducts= async(req, res) =>{
    const docs= []
    const qtyOfMocks= 100

    for (let index = 0; index < qtyOfMocks  ; index++) {
        docs.push(generateProductsMock())
    }
    const user= generateUserMock()
    const result={
        docs: docs
        }
    res.render('home', {result, user})
}

export default { getProductById, addProducts, updateProduct, deleteProduct, getProductsPaginated, mockingProducts }
