import repository from "./repository.js";
import TicketModel from "../dao/models/ticketModel.js";

export default class TicketService extends repository{
    constructor(dao){
        super(dao, TicketModel.model)
    }
}