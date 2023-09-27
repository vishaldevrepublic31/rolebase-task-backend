import mongoose, { Model, Schema } from "mongoose"

interface IProduct extends Document {
    title: string
    description: string
    price: number
}

const productSchema: Schema<IProduct> = new mongoose.Schema<IProduct>({
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true,
        lowercase: true
    },
    description: {
        type: String,
        required: [true, "Title is required"],
        trim: true,
        lowercase: true
    },
    price: {
        type: Number,
        required: [true, "Price is required!"]
    }
}, {
    timestamps: true
})

const Product: Model<IProduct> = mongoose.model<IProduct>('Product', productSchema)
export default Product