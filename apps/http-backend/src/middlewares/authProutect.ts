import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from "@repo/backend-common/config";

export const authProtect = async (req:Request ,res:Response, next:NextFunction) => {
  try{
    const token = req.cookies.token;
    if(!token){
      res.send("Missing token, authentication failed");
      return;
    }

    const decoded = jwt.verify(token as string, JWT_SECRET);

    if(decoded){
        req.userId = (decoded as JwtPayload).userId;
    } else{
      res.status(403).json({
        message: 'Unauthorized'
      })
      return;
    }
    
    next();
  }
  catch(err){
    res.send("Invalid request");
    console.log(err);
  }
}