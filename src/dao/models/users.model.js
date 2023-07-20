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
                    enum:['user','admin']
                },
            password: String,
            cart: String
        }
    }
}