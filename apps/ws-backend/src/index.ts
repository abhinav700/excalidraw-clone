import {WebSocketServer} from 'ws';
import jwt, { JwtPayload } from 'jsonwebtoken'
const PORT = 8080;

const wss = new WebSocketServer({port: 8080});
export const JWT_SECRET="l;jkssfasfd"

wss.on('connection', (ws, request) => {
  const url: string | undefined = request.url!;
  
  if(!url)
    return;
  const queryParams = new URLSearchParams(url.split('?')[1]);
  const token = queryParams.get('token') || "";
  const decoded = jwt.verify(token, JWT_SECRET)

  if(!decoded || !(decoded as JwtPayload).userId){
    ws.close();
    return;
  }

  ws.on('message', (data) => {
    
    ws.send('received data')
  })
})