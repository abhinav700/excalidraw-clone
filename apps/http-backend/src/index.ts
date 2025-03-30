import express from "express";
import userRouter from "./routers/userRouter";
import { gateRoom } from "./middlewares/gateRoom";
import { Request, Response } from "express";
import { createRoomSchema } from "@repo/common/types";
import { prisma } from "@repo/db/client";
const app = express();

app.use(express.json());

app.use("/user", userRouter)
app.post("/room",gateRoom, async (req:Request, res: Response) => {
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

app.get("/chats/:roomId", async (req: Request, res: Response) => {
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
    res.status(200).json({messages});
  } catch (err){
    console.log(err);
  }

})

app.get("/room/:slug", async (req:Request, res: Response) =>{
  try{
    const slug = req.params.slug;
    const room = await prisma.room.findFirst({
      where: {
        slug
      }
    })
    res.status(200).json({room});
    return;
  } catch (err){
    console.log(err);
  }
})
const PORT = 3001;

app.listen(PORT, ()=>{
  console.log("http server has started at port : ",PORT);
})