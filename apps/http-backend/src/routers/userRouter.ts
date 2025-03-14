import { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import {JWT_SECRET} from "@repo/backend-common/config";
import {createUserSchema, SignUserSchema} from "@repo/common/types";
import {prisma} from "@repo/db/client"

const userRouter: Router = Router();

userRouter.post("/signup", async (req:Request, res: Response) =>{
  try{
  
    const {username, password, name} = createUserSchema.parse(await req.body());
    const user = prisma.user.findFirst({
      where:{
        email
      }
    })
    res.send("user created successfully");
  } catch(err){
    console.log(err);
  }
})

userRouter.post("/signin", async (req:Request, res:Response) => {
  const {username, password} = SignUserSchema.parse(await req.body());
  const token = jwt.sign(username, JWT_SECRET);

  res.send(token);
})

userRouter.post("/room", (req:Request, res: Response) => {

})

export default userRouter;