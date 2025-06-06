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
    
    if(user != null){
      res.status(400).json({error:"User already exists"})
      return;
    }

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


    const token = jwt.sign({userId: user.id}, JWT_SECRET);
    res.status(200).json(token)
    return;
  } catch(err){
    console.log(err)
    res.status(500).json({error:"Internal server error"});
  }
})


export default userRouter;