import mongoose from "mongoose"
export default class CartModel {

    static get model() {
        return 'carts'
    }

    static get schema() {
        return {
            products: {
                type: [
                    {
                        pid: {
                            type: mongoose.Schema.Types.ObjectId,
                            ref: "products"
                        },
                        qty: {
                            type: Number,
                            default: 1
                        }
                    }
                ]
            }
        }
    }
}