import { fileURLToPath } from 'url'
import { dirname } from 'path'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import passport from 'passport'
import env from './config/environment.config.js'


const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default __dirname
//bycript
export const createHash = password => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

export const isValidPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password)
}
//jwt
export const generateToken = (user) => {
    const token = jwt.sign({ user }, env.jwt_private_key, { expiresIn: '24h' })
    return token
}
export const extractCookie = (req) => {
    return (req && req.cookies) ? req.cookies[env.jwt_cookie_name] : null
}
//passport
export const passportCall = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, function (err, user, info) {
            if (err) return next(err)
            if (!user) return res.status(401).render('errors/base', { error: info.messages ? info.message : info.toString() })
            //userDTO
            req.user = user
            next()
        })(req, res, next)
    }
}