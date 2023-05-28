import cartsModel from "../models/carts.model.js"

class cartManager{
    
    getCartsList= async()=>{
        const cartsList= await cartsModel.find({}).lean().exec()
        return(cartsList)
    }
    generateId= async()=>{
        let list= await this.getCartsList()
        if(list.length === 0) return 1
        return list[list.length-1].cid +1
    }
    createCart = async() =>{
        const newCart= {products:[]}
        const cartGenerated= new cartsModel(newCart)
        await cartGenerated.save()
        return cartGenerated
    }
    getProductsFromACart= async(cid)=>{
        const cartToShow = await cartsModel.findOne({_id: cid}).populate('products.pid').lean().exec()
        return(cartToShow)  
    }
    getCartById=async(cid)=>{
        try {
            const cart= await cartsModel.paginate({_id: cid},{
                limit:1,
                page:1,
                lean:true
               })
            return (cart)
        } catch (error) {
            console.log(error)
        }
    }
    addProductToCart= async(cid, pid)=>{
        const cartSelected= await cartsModel.findOne({_id: cid})
        const repeat= cartSelected.products.find(x => x.pid == pid)
        if(repeat != undefined){
            repeat.qty++
        }else{
            cartSelected.products.push({
                pid: pid,
                qty: 1            
            })
        }
        const result= await cartsModel.updateOne({_id:cid}, cartSelected)
        console.log(result)
        console.log(`Product ${pid} added to cart ${cid}`)

    }
    deleteOneCart= async(cid)=>{
        const deleted= await cartsModel.deleteOne({_id:cid})
        console.log(deleted)
    }
    deleteOneProductFromACart= async(cid, pid)=>{
        const cartSelected= await cartsModel.findOne({_id: cid})
        const productToDelete= cartSelected.products.find(x => x.pid == pid)
        const idx= cartSelected.products.findIndex(x => x.pid == pid)
        if(productToDelete.qty > 1){
            productToDelete.qty = productToDelete.qty-1
        }else{
            cartSelected.products.splice(idx, 1)
        }
        const result= await cartsModel.updateOne({_id:cid}, cartSelected)
        console.log(`Product ${pid} eliminated from cart${cid}`)
        console.log(result)
    }
    updateCart= async(cid, newData)=>{
        const cartToUpdate= await cartsModel.findOne({_id:cid})
        cartToUpdate.products=[]
        cartToUpdate.products.push(newData)
        const result= await cartsModel.updateOne({_id:cid}, cartToUpdate)
        console.log(result)
    }
    updateProductQty= async(cid, pid, newQty)=>{
        const cartToUpdate= await cartsModel.findOne({_id:cid})
        //delete the old product
        const productIdx = cartToUpdate.products.findIndex(x => x.pid == pid)
        cartToUpdate.products.splice(productIdx, 1)
        //push the new one
        cartToUpdate.products.push({
            pid: pid,
            qty: newQty
        })
        const result= await cartsModel.updateOne({_id:cid}, cartToUpdate)
        console.log(result)
    }
}




export default cartManager