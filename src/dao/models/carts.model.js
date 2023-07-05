import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

const cartCollection= "carts"

const cartsSchema= new mongoose.Schema({
    products: {
        type: [
            {
                pid: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref:"products"
                },
                qty: {
                    type: Number,
                    default:1
                }
            }
        ]
    }
})

cartsSchema.plugin(mongoosePaginate)
const cartsModel= mongoose.model(cartCollection, cartsSchema)

export default cartsModel