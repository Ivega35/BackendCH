import express from 'express'
import handlebars from 'express-handlebars'
import mongoose from 'mongoose'
import session from 'express-session'
import MongoStore from 'connect-mongo'

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
//database URL
const uri="mongodb+srv://ivega98:teamrocket@cluster0.vhbmpwg.mongodb.net/E-comDB"

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
    secret: 'adminCod3r123',
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
    await mongoose.connect(uri)
    console.log('DBs connected!')
    app.listen(8080, ()=>console.log("Server up"))
}catch(error){
    console.log(error)
}

