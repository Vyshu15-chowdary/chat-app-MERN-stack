 import mongoose from "mongoose";


 //connection to mongodb

 export const connectDB = async () => {
    try {
            mongoose.connection.on('connected',()=> console.log(
                'databaseconnected succesfully'
            ))

        await mongoose.connect(`${process.env.MONGODB_URI}/chat-app`)
    }catch(error){

        console.log(error);

    }
 }