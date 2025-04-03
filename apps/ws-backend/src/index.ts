import {WebSocket, WebSocketServer} from 'ws';
import jwt, { JwtPayload } from 'jsonwebtoken';
import {prisma} from "@repo/db/client";
import {JWT_SECRET} from "@repo/backend-common/config";
const PORT = 8080;
interface User {
  ws: WebSocket;
  rooms: string[];
  userId: string;
}

const users : User[] = [];

const wss = new WebSocketServer({port: 8080});

const checkToken = (token: string ): string | null => {
  try{
   const decoded = jwt.verify(token, JWT_SECRET);
   if(typeof decoded == 'string')
      return null;

   if(!decoded || !decoded.userId)
    return null; 

   const userId = decoded.userId; 
   return userId;
} catch (err){
  console.log(err)
  return null
}
}
wss.on('connection', (ws, req) => {
  const url: string | undefined = req.url!;
   if(!url)
      return;
  const queryParams = new URLSearchParams(url.split('?')[1]);
  const token = queryParams.get('token') || "";
  const userId = checkToken(token);
  if(!userId){
    ws.close();
    return;
  }

  console.log("Connected to Websockte server at 8080")

  users.push({ws, rooms:[], userId});

  ws.on('message', async (data) => { 
    try{
    const parsedData = JSON.parse(data as unknown as string);
      
    switch(parsedData.type){
      case "join-room":
        let user = users.find(x=> x.userId === userId)
        user?.rooms.push(parsedData.roomId);
        break;
  
      case 'leave-room':
        user = users.find(x => x.userId === userId);
        if(!user)
          return;
        user.rooms = user?.rooms.filter(x => x == parsedData.roomId)
        break;

      case 'chat':
        const {message, roomId}= parsedData;
        const createdMessage = await prisma.chat.create({
          data:{
            roomId: Number(roomId),
            message,
            userId
          }
        })
        console.log(users);
        users.forEach(user => {
          if(user.rooms.includes(roomId)){
            user.ws.send(JSON.stringify({
              type: "chat",
              message,
              roomId
            }))
          }
        })
      }
    }catch(err){
      console.log(err);
    }
  })
})