import { productService } from '../services/index.js'

class ProductManager {

    getProductsPaginated = async (limit, page, category, sort) => {
        try {
            
            if (category) {
                if (sort) {
                    const result = await productService.get(category, limit, page, sort)
                    return (result);
                } else {
                    result.paginate({ category: category }, {
                        limit: limit,
                        page: page,
                        lean: true
                    })
                    return (result);
                }
            } else {
                if (sort) {
                    result.paginate({}, {
                        limit: limit,
                        page: parseInt(page),
                        lean: true,
                        sort: { price: sort }//asc or desc
                    })
                    return (result);
                } else {
                    result.paginate({}, {
                        limit: limit,
                        page: parseInt(page),
                        lean: true
                    })
                    return (result);
                }
            }
        } catch (error) {
            console.log(error)
        }
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
            const productGenerated = await productService.save(newProduct)
            console.log(`Product ${title} created`)
        } catch (error) {
            console.log(error)
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
        await productService.update(cid, { ...data })
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