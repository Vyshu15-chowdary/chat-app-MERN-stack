

//get all users except the loggedin user

import User from "../models/User.js";
import Message from "../models/message.js";
import cloudinary from "../lib/cloudinary.js";
import {io,usersocketMap} from "../server.js";

export const getUsersForSidebar = async (req,res)=>{

    try{

        const userId = req.User._id;
        const filteredUsers = await User.find({_id:{$ne:userId}}).select("-password");

        //count no.of messages not seen

        const unseenMessages = {}
        const promises = filteredUsers.mao(async(unseenMessages)=>{

            const messages = await Message.find({senderId:User._id,receiverId:userId ,seen:false})

            if(messages.length > 0){

                unseenMessages[User._id] = messages.length;



            }
        })

        await Promise.all(promises);
        res.json({success:true,users:filteredUsers,unseenMessages})

    }catch(error){
        console.log(error.message);
         res.json({success:false,message:error.message})


    }

}

//get all messages gor selected user

export const getMessages = async (req,res)=>{
    try{

        const {id:selevctedUserId} = req.params;

        const myId = req.User._id;

        //get the mesages

        const messages = await Message.find({
            $or:[
                {senderId:myId,receiverId:selevctedUserId},
                {senderId:selectedUserId,receiverId:myId},
            ]
            
        })

        //mark messages as read

        await Message.updateMany({senderId:selectedUserId,receiverId:myId},{seen:true});

        //generate the response

        res.json({success:true,messages})

    }catch(error){
        console.log(error.message);
        res.json({success:false,message:error.message})
    }
    
}

//api to mark message as seen using message id

export const markMessageAsSeen = async(req,res)=>{
    try{
            const {id} = req.params;

            await Message.findByIdAndUpdate(id,{seen:true})
            res.json({success:true})


    }catch(error){
        console.log(error.message);
        res.json({success:false,message:error.message})
        
    }
}

//send message to selected user

export const sendMessage = async (req,res)=>{

    try{

        const{text,image} = req.body;
        const receiverId = req.params.id
        const senderId = req.user._id;

        //uploadiamge on cloudinary

        let imageUrl ;

        if(image){

            const uploadResponse = await cloudinary.uploader.upload(image)

            imageUrl = uploadResponse.secure_url;

        }

        const newMessage = await Message.create({

            senderId,
            receiverId,
            text,
            image:imageUrl
        })

        //emit new messages to the recievers socket

        const recieversocketId = usersocketMap[recieversocketId];
        if(recieversocketId){

            io.to(recieversocketId).emit("newMessage",Message)
        }

        res.json({success:true,newMessage});

    }catch(error){
        console.log(error.Message);
        res.json({success:false,message:error.message})
    }
}