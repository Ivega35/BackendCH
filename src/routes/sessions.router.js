import { Router } from "express";
import userModel from "../models/users.model.js";

const router= Router()

router.get('/register', (req, res)=>{
    res.render('sessions/register')
})

router.post('/register', async(req, res)=>{
    const userNew= req.body
    if(userNew.email=='adminCoder@coder.com'){
        userNew.rol= 'admin'
    }else{
        userNew.rol= 'user'
    }
    const user= new userModel(userNew)
    await user.save()
    res.redirect('/session/login')
})

router.get('/login', (req, res)=>{
    res.render('sessions/login')
})
router.post('/login', async(req, res)=>{
    const {email, password}= req.body
    const user= await userModel.findOne({email, password}).lean().exec()
    if(!user){
        return res.status(401).render('errors/base',{
          error:'Email or password wrong'  
        })
    }
    if(user.email=='adminCoder@coder.com'){
        user.rol= 'admin'
    }else{
        user.rol= 'user'
    }
    req.session.user= {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        rol: user.rol
    }
    
    res.redirect('/products')
})

router.get('/logout', (req, res)=>{
    req.session.destroy(err=>{
        if(err){
            res.status(500).render('errors/base',{error: err})
        }else{
            res.redirect('/session/login')
        }
    })
})
export default router
