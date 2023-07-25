export default class UserDTO {

    constructor(user) {

        this.id = user._id.toString()
        this.fullname = `${user.first_name} ${user.last_name}`
        this.email = user.email
        this.rol = user.rol
        this.cart = user.cart.toString()
    }
}

