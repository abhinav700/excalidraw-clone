import {WebSocketServer} from 'ws';

const PORT = 8080;

const wss = new WebSocketServer({port: 8080});

wss.on('connection', (ws) => {
  ws.send('hello')
  console.log("connected")
  ws.on('message', (data) => {
    const message = data.toString();
    console.log("Received data: ",message);
    ws.send('received data')
  })
})