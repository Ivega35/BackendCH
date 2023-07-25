import { cartService, productService } from '../services/index.js'
import TicketManager  from './ticketManager.js'

const ticketManager= new TicketManager()

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
        return result

    }
    deleteOneCart = async (cid) => {
        await cartService.delete(cid)
    }
    deleteAllproductsFromACart= async(cid)=>{
        const populate = 'products.pid'
        const cart = await cartService.getByIdPopulate(cid, populate)
        const products= cart.products
        
        for (let index = 0; index < products.length; index++) {
            const product = products[index];
            const pid= product.pid._id
            await this.deleteOneProductFromACart(cid, pid)
        }
    }
    deleteOneProductFromACart = async (cid, pid) => {
        const cartSelected = await cartService.getById(cid)
        const idx = cartSelected.products.findIndex(x => x.pid == pid)

        cartSelected.products.splice(idx, 1)
        const result = await cartService.update(cartSelected, cid)
        return result
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
    purchase = async (cid, email) => {
        const populate = 'products.pid'
        const cart = await cartService.getByIdPopulate(cid, populate)
        const products = cart.products
        const unavailables = []
        const productsLeft = []
        for (let index = 0; index < products.length; index++) {
            const product = products[index]
            const pid = product.pid._id.toString()
            if (product.pid.stock < product.qty) {
                console.log(`not enough stock at ${product.pid.title}`)
                unavailables.push(pid)
                await this.deleteOneProductFromACart(cid, pid)
            } else {
                let stockAux = product.pid.stock - product.qty
                const newStock = {
                    stock: stockAux
                }
                await productService.update(newStock, pid)
            }
        }
        // for (let index = 0; index < unavailables.length; index++) {
        //     const productId = unavailables[index];
        //     const product = await productService.getById(productId)
        //     productsLeft.push({
        //         pid: product._id.toString(),
        //         qty: 1
        //     })
        // }
        console.log(unavailables)
        if(unavailables.length == 0){
            await ticketManager.generateTicket(cid, email)
            await this.deleteAllproductsFromACart(cid)
        }else{
            await ticketManager.generateTicket(cid, email)
            await this.deleteAllproductsFromACart(cid)
            for (let index = 0; index < unavailables.length; index++) {
                const pid = unavailables[index]
                await this.addProductToCart(cid, pid)
            }
        }
    }
}

export default CartManager