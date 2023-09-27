import express from 'express'
import isLoggedin from '../middlewares/auth.middleware'
import { createProduct, deleteProduct, getAllproduct, getSingleproduct, updateProduct } from '../controllers/product.controller'

const router = express.Router()

router.get('/', getAllproduct)
router.get('/product/:id', getSingleproduct)
router.post('/create', isLoggedin, createProduct)
router.put('/update-product/:id', isLoggedin, updateProduct)
router.delete('/delete-product/:id', isLoggedin, deleteProduct)


export default router