import productsModel from "../models/products.model.js";

class ProductManager {

    getProductsPaginated = async (limit, page, category, sort) => {
        try {

            if (category) {
                if (sort) {
                    const result = await productsModel.paginate({ category: category }, {
                        limit: limit,
                        page: page,
                        lean: true,
                        sort: { price: sort }//asc or desc
                    })
                    return (result);
                } else {
                    const result = await productsModel.paginate({ category: category }, {
                        limit: limit,
                        page: page,
                        lean: true
                    })
                    return (result);
                }
            } else {
                if (sort) {
                    const result = await productsModel.paginate({}, {
                        limit: limit,
                        page: parseInt(page),
                        lean: true,
                        sort: { price: sort }//asc or desc
                    })
                    return (result);
                } else {
                    const result = await productsModel.paginate({}, {
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
    getProductsList = async () => {
        const ProductsList = await productsModel.find({}).lean().exec()
        return (ProductsList)
    }
    generateCode = () => {
        const charsAvaible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
        let string = "";
        for (let i = 0; i < 6; i++) {
            string += charsAvaible.charAt(Math.floor(Math.random() * charsAvaible.length));
        }
        return string
    }
    generateId = async () => {
        let list = await this.getProductsList()
        if (list.length === 0) return 1
        return list[list.length - 1].pid + 1
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
            const pid = await this.generateId()
            const code = await this.validateCode()
            const newProduct = { pid, title, description, price, status: true, category, thumbnail, code, stock }
            const productGenerated = new productsModel(newProduct)
            await productGenerated.save()
            console.log(`Product ${title} created`)
        } catch (error) {
            console.log(error)
        }
    }
    getProductsById = async (pid) => {
        try {
            const product = await productsModel.findOne({ _id: pid }).lean().exec()
            return (product)
        } catch (error) {
            console.log(error)
        }
    }
    updateProduct = async (pid, data) => {
        await productsModel.updateOne({ pid: pid }, { ...data })
    }
    deleteProduct = async (pid) => {
        try {
            await productsModel.deleteOne({ pid: pid })
            console.log(`product ${pid} deleted`)
        } catch (err) {
            console.log(err)
        }
    }
}

export default ProductManager