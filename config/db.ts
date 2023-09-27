import mongoose, { Connection } from "mongoose";

const connetDb = async (): Promise<Connection> => {
    try {
        const con = await mongoose.connect('mongodb://0.0.0.0:27017/rolebase');
        console.log('database connected..');
        return con.connection;
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

export default connetDb