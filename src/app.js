import express from 'express'
import handlebars from 'express-handlebars'
import mongoose from 'mongoose'
import { Server } from 'socket.io'

import productsRouter from './routes/products.router.js'
import CartsRouter from './routes/carts.router.js'
import viewsRouter from './routes/view.router.js'

import cartManager from './management/cartManager.js'

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
//Routers
app.use('/api/products', productsRouter)
app.use('/api/carts', CartsRouter)
app.use('/', viewsRouter)
//Mongoose, server & socket
try {
    await mongoose.connect(uri)
    console.log('DBs connected!')
    const httpServer= app.listen(8080, ()=>console.log("Server up"))

    // const socketServer= new Server(httpServer) //-->handshake server side
    // const cm= new cartManager()
    // socketServer.on('connection', (socketClient)=>{
        
    //     console.log('user conected')
        
    //     socketClient.on('addToCart', productId =>{
    //         cm.addProductToCart(productId)
    //     })

    //})

}catch(error){
    console.log(error)
}

