import {fileURLToPath} from 'url'
import { dirname } from 'path'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import passport from 'passport'
import env from './config/environment.config.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default __dirname

export const createHash = password => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

export const isValidPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password)
}

export const generateToken= (user)=>{
    const token= jwt.sign({user}, env.jwt_private_key, {expiresIn: '24h'} )
    return token
}
export const extractCookie= (req)=>{
    return (req && req.cookies) ? req.cookies[env.jwt_cookie_name] : null
}
export const passportCall= (strategy)=>{
    return async(req, res, next)=>{
        passport.authenticate(strategy, function(err, user, info){
            if(err)return next(err)
            if(!user) return res.status(401).render('errors/base', {error: info.messages ? info.message : info.toString()})
            req.user= user
            next()
        })(req, res, next)
    }
}
export const decode = (token)=>{
    const decoded = jwt.decode(token, env.jwt_private_key);
    return decoded
}

export const isAdmin = (req, res, next) => {
    const user = req.user
    console.log(user)
    let isAdminUser = false;
  
    if (user.rol == "admin") {
      isAdminUser = true;
      next();
    } else {
      res.status(403).render("errors/base", {
        message: "No auth",
      });
    }
  };