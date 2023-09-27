import { Request, Response, NextFunction } from 'express'
import User from '../models/user.model';
import Product from '../models/product.model';
interface CustomRequest extends Request {
    id?: string;
}
interface IPoduct {
    save(): unknown;
    title: string
    description: string
}
const createProduct = async (req: CustomRequest, res: Response): Promise<any> => {
    const id = req.id
    const { title, description, price } = req.body
    try {
        if (!title || !description || !price) return res.status(200).json({
            success: false,
            message: "All fields are required"
        })
        const user = await User.findById(id)
        if (!user) return res.status(400).json({
            success: false,
            message: "User not found"
        })
        if (user.role !== 'supplier') {
            return res.status(400).json({
                success: false,
                message: "You are a not supplier"
            })
        }
        const product: IPoduct = await Product.create({
            title,
            description,
            price
        })

        await product.save()
        res.status(201).json({
            success: true,
            message: "Product created!",
            product
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Somthing went wrong"
        })
    }
}

const getAllproduct = async (req: Request, res: Response): Promise<any> => {
    try {
        const products = await Product.find({})
        if (!products) return res.status(400).json({
            success: false,
            message: "Not yet any product"
        })
        res.status(200).json({
            success: true,
            products
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Somthing went wrong"
        })
    }
}

const updateProduct = async (req: CustomRequest, res: Response): Promise<any> => {
    const id = req.id
    const { title, description, price } = req.body
    const productId = req.params.id
    try {
        const user = await User.findById(id)
        if (!user) return res.status(400).json({
            success: false,
            message: "User not found"
        })
        if (user.role !== 'supplier') {
            return res.status(400).json({
                success: false,
                message: "You are a not supplier"
            })
        }
        const product = await Product.findById(productId)
        if (!product) return res.status(400).json({
            success: false,
            message: "Product not Found!"
        })
        product.title = title || product.title
        product.description = description || product.description
        product.price = price || product.price

        await product.save()
        res.status(200).json({
            success: true,
            message: "Product update successfully",
            product
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Product not Found!"
        })
    }
}
const getSingleproduct = async (req: CustomRequest, res: Response): Promise<any> => {
    const id: string = req.params.id
    console.log("ID=>", id);

    try {
        const product = await Product.findById(id)
        console.log(product)
        if (!product) return res.status(400).json({
            success: false,
            message: "product not found"
        })
        res.status(200).json({
            success: true,
            product
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "product not found"
        })
    }
}

const deleteProduct = async (req: CustomRequest, res: Response): Promise<any> => {
    const id = req.id
    const productId = req.params.id
    try {
        const user = await User.findById(id)
        if (!user) return res.status(400).json({
            success: false,
            message: "User not found"
        })

        if (user.role !== 'supplier') {
            return res.status(400).json({
                success: false,
                message: "You are a not supplier"
            })
        }
        const product: any = await Product.findByIdAndDelete(productId)
        if (!product) return res.status(400).json({
            success: false,
            message: "Product not Found."
        })

        res.status(200).json({
            success: true,
            message: "Product delete successfully!"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong!",
            error,
        });
    }
}

export { createProduct, getAllproduct, updateProduct, deleteProduct, getSingleproduct }