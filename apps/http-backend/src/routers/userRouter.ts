import { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import {JWT_SECRET} from "@repo/backend-common/config";
import {createUserSchema, SignUserSchema} from "@repo/common/types";
import {prisma} from "@repo/db/client"
import bcrypt from "bcryptjs"

const userRouter: Router = Router();

userRouter.post("/signup", async (req:Request, res: Response) =>{
  try{
  
    const {email, password, name} = createUserSchema.parse(await req.body());
    
    const user = prisma.user.findFirst({
      where:{
        email
      }
    })
    
    if(user != null)
      res.status(400).json({error:"User already exists"})
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

    res.status(200).json({user: newUser})
  } catch(err){
    console.log(err);
    res.status(500).json({error: "Internal server error"});
  }
})

userRouter.post("/signin", async (req:Request, res:Response) => {
  try{
    const {email, password} = SignUserSchema.parse(await req.body());
    const user = await prisma.user.findFirst({
      where:{
        email
      }
    })

    if(!user)
    res.status(400).json({error: "User does not exist"});

    const isCorrectPassword: boolean = await bcrypt.compare(password, user!.password)

    if(!user)
      res.status(400).json({error: "Incorrect password"});

    const token = jwt.sign(email, JWT_SECRET);
    res.status(200).json(token)
  } catch(err){
    console.log(err)
    res.status(500).json({error:"Internal server error"});
  }
})

userRouter.post("/room", (req:Request, res: Response) => {

})

export default userRouter;