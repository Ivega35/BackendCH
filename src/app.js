import express from 'express'
import handlebars from 'express-handlebars'
import mongoose from 'mongoose'
import session from 'express-session'
import MongoStore from 'connect-mongo'

import productsRouter from './routes/products.router.js'
import CartsRouter from './routes/carts.router.js'
import viewsRouter from './routes/view.router.js'
import sessionsRouter from './routes/sessions.router.js'
mongoose.set("strictQuery", false)

const app= express()
//database URL
const uri="mongodb+srv://ivega98:teamrocket@cluster0.vhbmpwg.mongodb.net/E-comDB"

//Json setup
app.use(express.json())
app.use(express.urlencoded({extended:true}))
//app.use(express.static('./src/public'))

//handlebars setup
app.engine('handlebars', handlebars.engine())
app.set('views', './src/views')
app.set('view engine', 'handlebars')

app.use(session({
    store: MongoStore.create({
        mongoUrl: uri,
        dbName: 'E-comDB'
    }),
    secret: 'adminCod3r123',
    resave: true,
    saveUninitialized: true
}))
//Routers
app.use('/api/products', productsRouter)
app.use('/api/carts', CartsRouter)

app.use('/products', viewsRouter)
app.use('/session', sessionsRouter)
//Mongoose and server
try {
    await mongoose.connect(uri)
    console.log('DBs connected!')
    app.listen(8080, ()=>console.log("Server up"))
}catch(error){
    console.log(error)
}

