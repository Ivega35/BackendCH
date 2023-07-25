import indexRouter from "./indexRouter.js"
import jwt from 'jsonwebtoken'
import environmentConfig from "../../config/environment.config.js"

export default class ProductsRouter extends indexRouter {
    init() {
        this.get('/', ['USER'], (req, res) => {
            const cookieName= environmentConfig.jwt_cookie_name
            const user= req.cookies.cookieName
            const token = jwt.sign(user, 'secret')
            res.sendSuccess(token)
        })

        this.post('/:word', ['USER', 'ADMIN', 'PUBLIC'], (req, res) => {
            if (req.params.word === 'x') res.sendUserError('No puede enviar esta palabra')
            else res.sendSuccess('Word added!')
        })
    }
}