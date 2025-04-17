import { useEffect, useState } from "react";
import {JOIN_ROOM} from "@repo/common/constants"
const useSocket = ({roomId} : {roomId: string}) => {
  const [loading, setLoading]= useState<boolean>(true);
  const [socket, setSocket] = useState<WebSocket | null>();

  useEffect(() => {
    try{
      const ws = new WebSocket(`ws://localhost:8080?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhYWUxNDc1Ny1jMDZjLTQ4YWYtOTE1Mi0zNzVkNDlmZTViYjIiLCJpYXQiOjE3NDM4NzI1NDF9.h9cR0xeHRQZZgBjBsXu2Op5wjJnrJf2rkWTZDzJMfBE`);

      ws.onopen = () => {
        setSocket(ws);

        const data = JSON.stringify({
          type: JOIN_ROOM,
          roomId
        });

        ws.send(data);
      };
      
      return () => {
        ws.close();
      }
    } catch (err){
      console.log(err);
    }finally{
      setLoading((loading :boolean) => false);
    }
  }, [])

  return {socket, loading};
}

export default useSocket;