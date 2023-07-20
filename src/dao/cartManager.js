import {cartService} from '../services/index.js'

class CartManager{
    
    getCarts= async()=>{
        const carts= await cartService.get()
        return(carts)
    }
    generateId= async()=>{
        let list= await this.getCartsList()
        if(list.length === 0) return 1
        return list[list.length-1].cid +1
    }
    createCart = async() =>{
        const newCart= {products:[]}
        const result= await cartService.save(newCart)
        return result
    }
    getProductsFromACart= async(cid)=>{
        const cartToShow = await cartService.getById(cid).populate('products.pid').lean().exec()
        return(cartToShow)
    }
    getCartById=async(cid)=>{
        try {
            const cart= await cartService.getById(cid)
            return (cart)
        } catch (error) {
            console.log(error)
        }
    }
    addProductToCart= async(cid, pid)=>{
        const cartSelected= await cartService.getById(cid)
        const repeat= cartSelected.products.find(x => x.pid == pid)
        if(repeat != undefined){
            repeat.qty++
        }else{
            cartSelected.products.push({
                pid: pid,
                qty: 1            
            })
        }
        const result= await cartService.update(cartSelected, cid)
        console.log(result)
        console.log(`Product ${pid} added to cart ${cid}`)

    }
    deleteOneCart= async(cid)=>{
        const toDelete= await cartService.delete(cid)
        console.log(toDelete)
    }
    deleteOneProductFromACart= async(cid, pid)=>{
        const cartSelected= await cartService.getById(cid)
        const productToDelete= cartSelected.products.find(x => x.pid == pid)
        const idx= cartSelected.products.findIndex(x => x.pid == pid)
        if(productToDelete.qty > 1){
            productToDelete.qty = productToDelete.qty-1
        }else{
            cartSelected.products.splice(idx, 1)
        }
        const result= await cartService.update( cid, cartSelected)
        console.log(`Product ${pid} eliminated from cart${cid}`)
        console.log(result)
    }
    updateCart= async(cid, newData)=>{
        const cartToUpdate= await cartService.getById(cid)
        cartToUpdate.products=[]
        cartToUpdate.products.push(newData)
        const result= await cartService.update(cid, cartToUpdate)
        console.log(result)
    }
    updateProductQty= async(cid, pid, newQty)=>{
        const cartToUpdate= await cartService.getById(cid)
        //delete the old product
        const productIdx = cartToUpdate.products.findIndex(x => x.pid == pid)
        cartToUpdate.products.splice(productIdx, 1)
        //push the new one
        cartToUpdate.products.push({
            pid: pid,
            qty: newQty
        })
        const result= await cartService.update(cid, cartToUpdate)
        console.log(result)
    }
}

export default CartManager