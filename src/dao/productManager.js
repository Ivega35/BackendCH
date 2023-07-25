import { productService } from '../services/index.js'

class ProductManager {

    getProductsPaginated = async (limit, page, category, sort) => {
        const result = await productService.paginate(limit, page, category, sort)
        return result
    }
    generateCode = () => {
        const charsAvaible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
        let string = "";
        for (let i = 0; i < 6; i++) {
            string += charsAvaible.charAt(Math.floor(Math.random() * charsAvaible.length));
        }
        return string
    }
    validateCode = async () => {
        const list = await this.getProductsList()
        let code;
        let auxCode;
        do {
            code = this.generateCode()
            auxCode = list.find(x => x.code == code)
        } while (auxCode != undefined)
        return code
    }
    addProducts = async ({ title, description, price, category, thumbnail, stock }) => {
        try {
            const code = await this.validateCode()
            const newProduct = { title, description, price, status: true, category, thumbnail, code, stock }
            await productService.save(newProduct)
        } catch (err) {
            console.log(err)
        }
    }
    getProductsById = async (pid) => {
        try {
            const product = await productService.getById(pid)
            return (product)
        } catch (error) {
            console.log(error)
        }
    }
    updateProduct = async (pid, data) => {
        await productService.update(pid, { ...data })
    }
    deleteProduct = async (pid) => {
        try {
            await productService.delete(pid)
            console.log(`product ${pid} deleted`)
        } catch (err) {
            console.log(err)
        }
    }
}

export default ProductManager