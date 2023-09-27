import express from 'express'
import { changeRole, login, profile, register, updateProfile, getUsers, deleteUser, addCart, deleteProductInCart } from '../controllers/user.controller'
import isLoggedin from '../middlewares/auth.middleware'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/addcart/:id', isLoggedin, addCart)
router.post('/removeProduct/:id', isLoggedin, deleteProductInCart)
router.get('/users', getUsers)
router.get('/me', isLoggedin, profile)
router.put('/update-profile', isLoggedin, updateProfile)
router.put('/change-role/:userId', isLoggedin, changeRole)
router.delete('/delete/:id', isLoggedin, deleteUser)
export default router