import passport from "passport";
import local from 'passport-local'
import CartManager from "../dao/cartManager.js";
import { createHash, generateToken, extractCookie} from "../utils.js";
import githubStrategy from 'passport-github2'
import passport_jwt, { ExtractJwt } from 'passport-jwt'
import env from './environment.config.js'
import { userService } from "../services/index.js";

const LocalStrategy= local.Strategy
const JWTStrategy= passport_jwt.Strategy
const cartManager= new CartManager()

const initializePassport=()=>{
    //register
    passport.use('register', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async(req, username, password, done)=>{
        const {first_name, last_name, age, email}= req.body
        try {
            const user= await userService.getByEmail(username)
            if(user){
                console.log('User already exists')
                return done(null, false)
            }
            const cart= await cartManager.createCart()
            if(email== 'adminCoder@coder.com'){
                const rol= 'admin'  
            }else{
                const rol='user'
            } 
            const cartAsignated= cart._id
            const newUser={
                fullName: `${first_name} ${last_name}`, age, email,
                password: createHash(password),
                rol: rol,
                cart:cartAsignated
            }
            const result = await userService.create(newUser)
            return done(null, result)
        } catch (error) {
            return done("error in register by passport" + error)
        }
    }))
    //login
    passport.use('login', new LocalStrategy({
        usernameField: 'email'
    }, async(username, password, done)=>{
        try {
            const user= await userService.getByEmail(username)
            if(!user){
                console.log('User doesnt exist')
                return done(null, user)
            }
            const token= generateToken(user)
            user.token= token
            return done(null, user)
        } catch (error) {
            return done('error')
        }
    }))
    //github login
    passport.use('github', new githubStrategy({
        clientID: env.clientID ,
        clientSecret: env.clientSecret ,
        callbackURL: env.callbackURL
    }, async(accessToken, refreshToken, profile, done)=>{
        try {
            const user= await userService.getByEmail(profile._json.email)
            if(user)return done(null, user)
            const newUser= await userService.create({
                first_name: profile._json.name,
                email: profile._json.email
            })
            return done(null, newUser)
        } catch (error) {
            return done('error to login with github')
        }
    }
    ))
    //jwt
    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([extractCookie]),
        secretOrKey: env.jwt_private_key
    }, async(jwt_payload, done)=>{
        done(null, jwt_payload)
    }))
    //user des/serialize
    passport.serializeUser((user, done)=>{
        done(null, user._id)
    })
    passport.deserializeUser(async(id, done)=>{
        const user= await userService.getById(id)
        done(null, user)
    })

}
export default initializePassport