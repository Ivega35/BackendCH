export default class TicketModel{
    static get model(){
        return 'tickets'
    }

    static get schema(){
        return{
            code: String,
            purchase_datetime: Date,
            amount: Number,
            purchaser: String
        }
    }
}