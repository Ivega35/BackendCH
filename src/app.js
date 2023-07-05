import express from 'express'
import handlebars from 'express-handlebars'
import mongoose from 'mongoose'
import session from 'express-session'
import env from './config/environment.config.js'

import productsRouter from './routes/products.router.js'
import CartsRouter from './routes/carts.router.js'
import viewsRouter from './routes/view.router.js'
import sessionsRouter from './routes/sessions.router.js'
import passport from 'passport'
import initializePassport from './config/passport.config.js'
import cookieParser from 'cookie-parser'
import { passportCall } from './utils.js'

mongoose.set("strictQuery", false)

const app= express()

//Json setup
app.use(express.json())
app.use(express.urlencoded({extended:true}))
//app.use(express.static('./src/public'))
app.use(cookieParser())

//handlebars setup
app.engine('handlebars', handlebars.engine())
app.set('views', './src/views')
app.set('view engine', 'handlebars')

app.use(session({
    secret: env.session_secret,
    resave: true,
    saveUninitialized: true
}))
//passport config
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

//Routers
app.use('/api/products', productsRouter)
app.use('/api/carts', CartsRouter)

app.use('/products', passportCall('jwt'), viewsRouter)
app.use('/session', sessionsRouter)
//Mongoose and server
try {
    await mongoose.connect(env.mongo_uri)
    console.log('DBs connected!')
    app.listen(env.port, ()=>console.log("Server up"))
}catch(error){
    console.log(error)
}

