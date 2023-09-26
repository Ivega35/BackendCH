import { Router } from "express";
import usersController from "../controllers/users.controller.js";

const router= Router()

router.get('/', usersController.getUsers)
router.get('/update/:uid', usersController.updateUser)
router.post('/update/:uid', usersController.updateUser)
router.delete('/delete', usersController.deleteExpiringUser)
export default router
