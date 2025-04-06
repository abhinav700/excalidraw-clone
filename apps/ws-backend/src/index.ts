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
  console.log("size of users array: ", users.length);

  ws.on('message', async (data) => { 
    try{
    const parsedData = await JSON.parse(data as unknown as string);
    console.log("Data received when reahching ws: ", parsedData)
    switch(parsedData.type){
      case "join-room":
        let user = users.find(x=> x.userId === userId)
        user?.rooms.push(parsedData.roomId);
        console.log("----JOIN ROOM INSIDE WEB SOCKET BACKEND---");
        break;
  
      case 'leave-room':
        user = users.find(x => x.userId === userId);
        if(!user)
          return;
        user.rooms = user?.rooms.filter(x => x == parsedData.roomId)
        break;

      case 'chat':
        const {message, roomId}= parsedData;
        console.log("INSIDE HTTP_BACKEND CHAT EVENT\n\n\n")
        // console.log("message: ",message);
        const createdMessage = await prisma.chat.create({
          data:{
            roomId: Number(roomId),
            message,
            userId
          }
        })
        users.forEach(user => {
          if(user.rooms.includes(roomId)){
            console.log(`Checking user ${user.userId} with rooms: ${JSON.stringify(user.rooms)} for roomId: ${roomId}`);

            user.ws.send(JSON.stringify({
              type: "chat",
              message,
              roomId
            }))
          }
        })
        // console.log("\n\n\nEXITING HTTP_BACKEND CHAT EVENT\n")
      }
    }catch(err){
      console.log(err);
    }
  })
})