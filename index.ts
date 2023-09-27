import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import connetDb from './config/db'
import userRoutes from './routes/user.routes'
import productRoutes from './routes/product.routes'

const app = express()
const PORT = 5000
// dot env 
dotenv.config()

// database
connetDb()
// middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.use(morgan("dev"));

app.use('/api/v1/user', userRoutes)
app.use('/api/v1/product', productRoutes)


app.listen(PORT, () => {
    console.log(`server start on ${PORT} `)
})