import UserManager from "../dao/userManager.js";

const userManager= new UserManager()

const getUsers= async(req, res)=>{
    const result= await userManager.getUsers()
    let hbsUsers=[]
    for (let index = 0; index < result.length; index++) {
        const user= {
            _id: result[index]._id,
            fullname: result[index].first_name + ' ' + result[index].last_name,
            email: result[index].email,
            rol: result[index].rol
        }
        hbsUsers.push(user)
    }
    res.render('users' , {hbsUsers})
}
const updateUser= async(req, res)=>{
    const userId= req.params.uid
    const newRol= req.body
    await userManager.changeRol(userId, newRol)
    const user= await userManager.getUserById(userId)
    const result= {
        _id: user.user._id,
        first_name: user.user.first_name,
        last_name: user.user.last_name,
        email: user.user.email,
        rol: user.user.rol,
        }
        console.log(result)
    res.render('updateUser', { result })
}

const deleteExpiringUser= async(req, res)=>{
    await userManager.deleteExpiringUsers()
}
export default{getUsers, updateUser, deleteExpiringUser}