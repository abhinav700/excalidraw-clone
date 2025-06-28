import { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import {JWT_SECRET} from "@repo/backend-common/config";
import {prisma} from "@repo/db/client"
import bcrypt from "bcryptjs"
import { authProtect } from "../middlewares/authProutect";
import { SignInUserSchema, SignUpUserSchema } from "@repo/common/types";

const userRouter: Router = Router();

userRouter.post("/signup", async (req:Request, res: Response) =>{
  try{
  
    const {email, password, confirmPassword, name} = SignUpUserSchema.parse(await req.body);
    if(password != confirmPassword){
      res.status(401).json({error: "Passwords do not match"});
      return;
    }
    
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
  
    const token = jwt.sign({userId: newUser.id}, JWT_SECRET);

     const thirtyMinutesFromNow = 1000 * 60 * 30;

    res.status(200).cookie('token', token, {
      httpOnly: true,
      maxAge: thirtyMinutesFromNow,
      path:'/'
    }).json({user: newUser});

  } catch(err){
    console.log(err);
    res.status(500).json({error: "Internal server error"});
  }
})

userRouter.post("/signin", async (req:Request, res:Response) => {
  try{
    const parsedRequest = SignInUserSchema.safeParse(await req.body);
   
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

    const thirtyMinutesFromNow = 1000 * 60 * 30;

    res.status(200).cookie('token', token, {
      httpOnly: true,
      maxAge: thirtyMinutesFromNow,
      path:'/'
    }).send();

    return;
  } catch(err){
    console.log(err)
    res.status(500).json({error:"Internal server error"});
  }
})

userRouter.post('/logout', authProtect, async (req: Request, res: Response) => {
  try{
   res.status(200).cookie('token', '', {
      httpOnly: true,
      path:'/'
    }).json({success: true});
 
  } catch(err){
    console.log(err);
  }
})

export default userRouter;