import mongoose from "mongoose"
export default class UserModel{

    static get model(){
        return 'users'
    }

    static get schema(){
        return {
            first_name: String,
            last_name: String,
            email: String,
            age: Number,
            rol: {
                    type: String,
                    enum:['user','admin', 'premium']
                },
            password: String,
            cart: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "carts"
            },
            last_connection: Date
            
        }
    }
}