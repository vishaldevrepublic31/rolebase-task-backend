import mongoose, { Model, Schema } from "mongoose"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
interface IUser extends Document {
    name: string
    email: string
    password: string
    role: string
    cart: mongoose.Types.ObjectId[]
    generateJWTToken: () => Promise<string>
    comparePassword: () => Promise<string>
}

const userSchema: Schema<IUser> = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required!'],
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please fill in a valid email address",
        ],
    },
    password: {
        type: String,
        required: [true, "password is required"]
    },
    role: {
        type: String,
        enum: ['super', 'supplier', 'buyer'],
        default: 'buyer'
    },
    cart: [{
        type: mongoose.Types.ObjectId,
        default: [],
        ref: 'Product'
    }]
}, {
    timestamps: true
})

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 10);
})

userSchema.methods = {
    generateJWTToken: async function () {

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT secret key is not defined.");
        }

        return await jwt.sign(
            { id: this._id, role: this.role },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRY,
            }
        );
    },
}
const User: Model<IUser> = mongoose.model<IUser>("User", userSchema)
export default User