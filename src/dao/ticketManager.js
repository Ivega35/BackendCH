import { ticketService } from "../services/index.js";
import { cartService } from "../services/index.js";
import nodemailer from 'nodemailer'
import environmentConfig from "../config/environment.config.js";
import createLogger from '../logs/logger.js'

export default class TicketManager {

    generateTicket = async (cid, purchaser) => {
        const code = await this.validateCode()
        const populate = 'products.pid'
        const cart = await cartService.getByIdPopulate(cid, populate)
        const products = cart.products
        let amount = 0
        products.forEach(product => {
            const price = product.pid.price
            const qty = product.qty
            amount = amount + (price * qty)
        })
        const ticket = {
            code,
            amount,
            purchaser
        }
        await ticketService.save(ticket)
        await this.sendTickets(purchaser)
    }
    generateCode = () => {
        const charsAvaible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
        let string = "";
        for (let i = 0; i < 6; i++) {
            string += charsAvaible.charAt(Math.floor(Math.random() * charsAvaible.length));
        }
        return string
    }
    validateCode = async () => {
        const list = await ticketService.get()
        let code;
        let auxCode;
        do {
            code = this.generateCode()
            auxCode = list.find(x => x.code == code)
        } while (auxCode != undefined)
        return code
    }
    sendTickets = async (purchaser) => {

        const config = {
            service: 'gmail',
            auth: {
                user: environmentConfig.gmail_user,
                pass: environmentConfig.gmail_pass
            }
        }
        const transporter = nodemailer.createTransport(config)
        const message = {
            from: environmentConfig.gmail_user,
            to: purchaser,
            subject: 'Purchase finished',
            html: "your purchase has been successfully. Your product/s will arrive in 14 days. Thank you for your confidence."
        }
        transporter.sendMail(message)
    }
}