import { cartService, productService } from '../services/index.js'

class CartManager {

    getCarts = async () => {
        const carts = await cartService.get()
        return (carts)
    }
    generateId = async () => {
        let list = await this.getCartsList()
        if (list.length === 0) return 1
        return list[list.length - 1].cid + 1
    }
    createCart = async () => {
        const newCart = { products: [] }
        const result = await cartService.save(newCart)
        return result
    }
    getProductsFromACart = async (cid) => {
        const populate = 'products.pid'
        const cartToShow = await cartService.getByIdPopulate(cid, populate)
        return (cartToShow)
    }
    getCartById = async (cid) => {
        try {
            const cart = await cartService.getById(cid)
            return (cart)
        } catch (error) {
            console.log(error)
        }
    }
    addProductToCart = async (cid, pid) => {
        const cartSelected = await cartService.getById(cid)
        const repeat = cartSelected.products.find(x => x.pid == pid)
        if (repeat != undefined) {
            repeat.qty++
        } else {
            cartSelected.products.push({
                pid: pid,
                qty: 1
            })
        }
        const result = await cartService.update(cartSelected, cid)
        console.log(result)
        console.log(`Product ${pid} added to cart ${cid}`)

    }
    deleteOneCart = async (cid) => {
        const toDelete = await cartService.delete(cid)
        console.log(toDelete)
    }
    deleteOneProductFromACart = async (cid, pid) => {
        const cartSelected = await cartService.getById(cid)
        const idx = cartSelected.products.findIndex(x => x.pid == pid)

        cartSelected.products.splice(idx, 1)
        await cartService.update(cartSelected, cid)
        console.log(`Product ${pid} eliminated from cart${cid}`)
       
    }
    updateCart = async (newData, cid) => {
        await cartService.update(newData, cid)
    }
    updateProductQty = async (cid, pid, newQty) => {
        const cartToUpdate = await cartService.getById(cid)
        //delete the old product
        const productIdx = cartToUpdate.products.findIndex(x => x.pid == pid)
        cartToUpdate.products.splice(productIdx, 1)
        //push the new one
        cartToUpdate.products.push({
            pid: pid,
            qty: newQty
        })
        const result = await cartService.update(cartToUpdate, cid)
        return result
    }
    purchase = async (cid) => {
        const populate = 'products.pid'
        const cart = await cartService.getByIdPopulate(cid, populate)
        const products = cart.products
        const unavailables = []
        const productsLeft = []
        for (let index = 0; index < products.length; index++) {
            const product = products[index]
            const pid = product.pid._id.toString()
            //console.log(product.qty)
            if (product.pid.stock > product.qty) {
                let stockAux = product.pid.stock - product.qty
                const newStock = {
                    stock: stockAux
                }
                await productService.update(newStock, pid)
                await this.deleteOneProductFromACart(cid, pid)
            } else {
                console.log(`not enough stock in ${product.pid.title}`)
                unavailables.push(pid)
            }
        }
        for (let index = 0; index < unavailables.length; index++) {
            const productId = unavailables[index];
            const product = await productService.getById(productId)
            productsLeft.push({
                pid: product,
                qty: 1
            })
        }
        if (productsLeft.length > 0) {
            await cartService.update(productsLeft, cid)
            console.log('No one product is available. Check stock')
            return false
        } else {
            console.log('Purchase success')
            return true
        }
    }
}

export default CartManager