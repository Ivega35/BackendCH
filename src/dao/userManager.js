import { userService } from "../services/index.js"
import TicketManager from "./ticketManager.js"
const ticketManager= new TicketManager()

class UserManager {

    getUsers = async () => {
        const users = await userService.get()
        return (users)
    }
    changeRol = async (userId, newRol) => {
        await userService.update(newRol, userId)
    }
    deleteUser = async (userId) => {
        try {
            await userService.delete(userId)
        } catch (err) {
            console.log(err)
        }
    }
    getUserById = async (userId) => {
        try {
            console.log(userId)
            const user = await userService.getById(userId)
            return { user }
        } catch (error) {
            console.log(err)
        }
    }
    updateLastConnection = async (email) => {
        const user = await userService.getByEmail(email)
        const date = new Date(Date.now())
        const newDate = {
            last_connection: date
        }
        await userService.update(newDate, user._id.toString())
    }
    deleteExpiringUsers = async () => {
        const limitDate= new Date(2023,9,22);
        const users = await this.getUsers()
        for (let idx = 0; idx < users.length; idx++) {
            const user = users[idx];
            const lastConnection = user.last_connection
            const userId= user._id.toString()
            if(limitDate > lastConnection) await this.deleteUser(userId)
            await ticketManager.deleteTicket(user.email)
        }
        
    }
}
export default UserManager