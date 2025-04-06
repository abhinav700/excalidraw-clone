import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from "@repo/backend-common/config";

export const gateRoom = async (req:Request ,res:Response, next:NextFunction) => {
  try{
    const token = req.headers['authorization'];
    if(!token)
      res.send("Missing token, authentication failed");

    const decoded = jwt.verify(token as string, JWT_SECRET);

    console.log("INSIDE GATE ROOM\n\n\n")
    console.log(decoded);
    console.log('\n\n\nDEBUGGING INSDIE GATE ROOM');
    if(decoded){
        req.userId = (decoded as JwtPayload).userId;
    } else{
      res.status(403).json({
        message: 'Unauthorized'
      })
    }
    
    next();
  }
  catch(err){
    res.send("Invalid request");
    console.log(err);
  }


}