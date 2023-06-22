import passport from "passport";
import local from 'passport-local'
import userModel from "../models/users.model.js";
import cartManager from "../management/cartManager.js";
import { createHash, generateToken, extractCookie, JWT_PRIVATE_KEY } from "../utils.js";
import githubStrategy from 'passport-github2'
import passport_jwt, { ExtractJwt } from 'passport-jwt'

const LocalStrategy= local.Strategy
const JWTStrategy= passport_jwt.Strategy
const cm= new cartManager()
const initializePassport=()=>{
    //register
    passport.use('register', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async(req, username, password, done)=>{
        const {first_name, last_name, age, email}= req.body
        try {
            const user= await userModel.findOne({ email: username})
            if(user){
                console.log('User already exists')
                return done(null, false)
            }
            const cart= await cm.createCart()
            const newUser={
                first_name, last_name, age, email,
                password: createHash(password),
                cart: cart._id
            }
            if(email== 'adminCoder@coder.com'){
                newUser.rol= 'admin'  
            }else{
                newUser.rol='user'
            } 
            const result = await userModel.create(newUser)
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
            const user= await userModel.findOne({email: username})
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
        clientID:'Iv1.78851299d95c033d' ,
        clientSecret:'29b50b9539d7c856e16da336ea189328dd2fe9d9' ,
        callbackURL:'http://localhost:8080/session/githubcallback'
    }, async(accessToken, refreshToken, profile, done)=>{
        try {
            const user= await userModel.findOne({email: profile._json.email})
            if(user)return done(null, user)
            const newUser= await userModel.create({
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
        secretOrKey: JWT_PRIVATE_KEY 
    }, async(jwt_payload, done)=>{
        done(null, jwt_payload)
    }))
    //user des/serialize
    passport.serializeUser((user, done)=>{
        done(null, user._id)
    })
    passport.deserializeUser(async(id, done)=>{
        const user= await userModel.findById(id)
        done(null, user)
    })

}
export default initializePassport