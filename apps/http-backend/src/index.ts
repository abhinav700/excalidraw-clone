import express from "express";
import userRouter from "./routers/userRouter";

const app = express();

app.use(express.json());

app.use("/user", userRouter)

const PORT = 3001;

app.listen(PORT, ()=>{
  console.log("http server has started at port : ",PORT);
})