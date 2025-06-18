import express from 'express';
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from './routes/userRoute.js';
import messageRouter from './routes/messageRoute.js';
import { Server } from "socket.io";

//creating express app and http server

const app = express();
const server = http.createServer(app)

//intialize socket.io server

export const io = new Server(server,{
    cors:{origin:"*"}
})

//store onlline users

export const usersocketMap = { }; //{userId:socketId}

//socket.io connection handler

io.on("connection",(socket)=>{

    const userId = socket.handshake.query.userId;
    console.log("user connected",userId);

    if (userId) usersocketMap[userId] = socket.id;

    //emit online users to all connected clients

    io.emit("getonlineUsers",Object.keys(usersocketMap));

    socket.on("disconnect",()=>{
        console.log("user Disconnected",userId);
        delete usersocketMap[userId];
        io.emit("getOnlineUsers",Object.keys(usersocketMap));
    })
})

//middleware setup

app.use(express.json({limit: "4mb"})); //we can uplod imgs upto 4mb

app.use(cors()); //allow on the url to connect with the backend

app.use("/api/messages",messageRouter)


//Routes setup
app.use("/api/status",(req,res)=> res.send("Server is live"));
app.use("/api/auth",userRouter);

//connect to mongodb

await connectDB ();

const PORT = process.env.PORT || 5000;

server.listen(PORT,()=> console.log("sever is now running on PORT:"+PORT)
);