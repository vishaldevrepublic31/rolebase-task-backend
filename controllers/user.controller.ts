import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'

import User from '../models/user.model'
import Product from '../models/product.model';

interface CustomRequest extends Request {
    id?: string;
}

const register = async (req: Request, res: Response): Promise<any> => {
    const { name, email, password } = req.body

    try {

        if (!name || !email || !password) return res.status(400).json({
            success: false,
            message: "All fields are required"
        })

        const existingUser = await User.findOne({ email })
        if (existingUser) return res.status(400).json({
            success: false,
            message: "User already register!"
        })

        const user = await User.create({
            name,
            email,
            password
        })
        if (!user) return res.status(400).json({
            success: false,
            message: "Registration failed!"
        })

        res.status(201).json({
            success: true,
            message: "User registration successfully!",
            user
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Somthing went wrong"
        })
    }
}

const login = async (req: Request, res: Response): Promise<any> => {
    const { email, password } = req.body
    try {
        if (!email || !password) return res.status(400).json({
            success: false,
            message: "All fields are required"
        })

        const user = await User.findOne({ email })
        if (!user) return res.status(400).json({
            success: false,
            message: "User not found please register your account"
        })

        const comparePassword = await bcrypt.compare(password, user.password)
        if (!comparePassword) return res.status(400).json({
            success: false,
            message: "Invalid email or password"
        })


        const token: string = await user.generateJWTToken()

        res.status(200).json({
            success: true,
            message: "User login successfully",
            user,
            token
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Somthing went wrong"
        })
    }
}

const profile = async (req: CustomRequest, res: Response): Promise<any> => {
    const id: string | undefined = req.id;

    try {
        const user = await User.findById(id).populate("cart");

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching user data"
        });
    }
};


const getUsers = async (req: Request, res: Response): Promise<any> => {

    try {
        const users = await User.find({})
        if (!users) return res.status(400).json({
            success: false,
            message: "User not found"
        })
        res.status(200).json({
            success: true,
            users
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Somthing went wrong"
        })
    }
}

const updateProfile = async (req: CustomRequest, res: Response): Promise<any> => {
    const id = req.id
    const { name } = req.body
    try {
        if (!id) return res.status(400).json({
            success: false,
            message: "user not loggedin"
        })
        const user = await User.findById(id)
        if (!user) return res.status(400).json({
            success: false,
            message: "user not found"
        })

        user.name = name || user.name
        await user.save()
        res.status(200).json({
            success: true,
            message: "Profile update succesfully"
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Somthing went wrong"
        })
    }
}

const changeRole = async (req: CustomRequest, res: Response): Promise<any> => {
    const id = req.id
    const userId = req.params.userId
    const { role } = req.body
    console.log(role)
    try {
        const superUser = await User.findById(id)
        if (!superUser) return res.status(400).json({
            success: false,
            message: "user not found"
        })
        if (superUser.role === 'super') {
            const user = await User.findById(userId)
            if (!user) return res.status(400).json({
                success: false,
                message: "user not found"
            })
            user.role = role || user.role
            await user.save()
            res.status(200).json({
                success: true,
                message: "User role updated"
            })
        } else {
            return res.status(400).json({
                success: false,
                message: "you are a not a super user"
            })

        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Somthing went wrong"
        })
    }
}


const deleteUser = async (req: CustomRequest, res: Response): Promise<any> => {
    const userId = req.params.id
    const loggedInUserId = req.id

    try {
        const loggedIn = await User.findById(loggedInUserId)
        if (!loggedIn || loggedIn.role !== 'super') return res.status(401).json({
            success: false,
            message: "unauthorized access"
        })
        const user = await User.findById(userId)
        if (!user) return res.status(400).json({
            success: false,
            message: "User not found"
        })
        if (user!.role === 'super') return res.status(400).json({
            success: false,
            message: "User is super user , you can not delete this user"
        })
        const deleteUsre = await User.findByIdAndDelete(userId)
        if (!deleteUsre) return res.status(400).json({
            success: false,
            message: "user not found"
        })
        res.status(200).json({
            success: true,
            message: 'User delete successfully!'
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Somthing went wrong"
        })
    }
}

const addCart = async (req: CustomRequest, res: Response): Promise<any> => {
    const productId = req.params.id
    console.log("Prod ID =>", productId);

    const userId = req.id
    console.log("User ID =>", userId);

    try {
        if (!productId) return res.status(400).json({
            success: false,
            message: "product not found"
        })

        const user = await User.findById(userId)
        if (!user) return res.status(400).json({
            success: false,
            message: "User not found"
        })
        const product: any = await Product.findById(productId)
        if (!product) return res.status(400).json({
            success: false,
            message: "product not found"
        })
        if (user.cart.includes(product._id)) return res.status(400).json({
            success: false,
            message: "Product already in cart"
        })
        const add = user.cart.push(product)
        console.log("Add =>", add);
        await user.save()
        res.status(200).json({
            success: true,
            message: "Product add to cart"
        })


    } catch (error) {
        console.log("Backend Error =>", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong on the server"
        });
    }
}

const deleteProductInCart = async (req: CustomRequest, res: Response): Promise<any> => {
    const productId = req.params.id
    const userId = req.id
    try {
        if (!productId) return res.status(400).json({
            success: false,
            message: "product not found"
        })

        const user = await User.findById(userId)
        if (!user) return res.status(400).json({
            success: false,
            message: "User not found"
        })
        const product: any = await Product.findById(productId)
        if (!product) return res.status(400).json({
            success: false,
            message: "product not found"
        })
        if (!user.cart.includes(product._id)) return res.status(400).json({
            success: false,
            message: "Product not found in cart"
        })
        await User.findByIdAndUpdate(userId, {
            $pull: { cart: productId }
        });
        await user.save()
        res.status(200).json({
            success: true,
            message: "Product remove Successfully in cart"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Somthing went wrong"
        })
    }
}
export { register, login, profile, updateProfile, changeRole, getUsers, deleteUser, addCart, deleteProductInCart }