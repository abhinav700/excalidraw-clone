import { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import {JWT_SECRET} from "@repo/backend-common/config";
import {createRoomSchema, createUserSchema, SignUserSchema} from "@repo/common/types";
import {prisma} from "@repo/db/client"
import bcrypt from "bcryptjs"
import { gateRoom } from "../middlewares/gateRoom";

const userRouter: Router = Router();

userRouter.post("/signup", async (req:Request, res: Response) =>{
  try{
  
    const {email, password, name} = createUserSchema.parse(await req.body);
    
    const user = await prisma.user.findFirst({
      where:{
        email
      }
    })
    
    console.log("INSIDE CREATE USER ROUTE:", user);

    if(user != null){
      res.status(400).json({error:"User already exists"})
      return;
    }
    
    console.log("Code Executing after sending response") 

    const rounds = 10;
    const salt = await bcrypt.genSalt(rounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data:{
        name,
        email,
        password: hashedPassword
      }
    })

    res.status(200).json({user: newUser});
    return;
  } catch(err){
    console.log(err);
    res.status(500).json({error: "Internal server error"});
  }
})

userRouter.post("/signin", async (req:Request, res:Response) => {
  try{
    const parsedRequest = SignUserSchema.safeParse(await req.body);
    if(!parsedRequest.success){
      res.status(200).json({
        message: "incorrect input"
      })
      return;
    }

    const {email, password} = parsedRequest.data;

    const user = await prisma.user.findFirst({
          where:{
            email
          }
        })

    if(!user){
      res.status(400).json({error: "User does not exist"});
      return;
    }

    const isCorrectPassword: boolean = await bcrypt.compare(password, user.password)
    if(!isCorrectPassword){
      res.status(401).json({error:"Unauthorized."})
      return;
    }

    console.log("JWT_SECRET: ",JWT_SECRET);

    const token = jwt.sign(user.id, JWT_SECRET);
    res.status(200).json(token)
    return;
  } catch(err){
    console.log(err)
    res.status(500).json({error:"Internal server error"});
  }
})

userRouter.post("/room",gateRoom, async (req:Request, res: Response) => {
  try{
    const parsedRequest = createRoomSchema.safeParse(await req.body);
    if(!parsedRequest.success){
      res.json({
        message: "incorrect input"
      })
      return;
    }

    const userId = req.userId;
    const room = await prisma.room.create({
      data:{
        slug: parsedRequest.data!.name,
        adminId: userId!
      }

    })
  } catch(err){
    console.log(err);
  }
})

userRouter.get("/chats/:roomId", async (req: Request, res: Response) => {
  try{
    const roomId = Number(req.params.roomId);
    const messages = await prisma.chat.findMany({
      where:{
        roomId
      },
      orderBy:{
        id:"desc"
      }, 
      take:50
    })
    res.status(200).json(messages);
  } catch (err){
    console.log(err);
  }

})

export default userRouter;