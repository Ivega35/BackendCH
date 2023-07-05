import { Router } from "express";
import passport from "passport";
import env from '../config/environment.config.js'
const router= Router()
// GET /session/register --> Shows the register form
router.get('/register',(req, res)=>{
    res.render('sessions/register')
})
//POST /session/register --> Registers an user by passport
router.post('/register',
    passport.authenticate('register', {failureRedirect: '/session/failureRegister'}),
    async(req, res)=>{
    res.redirect('/session/login')
})
//GET /session/failureRegister --> Shows an error in the register process
router.get('/failureRegister', (req, res) =>{
    res.send({error: 'failed'})
})
//GET /session/login --> Shows a login form
router.get('/login', (req, res)=>{
    res.render('sessions/login')
})
//POST /session/login --> Validates credentials
router.post('/login',
    passport.authenticate('login', {failureRedirect: '/session/failLogin'}),
    async(req, res)=>{
    
    if(!req.user){
        return res.status(400).send({status: 'error', error: 'invalid credentials'})
    }
   
    res.cookie(env.jwt_cookie_name, req.user.token).redirect('/products')
    
})
//GET /session/failLogin --> Shows an error in the login process
router.get('/failLogin', (req,res)=>{
    res.send({error: 'fail in login'})
})
//GET /session/github--> to auth by git
router.get('/github', passport.authenticate('github', {scope:['user: email']}), (req, res)=>{})
//GET /session/githubcallback --> Where redirect when the auth by git is succesfully
router.get('/githubcallback', 
    passport.authenticate('github', {failureRedirect: '/session/login'}),
    async(req, res)=>{
        req.session.user= req.user
        res.redirect('/products')
    })
//GET /session/logout --> Destroys the session
router.get('/logout', (req, res)=>{
    res.clearCookie(env.jwt_cookie_name).redirect('/session/login')
})
export default router
